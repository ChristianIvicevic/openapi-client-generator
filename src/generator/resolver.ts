import { pascalCase } from 'change-case';
import type { Context } from 'generator/types';
import type { OpenAPIV3 } from 'openapi-types';
import { partial } from 'ramda';
import ts, { factory } from 'typescript';
import { isArraySchemaObject, isReferenceObject } from 'utils/type-guards';

export const resolveSchema = (
  context: Context,
  schemaObject:
    | OpenAPIV3.ReferenceObject
    | OpenAPIV3.NonArraySchemaObject
    | OpenAPIV3.ArraySchemaObject,
): ts.TypeNode => {
  if (isReferenceObject(schemaObject)) {
    return resolveReferenceSchemaOrThrow(context, schemaObject.$ref);
  }

  return schemaObject.nullable
    ? factory.createUnionTypeNode([
        resolveInlineSchema(context, schemaObject),
        factory.createLiteralTypeNode(factory.createNull()),
      ])
    : resolveInlineSchema(context, schemaObject);
};

const resolveReferenceSchemaOrThrow = (
  { referencedSchemas }: Context,
  $ref: OpenAPIV3.ReferenceObject['$ref'],
) => {
  if ($ref.startsWith('#/components/schemas')) {
    const schema = pascalCase($ref.replace('#/components/schemas/', ''));
    referencedSchemas.push(schema);
    return factory.createTypeReferenceNode(factory.createIdentifier(schema));
  }
  throw Error(
    `The reference '${$ref}' does not match the pattern '#/components/schemas/*'`,
  );
};

const resolveInlineSchema = (
  context: Context,
  schemaObject: OpenAPIV3.NonArraySchemaObject | OpenAPIV3.ArraySchemaObject,
) => {
  switch (schemaObject.type) {
    case 'array':
      return resolveArraySchema(context, schemaObject);
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
      return resolveObjectSchema(context, schemaObject);
    case 'string':
      return resolveStringSchema(context, schemaObject);
    default:
      return resolveFallbackSchema(context, schemaObject);
  }
};

const resolveFallbackSchema = (
  context: Context,
  schemaObject: OpenAPIV3.NonArraySchemaObject,
): ts.TypeNode =>
  tryResolveAmbiguousSchema(context, schemaObject) ??
  tryResolveCombinedSchema(context, schemaObject) ??
  tryResolveDictionarySchema(context, schemaObject) ??
  factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword);

const resolveArraySchema = (
  context: Context,
  schemaObject: OpenAPIV3.ArraySchemaObject,
) =>
  factory.createTypeOperatorNode(
    ts.SyntaxKind.ReadonlyKeyword,
    factory.createArrayTypeNode(resolveSchema(context, schemaObject.items)),
  );

const resolveObjectSchema = (
  context: Context,
  schemaObject: OpenAPIV3.NonArraySchemaObject,
) => {
  const { required, properties, additionalProperties } = schemaObject;

  if (properties === undefined) {
    return resolveFallbackSchema(context, schemaObject);
  }

  const isRequired = (property: string) => (required ?? []).includes(property);

  const objectProperties = Object.entries(properties).map(([name, prop]) =>
    factory.createPropertySignature(
      [factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)],
      factory.createIdentifier(name),
      isRequired(name)
        ? undefined
        : factory.createToken(ts.SyntaxKind.QuestionToken),
      resolveSchema(context, prop),
    ),
  );

  const objectTypeNode =
    objectProperties.length === 0
      ? factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword)
      : factory.createTypeLiteralNode(objectProperties);

  return additionalProperties === true
    ? factory.createIntersectionTypeNode([
        objectTypeNode,
        factory.createTypeReferenceNode(factory.createIdentifier('Record'), [
          factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
          factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword),
        ]),
      ])
    : objectTypeNode;
};

const resolveStringSchema = (
  _context: Context,
  schemaObject: OpenAPIV3.NonArraySchemaObject,
) => {
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
  context: Context,
  // The type of this parameter is artificially expanded since we want to
  // handle schema objects that are arrays without an explicit type property.
  // This is necessary since the typing assumes arrays always include a type
  // property in contrast to the actual OpenAPI specification.
  schemaObject: OpenAPIV3.ArraySchemaObject | OpenAPIV3.NonArraySchemaObject,
) => {
  if (isArraySchemaObject(schemaObject)) {
    return resolveArraySchema(context, schemaObject);
  }

  if (schemaObject.properties !== undefined) {
    return resolveObjectSchema(context, schemaObject);
  }

  return undefined;
};

const tryResolveCombinedSchema = (
  context: Context,
  schemaObject: OpenAPIV3.NonArraySchemaObject,
) => {
  if (schemaObject.allOf) {
    return factory.createIntersectionTypeNode(
      schemaObject.allOf.map(partial(resolveSchema, [context])),
    );
  }

  if (schemaObject.oneOf) {
    return factory.createUnionTypeNode(
      schemaObject.oneOf.map(partial(resolveSchema, [context])),
    );
  }

  return undefined;
};

const tryResolveDictionarySchema = (
  context: Context,
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
    resolveSchema(context, additionalProperties),
  ]);
};
