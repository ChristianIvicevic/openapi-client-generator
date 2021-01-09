import { resolveSchema } from 'generator/resolver';
import type { Context } from 'generator/types';
import type { OpenAPIV3 } from 'openapi-types';
import { partial, partition } from 'ramda';
import ts, { factory } from 'typescript';
import { isReferenceObject } from 'utils/type-guards';

export const createAndPartitionParameters = (
  context: Context,
  parameters: readonly (
    | OpenAPIV3.ReferenceObject
    | OpenAPIV3.ParameterObject
  )[],
) => {
  const [
    pathParameters,
    otherParameters,
  ] = partition<OpenAPIV3.ParameterObject>(
    parameter => parameter.in === 'path',
    parameters.map(partial(dereferenceParameterOrThrow, [context])),
  );

  // TODO: Handle header and cookie parameters.
  const createSignature = partial(createParameterSignature, [context]);
  const pathParameterPropertySignatures = pathParameters.map(createSignature);
  const queryParameterPropertySignatures = otherParameters
    .filter(parameter => parameter.in === 'query')
    .map(createSignature);

  return {
    pathParameterPropertySignatures,
    queryParameterPropertySignatures,
  };
};

const dereferenceParameterOrThrow = (
  { document }: Context,
  parameter: OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject,
) => {
  if (!isReferenceObject(parameter)) {
    return parameter;
  }

  const referencedParameter =
    document.components?.parameters?.[
      parameter.$ref.replace('#/components/parameters/', '')
    ];

  if (referencedParameter === undefined) {
    throw Error(`Cannot dereference parameter '${parameter.$ref}'`);
  }

  if (isReferenceObject(referencedParameter)) {
    // TODO: Invoke this method recursively should this ever be a requested
    // feature.
    throw Error(
      `Dereferenced parameter '${parameter.$ref}' is a deep reference to '${referencedParameter.$ref}', which is not supported`,
    );
  }

  return referencedParameter;
};

const createParameterSignature = (
  context: Context,
  { name, required, schema }: OpenAPIV3.ParameterObject,
) =>
  factory.createPropertySignature(
    [factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)],
    factory.createIdentifier(name),
    required ? undefined : factory.createToken(ts.SyntaxKind.QuestionToken),
    schema === undefined
      ? factory.createKeywordTypeNode(ts.SyntaxKind.NeverKeyword)
      : resolveSchema(context, schema),
  );
