import { camelCase } from 'change-case';
import { resolveSchema } from 'generator/resolver';
import type { Context } from 'generator/types';
import type { OpenAPIV3 } from 'openapi-types';
import { partial, partition } from 'ramda';
import ts, { factory } from 'typescript';
import { dereferenceOrThrow } from 'utils/openapi';

export const createAndPartitionParameters = (
  context: Context,
  parameters: readonly (
    | OpenAPIV3.ReferenceObject
    | OpenAPIV3.ParameterObject
  )[],
) => {
  const [pathParameters, otherParameters] =
    partition<OpenAPIV3.ParameterObject>(
      parameter => parameter.in === 'path',
      parameters.map(
        partial(dereferenceOrThrow, [context]),
      ) as readonly OpenAPIV3.ParameterObject[],
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

const createParameterSignature = (
  context: Context,
  { name, required, schema, description }: OpenAPIV3.ParameterObject,
) => {
  const propertySignature = factory.createPropertySignature(
    [factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)],
    factory.createIdentifier(camelCase(name)),
    required ? undefined : factory.createToken(ts.SyntaxKind.QuestionToken),
    schema === undefined
      ? factory.createKeywordTypeNode(ts.SyntaxKind.NeverKeyword)
      : resolveSchema(context, schema),
  );

  if (description !== undefined) {
    ts.addSyntheticLeadingComment(
      propertySignature,
      ts.SyntaxKind.MultiLineCommentTrivia,
      `*\n * ${description}\n `,
      true,
    );
  }

  return propertySignature;
};
