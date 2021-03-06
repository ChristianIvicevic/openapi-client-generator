import { Constants } from 'generator/constants';
import { resolveSchema } from 'generator/resolver';
import type { Context } from 'generator/types';
import type { OpenAPIV3 } from 'openapi-types';
import ts, { factory } from 'typescript';
import { dereferenceOrThrow } from 'utils/openapi';
import winston from 'winston';

export const createContentfulComponent = (
  context: Context,
  component:
    | OpenAPIV3.ReferenceObject
    | OpenAPIV3.ResponseObject
    | OpenAPIV3.RequestBodyObject,
) => {
  const { content } = dereferenceOrThrow(context, component) as
    | OpenAPIV3.ResponseObject
    | OpenAPIV3.RequestBodyObject;

  return content === undefined
    ? [factory.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword)]
    : Object.entries(content).map(([mediaType, mediaTypeObject]) =>
        createMediaType(context, mediaType, mediaTypeObject),
      );
};

const createMediaType = (
  context: Context,
  mediaType: string,
  mediaTypeObject: OpenAPIV3.MediaTypeObject,
) => {
  const { schema } = mediaTypeObject;

  if (
    !Constants.SUPPORTED_MEDIA_TYPES.some(supportedMediaType =>
      mediaType.startsWith(supportedMediaType),
    ) ||
    // TODO: This check doesn't seem correct...
    schema === undefined
  ) {
    winston.warn(`Ignoring unsupported content type '${mediaType}'`);
    return factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword);
  }

  return resolveSchema(context, schema);
};
