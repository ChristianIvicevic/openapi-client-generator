import type { OpenAPIV3 } from 'openapi-types';

export const isArraySchemaObject = <T = unknown>(
  value: OpenAPIV3.ArraySchemaObject | T,
): value is OpenAPIV3.ArraySchemaObject =>
  (value as OpenAPIV3.ArraySchemaObject).items !== undefined;

export const isReferenceObject = <T = unknown>(
  value: OpenAPIV3.ReferenceObject | T,
): value is OpenAPIV3.ReferenceObject =>
  (value as OpenAPIV3.ReferenceObject).$ref !== undefined;
