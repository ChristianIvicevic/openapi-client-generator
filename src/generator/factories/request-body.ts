import { createContentfulComponent } from 'generator/factories/contentful-component';
import type { Context } from 'generator/types';
import type { OpenAPIV3 } from 'openapi-types';
import ts, { factory } from 'typescript';
import { dereferenceOrThrow } from 'utils/openapi';

export const createRequestBody = (
  context: Context,
  requestBody?: OpenAPIV3.ReferenceObject | OpenAPIV3.RequestBodyObject,
) => {
  if (requestBody === undefined) {
    return undefined;
  }

  // We need to dereference this early in order to access the required property
  // as it does not exist for response bodies and handling it in the contentful
  // component factory isn't sensible.
  const dereferencedRequestBody = dereferenceOrThrow(
    context,
    requestBody,
  ) as OpenAPIV3.RequestBodyObject;

  const resolvedTypeNode = createContentfulComponent(
    context,
    dereferencedRequestBody,
  );

  return dereferencedRequestBody.required === true
    ? resolvedTypeNode
    : [
        ...resolvedTypeNode,
        (factory.createIdentifier('undefined') as unknown) as ts.TypeNode,
      ];
};
