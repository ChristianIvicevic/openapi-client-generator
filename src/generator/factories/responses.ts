import { createContentfulComponentOrThrow } from 'generator/factories/contentful-component';
import type { Context } from 'generator/types';
import type { OpenAPIV3 } from 'openapi-types';
import { partial } from 'ramda';

export const createResponses = (
  context: Context,
  responses: OpenAPIV3.ResponsesObject,
) =>
  Object.entries(responses)
    .filter(
      ([statusCode]: [string, unknown]) =>
        statusCode.toString().startsWith('2') ||
        // We have to consider 'default' responses as well since they can be of
        // any kind, be it OK or ERROR
        statusCode.toString().startsWith('default'),
    )
    .map(([, response]) => response)
    .flatMap(partial(createContentfulComponentOrThrow, [context]));
