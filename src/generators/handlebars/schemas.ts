import { pascalCase } from 'change-case';
import type { OpenAPIV3 } from 'openapi-types';
import { assertIsDefined } from 'utils/assert';
import { isReferenceObject } from 'utils/type-guards';

export const generateSchema = (
  schemaObject:
    | OpenAPIV3.ReferenceObject
    | OpenAPIV3.NonArraySchemaObject
    | OpenAPIV3.ArraySchemaObject,
): string => {
  if (isReferenceObject(schemaObject)) {
    return generateRefSchema(schemaObject.$ref);
  }

  const nullable = schemaObject.nullable ? ' | null' : '';
  return `${generateScalarSchema(schemaObject)}${nullable}`;
};

const generateScalarSchema = (
  schemaObject: OpenAPIV3.ArraySchemaObject | OpenAPIV3.NonArraySchemaObject,
) => {
  switch (schemaObject.type) {
    case 'array':
      return generateArraySchema(schemaObject);

    case 'boolean':
      return 'boolean';

    case 'integer':
    case 'number':
      return 'number';

    /* eslint-disable @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    case 'null':
    // @ts-ignore
    // eslint-disable-next-line no-fallthrough
    case "'null'":
      return 'null';
    /* eslint-enable @typescript-eslint/ban-ts-comment */

    case 'object':
      return generateObjectSchema(schemaObject);

    case 'string':
      return generateStringSchema(schemaObject);

    default:
      return (
        generateCombinedSchema(schemaObject) ??
        generateDictionarySchema(schemaObject) ??
        'unknown'
      );
  }
};

const generateRefSchema = ($ref: OpenAPIV3.ReferenceObject['$ref']) => {
  if ($ref.startsWith('#/components/schemas')) {
    return pascalCase($ref.replace('#/components/schemas/', ''));
  }

  throw Error(
    `The reference '${$ref}' does not match the pattern '#/components/schemas/*'`,
  );
};

const generateArraySchema = ({ items }: OpenAPIV3.ArraySchemaObject) =>
  `readonly (${generateSchema(items)})[]`;

const generateStringSchema = ({
  enum: stringLiterals,
}: OpenAPIV3.NonArraySchemaObject) => {
  if (stringLiterals !== undefined) {
    return stringLiterals.map(literal => `'${String(literal)}'`).join(' | ');
  }

  return 'string';
};

const generateCombinedSchema = (
  schemaObject: OpenAPIV3.NonArraySchemaObject,
) => {
  if (schemaObject.allOf) {
    return generateAllOfSchema(schemaObject);
  }

  if (schemaObject.oneOf) {
    return generateOneOfSchema(schemaObject);
  }

  return undefined;
};

const generateAllOfSchema = ({ allOf }: OpenAPIV3.NonArraySchemaObject) => {
  assertIsDefined(allOf);

  return allOf.map(generateSchema).join(' & ');
};

const generateOneOfSchema = ({ oneOf }: OpenAPIV3.NonArraySchemaObject) => {
  assertIsDefined(oneOf);

  return oneOf.map(generateSchema).join(' | ');
};

const generateObjectSchema = (schemaObject: OpenAPIV3.NonArraySchemaObject) => {
  const { required, properties } = schemaObject;

  if (properties === undefined) {
    return (
      generateCombinedSchema(schemaObject) ??
      generateDictionarySchema(schemaObject) ??
      'unknown'
    );
  }

  const isRequired = (property: string) => (required ?? []).includes(property);

  const objectProperties = Object.entries(properties).map(
    ([name, prop]) =>
      `readonly ${name}${isRequired(name) ? '' : '?'}: ${generateSchema(prop)}`,
  );

  return objectProperties.length === 0
    ? 'unknown'
    : `{\n${objectProperties.join(';')}\n}`;
};

const generateDictionarySchema = ({
  additionalProperties,
}: OpenAPIV3.NonArraySchemaObject) => {
  // TODO: additionalProperties === true is not handled yet
  if (
    additionalProperties !== undefined &&
    typeof additionalProperties !== 'boolean'
  ) {
    const recordType = generateSchema(additionalProperties);
    return `Record<string, ${recordType}>`;
  }

  return undefined;
};
