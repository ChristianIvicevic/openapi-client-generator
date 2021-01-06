import type { OpenAPIV3 } from 'openapi-types';

export const isReferenceObject = <T = unknown>(
  value: OpenAPIV3.ReferenceObject | T,
): value is OpenAPIV3.ReferenceObject =>
  (value as OpenAPIV3.ReferenceObject)?.$ref !== undefined;
