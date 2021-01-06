import { pascalCase } from 'change-case';
import type { OpenAPIV3 } from 'openapi-types';
import type { ParameterInfo, ParserContext, TypeInfo } from 'parser/types';
import { getLogger } from 'utils/logging';
import { isReferenceObject } from 'utils/type-guards';

export const resolveParameter = (
  { document }: ParserContext,
  parameter: OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject,
): ParameterInfo => {
  // Assert the parameter to not be a reference object for the time being, if
  // it actually is, we're going to dereference and reassign it
  let resolvedParameter = parameter as OpenAPIV3.ParameterObject;

  if (isReferenceObject(parameter)) {
    const referencedParameter =
      document.components?.parameters?.[
        parameter.$ref.replace('#/components/parameters/', '')
      ];

    if (referencedParameter === undefined) {
      throw Error(`Cannot dereference parameter '${parameter.$ref}'`);
    }

    if (isReferenceObject(referencedParameter)) {
      throw Error(
        `Dereferenced parameter '${parameter.$ref}' is a deep reference to '${referencedParameter.$ref}', which is not supported`,
      );
    }

    resolvedParameter = referencedParameter;
  }

  const { name, in: resolvedIn, schema, description } = resolvedParameter;

  if (schema === undefined) {
    throw Error(
      isReferenceObject(parameter)
        ? `There is no schema for the referenced parameter '#/components/parameters/${name}'`
        : `There is no schema for the parameter '${name}'`,
    );
  }

  return {
    name,
    in: resolvedIn,
    description,
    typeInfo: resolveType(schema),
  };
};

export const resolveContentType = (
  contentObjects: Array<
    | OpenAPIV3.ReferenceObject
    | OpenAPIV3.ResponseObject
    | OpenAPIV3.RequestBodyObject
  >,
): TypeInfo[] => {
  const logger = getLogger();
  return contentObjects
    .map(contentObject => {
      // TODO: This seems to be only true for referenced responses and request
      // bodies in the components list
      if (isReferenceObject(contentObject)) {
        return [resolveRefType(contentObject.$ref)];
      }

      if (contentObject.content !== undefined) {
        const contentTypes = Object.entries(contentObject.content)
          .map(([contentType, content]) => {
            if (
              [
                '*/*',
                'application/json',
                'application/octet-stream',
                'application/x-yaml',
              ].some(mediaType => contentType.startsWith(mediaType)) &&
              content.schema !== undefined
            ) {
              return resolveType(content.schema);
            }

            // TODO: Handle 'application/x-www-form-urlencoded'

            // TODO: Generate a proper type for this.
            if (contentType.startsWith('multipart/form-data')) {
              return { type: 'unknown' };
            }

            // Unknown content type detected, don't add it to the document info
            logger.warn(`Ignoring unsupported content type '${contentType}'`);
            return undefined;
          })
          .filter(Boolean) as TypeInfo[];

        // The array is empty in case no supported media type has been found
        return contentTypes.length === 0 ? [{ type: 'unknown' }] : contentTypes;
      }

      return [{ type: 'void' }];
    })
    .flat()
    .filter(
      (value, index, array) =>
        array.findIndex(({ type }) => type === value.type) === index,
    );
};

const resolveRefType = ($ref: OpenAPIV3.ReferenceObject['$ref']): TypeInfo => {
  if ($ref.startsWith('#/components/schemas')) {
    return {
      type: pascalCase($ref.replace('#/components/schemas/', '')),
    };
  }
  throw Error(
    `The reference '${$ref}' does not match the pattern '#/components/schemas/*'`,
  );
};

const resolveArrayType = (
  schemaObject: OpenAPIV3.ArraySchemaObject,
): TypeInfo => {
  // TODO: items.allOf, items.oneOf, items.enum
  return {
    ...resolveType(schemaObject.items),
    isArray: true,
  };
};

const resolveScalarType = (
  schemaObject: OpenAPIV3.NonArraySchemaObject | OpenAPIV3.ArraySchemaObject,
): TypeInfo => {
  switch (schemaObject.type) {
    case 'integer':
    case 'number':
      return { type: 'number' };

    case 'boolean':
      return { type: 'boolean' };

    case 'string':
      return { type: 'string' };

    case 'object':
      // TODO: Perform an actual type resolution.
      return { type: 'object' };

    case 'array':
      return resolveArrayType(schemaObject);

    default:
      return { type: 'unknown' };
  }
};

// TODO: Handle nullable flag similar to the generator if possible.
const resolveType = (
  schemaObject:
    | OpenAPIV3.ReferenceObject
    | OpenAPIV3.NonArraySchemaObject
    | OpenAPIV3.ArraySchemaObject,
) =>
  isReferenceObject(schemaObject)
    ? resolveRefType(schemaObject.$ref)
    : resolveScalarType(schemaObject);
