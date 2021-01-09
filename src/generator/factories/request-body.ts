import { createContentfulComponentOrThrow } from 'generator/factories/contentful-component';
import type { Context } from 'generator/types';
import type { OpenAPIV3 } from 'openapi-types';

export const createRequestBody = (
  context: Context,
  requestBody?: OpenAPIV3.ReferenceObject | OpenAPIV3.RequestBodyObject,
) =>
  requestBody === undefined
    ? undefined
    : createContentfulComponentOrThrow(context, requestBody);
