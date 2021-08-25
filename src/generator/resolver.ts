import type { OpenAPIV3 } from 'openapi-types';
import ts, { factory } from 'typescript';
import { compact } from 'utils/fp';
import { dereferenceName } from 'utils/openapi';
import { isArraySchemaObject, isReferenceObject } from 'utils/type-guards';

export const resolveSchema = (
  schemaObject:
    | OpenAPIV3.ReferenceObject
    | OpenAPIV3.NonArraySchemaObject
    | OpenAPIV3.ArraySchemaObject,
): ts.TypeNode =>
  isReferenceObject(schemaObject)
    ? resolveReferenceSchemaOrThrow(schemaObject.$ref)
    : factory.createUnionTypeNode(
        compact([
          resolveInlineSchema(schemaObject),
          schemaObject.nullable &&
            factory.createLiteralTypeNode(factory.createNull()),
        ]),
      );

const resolveReferenceSchemaOrThrow = (
  $ref: OpenAPIV3.ReferenceObject['$ref'],
) => {
  if ($ref.startsWith('#/components/schemas')) {
    return factory.createTypeReferenceNode(
      factory.createIdentifier(dereferenceName($ref)),
    );
  }
  throw Error(
    `The reference '${$ref}' does not match the pattern '#/components/schemas/*'`,
  );
};

const resolveInlineSchema = (
  schemaObject: OpenAPIV3.NonArraySchemaObject | OpenAPIV3.ArraySchemaObject,
) => {
  switch (schemaObject.type) {
    case 'array':
      return resolveArraySchema(schemaObject);
    case 'boolean':
      return factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);
    case 'integer':
    case 'number':
      return factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
    // This is a bandaid fix until the openapi-types packages adds null to the
    // types which is available with OpenAPI v3.1
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    case 'null':
    // @ts-ignore
    // eslint-disable-next-line no-fallthrough
    case "'null'":
      return factory.createLiteralTypeNode(factory.createNull());
    /* eslint-enable @typescript-eslint/ban-ts-comment */
    case 'object':
      return resolveObjectSchema(schemaObject);
    case 'string':
      return resolveStringSchema(schemaObject);
    default:
      return resolveFallbackSchema(schemaObject);
  }
};

const resolveFallbackSchema = (
  schemaObject: OpenAPIV3.NonArraySchemaObject,
): ts.TypeNode =>
  tryResolveAmbiguousSchema(schemaObject) ??
  tryResolveCombinedSchema(schemaObject) ??
  tryResolveDictionarySchema(schemaObject) ??
  factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword);

const resolveArraySchema = (schemaObject: OpenAPIV3.ArraySchemaObject) =>
  factory.createTypeOperatorNode(
    ts.SyntaxKind.ReadonlyKeyword,
    factory.createArrayTypeNode(resolveSchema(schemaObject.items)),
  );

const resolveObjectSchema = (schemaObject: OpenAPIV3.NonArraySchemaObject) => {
  const { required, properties, additionalProperties } = schemaObject;

  if (properties === undefined) {
    return resolveFallbackSchema(schemaObject);
  }

  const isRequired = (property: string) => (required ?? []).includes(property);

  const objectProperties = Object.entries(properties).map(([name, prop]) =>
    factory.createPropertySignature(
      [factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)],
      factory.createIdentifier(name),
      isRequired(name)
        ? undefined
        : factory.createToken(ts.SyntaxKind.QuestionToken),
      resolveSchema(prop),
    ),
  );

  const objectTypeNode =
    objectProperties.length === 0
      ? factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword)
      : factory.createTypeLiteralNode(objectProperties);

  return factory.createIntersectionTypeNode(
    compact([
      objectTypeNode,
      additionalProperties === true &&
        factory.createTypeReferenceNode(factory.createIdentifier('Record'), [
          factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
          factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword),
        ]),
    ]),
  );
};

const resolveStringSchema = (schemaObject: OpenAPIV3.NonArraySchemaObject) => {
  return schemaObject.enum === undefined
    ? factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
    : factory.createUnionTypeNode(
        schemaObject.enum.map(enumValue =>
          factory.createLiteralTypeNode(
            factory.createStringLiteral(String(enumValue)),
          ),
        ),
      );
};

const tryResolveAmbiguousSchema = (
  // The type of this parameter is artificially expanded since we want to
  // handle schema objects that are arrays without an explicit type property.
  // This is necessary since the typing assumes arrays always include a type
  // property in contrast to the actual OpenAPI specification.
  schemaObject: OpenAPIV3.ArraySchemaObject | OpenAPIV3.NonArraySchemaObject,
) => {
  if (isArraySchemaObject(schemaObject)) {
    return resolveArraySchema(schemaObject);
  }

  if (schemaObject.properties !== undefined) {
    return resolveObjectSchema(schemaObject);
  }

  return undefined;
};

const tryResolveCombinedSchema = (
  schemaObject: OpenAPIV3.NonArraySchemaObject,
) => {
  if (schemaObject.allOf) {
    return factory.createIntersectionTypeNode(
      schemaObject.allOf.map(resolveSchema),
    );
  }

  if (schemaObject.oneOf) {
    return factory.createUnionTypeNode(schemaObject.oneOf.map(resolveSchema));
  }

  return undefined;
};

const tryResolveDictionarySchema = (
  schemaObject: OpenAPIV3.NonArraySchemaObject,
) => {
  const { additionalProperties } = schemaObject;

  if (
    additionalProperties === undefined ||
    typeof additionalProperties === 'boolean'
  ) {
    return undefined;
  }

  return factory.createTypeReferenceNode(factory.createIdentifier('Record'), [
    factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
    resolveSchema(additionalProperties),
  ]);
};
