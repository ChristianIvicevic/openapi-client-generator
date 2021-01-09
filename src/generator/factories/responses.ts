import { createContentfulComponentOrThrow } from 'generator/factories/contentful-component';
import type { Context } from 'generator/types';
import type { OpenAPIV3 } from 'openapi-types';
import { partial } from 'ramda';
import ts, { factory } from 'typescript';

export const createResponses = (
  context: Context,
  responses?: OpenAPIV3.ResponsesObject,
) => {
  // Technically this is incorrect as no responses doesn't actually equate to
  // an empty response. We'll just assume this will work out.
  if (responses === undefined) {
    return [factory.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword)];
  }

  const isResponseOk = ([statusCode]: [string, unknown]) =>
    statusCode.toString().startsWith('2') ||
    // We have to consider 'default' responses as well since they can be of any
    // kind, be it OK or ERROR
    statusCode.toString().startsWith('default');

  return Object.entries(responses)
    .filter(isResponseOk)
    .map(([, response]) => response)
    .flatMap(partial(createContentfulComponentOrThrow, [context]));
};
