import * as E from 'fp-ts/Either';
import { flow, pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import { UnsupportedMixedSchemaObjectError } from 'generator/errors';
import type { GeneratorOptions } from 'generator/options';
import {
  applicativeValidation,
  compileNodes,
  dereferenceQualifiedName,
  formatSchemaName,
  isArraySchemaObject,
  isReferenceObject,
  liftN,
} from 'generator/utils';
import type { OpenAPIV3_1 } from 'openapi-types';
import ts, { factory } from 'typescript';

/**
 * Attempts to generate a Typescript source file for all schemas declared in the
 * specified document. Returns an `Either<string[], string>` with the generated
 * and formatted source code in the right case; otherwise, returns an array of
 * human-readable error messages collected along the way in the left case.
 * @param document OpenAPI document to parse.
 * @param options Options passed to the generator.
 */
export const generateSchemas = (
  document: OpenAPIV3_1.Document,
  options?: GeneratorOptions,
) =>
  pipe(
    document.components?.schemas ?? {},
    R.toArray,
    RA.map(([name, schemaObject]) =>
      liftN(generateSchemaNodes)(schemaObject, formatSchemaName(name)),
    ),
    RA.sequence(applicativeValidation),
    E.mapLeft(RA.map(error => error.message)),
    E.map(flow(RA.flatten, compileNodes)),
  );

const generateSchemaNodes = (
  schemaObject: OpenAPIV3_1.SchemaObject,
  schemaName: string,
) =>
  pipe(
    resolveSchemaOrReferenceObject(schemaObject, schemaName),
    E.map(schemaNode =>
      pipe(
        [
          (schemaObject.description?.length ?? 0) !== 0
            ? factory.createJSDocComment(schemaObject.description, [])
            : undefined,
          factory.createTypeAliasDeclaration(
            undefined,
            [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
            factory.createIdentifier(schemaName),
            undefined,
            schemaNode,
          ),
        ],
        RA.filterMap(O.fromNullable),
      ),
    ),
  );

export const resolveSchemaOrReferenceObject = (
  schemaOrReferenceObject:
    | OpenAPIV3_1.SchemaObject
    | OpenAPIV3_1.ReferenceObject,
  schemaName = '(anonymous)',
) =>
  isReferenceObject(schemaOrReferenceObject)
    ? resolveReferenceObject(schemaOrReferenceObject)
    : resolveSchemaObject(schemaOrReferenceObject, schemaName);

const resolveReferenceObject = (referenceObject: OpenAPIV3_1.ReferenceObject) =>
  pipe(
    dereferenceQualifiedName(referenceObject),
    E.map(flow(factory.createIdentifier, factory.createTypeReferenceNode)),
  );

const resolveSchemaObject = (
  schemaObject: OpenAPIV3_1.SchemaObject,
  schemaName = '(anonymous)',
): E.Either<Error, ts.TypeNode> => {
  // The OpenAPI v3.1 standard has removed the nullable flag from the schema
  // object in favor of a mixed schema object that allows `type` to be an array.
  // Unfortunetely it is needlessly complicated to distinguish a mixed schema
  // from a common schema object, and thus I made the decision to not support
  // mixed schemas for the time being.
  if (Array.isArray(schemaObject.type)) {
    return E.left(new UnsupportedMixedSchemaObjectError(schemaName));
  }

  switch (schemaObject.type) {
    // Scalar types.
    case 'boolean':
      return E.right(
        factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword),
      );
    case 'integer':
    case 'number':
      return E.right(
        factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
      );
    case 'null':
      return E.right(factory.createLiteralTypeNode(factory.createNull()));

    // Complex types.
    case 'string':
      return E.right(resolveStringSchemaObject(schemaObject));
    case 'array':
      return resolveArraySchemaObject(schemaObject);
    case 'object':
      return resolveObjectSchemaObject(schemaObject);
    default:
      return resolveFallbackSchemaObject(
        schemaObject as OpenAPIV3_1.NonArraySchemaObject,
      );
  }
};

const resolveStringSchemaObject = (
  schemaObject: OpenAPIV3_1.NonArraySchemaObject,
) =>
  schemaObject.enum === undefined
    ? factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
    : factory.createUnionTypeNode(
        schemaObject.enum.map(enumValue =>
          factory.createLiteralTypeNode(
            factory.createStringLiteral(String(enumValue)),
          ),
        ),
      );

const resolveArraySchemaObject = (
  schemaObject: OpenAPIV3_1.ArraySchemaObject,
) =>
  pipe(
    resolveSchemaOrReferenceObject(schemaObject.items),
    E.map(resolvedNode =>
      factory.createTypeOperatorNode(
        ts.SyntaxKind.ReadonlyKeyword,
        factory.createArrayTypeNode(resolvedNode),
      ),
    ),
  );

const resolveObjectSchemaObject = (
  schemaObject: OpenAPIV3_1.NonArraySchemaObject,
): E.Either<Error, ts.TypeNode> => {
  const { required, properties, additionalProperties } = schemaObject;

  return properties === undefined
    ? resolveFallbackSchemaObject(schemaObject)
    : pipe(
        properties,
        R.toArray,
        RA.map(([propertyName, property]) =>
          pipe(
            resolveSchemaOrReferenceObject(property),
            E.map(propertyNode =>
              factory.createPropertySignature(
                [factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)],
                factory.createIdentifier(propertyName),
                (required ?? []).includes(propertyName)
                  ? undefined
                  : factory.createToken(ts.SyntaxKind.QuestionToken),
                propertyNode,
              ),
            ),
          ),
        ),
        E.sequenceArray,
        E.map(objectProperties =>
          objectProperties.length === 0
            ? factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword)
            : factory.createTypeLiteralNode(objectProperties),
        ),
        E.map(objectPropertiesNode =>
          factory.createIntersectionTypeNode(
            pipe(
              [
                objectPropertiesNode,
                additionalProperties === true
                  ? factory.createTypeReferenceNode(
                      factory.createIdentifier('Record'),
                      [
                        factory.createKeywordTypeNode(
                          ts.SyntaxKind.StringKeyword,
                        ),
                        factory.createKeywordTypeNode(
                          ts.SyntaxKind.UnknownKeyword,
                        ),
                      ],
                    )
                  : undefined,
              ],
              RA.filterMap(O.fromNullable),
            ),
          ),
        ),
      );
};

const resolveFallbackSchemaObject = (
  schemaObject: OpenAPIV3_1.NonArraySchemaObject,
) =>
  pipe(
    resolveAmbiguousSchema(schemaObject),
    O.altW(() => resolveCombinedSchema(schemaObject)),
    O.altW(() => resolveDictionarySchema(schemaObject)),
    O.getOrElseW(() =>
      E.right(factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword)),
    ),
  );

const resolveAmbiguousSchema = (
  // The type of this parameter is artificially expanded since we want to
  // handle schema objects that are arrays without an explicit type property.
  // This is necessary since the typing assumes arrays always include a type
  // property in contrast to the actual OpenAPI specification.
  schemaObject:
    | OpenAPIV3_1.ArraySchemaObject
    | OpenAPIV3_1.NonArraySchemaObject,
) => {
  if (isArraySchemaObject(schemaObject)) {
    return O.some(resolveArraySchemaObject(schemaObject));
  }

  if (schemaObject.properties !== undefined) {
    return O.some(resolveObjectSchemaObject(schemaObject));
  }

  return O.none;
};

const resolveCombinedSchema = (
  schemaObject: OpenAPIV3_1.NonArraySchemaObject,
) => {
  const resolve = <T>(
    schemaOrReferenceObjects: T[],
    factoryFunction: (nodes: readonly ts.TypeNode[]) => ts.TypeNode,
  ) =>
    pipe(
      schemaOrReferenceObjects,
      RA.fromArray,
      RA.map(resolveSchemaOrReferenceObject),
      E.sequenceArray,
      E.map(factoryFunction),
      O.some,
    );

  if (schemaObject.allOf) {
    return resolve(schemaObject.allOf, factory.createIntersectionTypeNode);
  }

  if (schemaObject.oneOf) {
    return resolve(schemaObject.oneOf, factory.createUnionTypeNode);
  }

  return O.none;
};

const resolveDictionarySchema = (
  schemaObject: OpenAPIV3_1.NonArraySchemaObject,
) => {
  const { additionalProperties } = schemaObject;

  return additionalProperties === undefined ||
    typeof additionalProperties === 'boolean'
    ? O.none
    : pipe(
        resolveSchemaOrReferenceObject(additionalProperties),
        E.map(resolvedNode =>
          factory.createTypeReferenceNode(factory.createIdentifier('Record'), [
            factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
            resolvedNode,
          ]),
        ),
        O.some,
      );
};
