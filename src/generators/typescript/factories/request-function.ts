import { Constants } from 'generators/typescript/constants';
import type { OperationMethod } from 'parser/types';
import ts, { factory } from 'typescript';
import { compact } from 'utils/fp';

type Options = {
  readonly operationId: string;
  readonly method: OperationMethod;
  readonly path: string;
  readonly summary?: string;
  readonly responseTypes: readonly ts.TypeNode[];
  readonly requestBodyTypes?: readonly ts.TypeNode[];
  readonly pathParameterPropertySignatures: readonly ts.PropertySignature[];
  readonly queryParameterPropertySignatures: readonly ts.PropertySignature[];
};

export const createRequestFunction = ({
  operationId,
  method,
  path,
  summary = '',
  responseTypes,
  requestBodyTypes,
  pathParameterPropertySignatures,
  queryParameterPropertySignatures,
}: Options) => {
  const hasPathParameters = pathParameterPropertySignatures.length !== 0;
  const hasQueryParameters = queryParameterPropertySignatures.length !== 0;
  const hasParameters = hasPathParameters || hasQueryParameters;

  return [
    compileJSDocComment({ hasParameters, requestBodyTypes, summary }),
    factory.createVariableStatement(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(operationId),
            undefined,
            undefined,
            factory.createArrowFunction(
              [factory.createModifier(ts.SyntaxKind.AsyncKeyword)],
              undefined,
              compileParameters({
                hasParameters,
                pathParameterPropertySignatures,
                queryParameterPropertySignatures,
                requestBodyTypes,
              }),
              undefined,
              factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(Constants.AXIOS_IMPORT_NAME),
                  factory.createIdentifier(method),
                ),
                [factory.createUnionTypeNode(responseTypes)],
                compact([
                  compilePathInterpolationParameter({
                    path,
                    hasPathParameters,
                  }),
                  compileRequestBodyParameter({ requestBodyTypes, method }),
                  compileConfigParameter({
                    hasQueryParameters,
                    queryParameterPropertySignatures,
                  }),
                ]),
              ),
            ),
          ),
        ],
        ts.NodeFlags.Const,
      ),
    ),
  ];
};

const compileJSDocComment = ({
  hasParameters,
  requestBodyTypes,
  summary,
}: Pick<Options, 'summary' | 'requestBodyTypes'> & {
  readonly hasParameters: boolean;
}) =>
  factory.createJSDocComment(
    summary,
    compact([
      hasParameters &&
        factory.createJSDocParameterTag(
          factory.createIdentifier('param'),
          factory.createIdentifier(Constants.PARAMETERS_PARAMETER_NAME),
          false,
          undefined,
          false,
          'The HTTP request (path, query, header and cookie) parameters sent to the server.',
        ),
      requestBodyTypes &&
        factory.createJSDocParameterTag(
          factory.createIdentifier('param'),
          factory.createIdentifier(Constants.REQUEST_BODY_PARAMETER_NAME),
          false,
          undefined,
          false,
          'The HTTP request content sent to the server.',
        ),
      factory.createJSDocParameterTag(
        factory.createIdentifier('param'),
        factory.createIdentifier(Constants.AXIOS_REQUEST_CONFIG_PARAMETER_NAME),
        false,
        undefined,
        false,
        `A custom ${Constants.AXIOS_REQUEST_CONFIG_PARAMETER_NAME} object that is used to override the global configuration for this request. This value is optional.`,
      ),
    ]),
  );

const compileParameters = ({
  hasParameters,
  pathParameterPropertySignatures,
  queryParameterPropertySignatures,
  requestBodyTypes,
}: Pick<
  Options,
  | 'pathParameterPropertySignatures'
  | 'queryParameterPropertySignatures'
  | 'requestBodyTypes'
> & {
  readonly hasParameters: boolean;
}) =>
  compact([
    hasParameters &&
      factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier(Constants.PARAMETERS_PARAMETER_NAME),
        undefined,
        factory.createTypeLiteralNode([
          ...pathParameterPropertySignatures,
          ...queryParameterPropertySignatures,
        ]),
        undefined,
      ),
    requestBodyTypes &&
      factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier(Constants.REQUEST_BODY_PARAMETER_NAME),
        undefined,
        factory.createUnionTypeNode(requestBodyTypes),
        undefined,
      ),
    factory.createParameterDeclaration(
      undefined,
      undefined,
      undefined,
      factory.createIdentifier(Constants.AXIOS_REQUEST_CONFIG_PARAMETER_NAME),
      factory.createToken(ts.SyntaxKind.QuestionToken),
      factory.createTypeReferenceNode(
        factory.createIdentifier(Constants.AXIOS_REQUEST_CONFIG_TYPE),
        [],
      ),
      undefined,
    ),
  ]);

const compilePathInterpolationParameter = ({
  hasPathParameters,
  path,
}: Pick<Options, 'path'> & {
  readonly hasPathParameters: boolean;
}) => {
  if (!hasPathParameters) {
    return factory.createStringLiteral(path);
  }

  const pathParameters = [...path.matchAll(/\{(.+?)\}/g)];
  const [templateHead, ...templateSpanSegments] = pathParameters
    .reduce(
      (currentPath, pathParameter) =>
        currentPath.replace(pathParameter[0], '{}'),
      path,
    )
    .split('{}');

  return factory.createTemplateExpression(
    factory.createTemplateHead(templateHead),
    templateSpanSegments.map((segment, index, segmentsArray) =>
      factory.createTemplateSpan(
        factory.createPropertyAccessExpression(
          factory.createIdentifier(Constants.PARAMETERS_PARAMETER_NAME),
          factory.createIdentifier(pathParameters[index][1]),
        ),
        (index === segmentsArray.length - 1
          ? factory.createTemplateTail
          : factory.createTemplateMiddle)(segment),
      ),
    ),
  );
};

const compileRequestBodyParameter = ({
  requestBodyTypes,
  method,
}: Pick<Options, 'requestBodyTypes' | 'method'>) =>
  // eslint-disable-next-line no-nested-ternary
  requestBodyTypes
    ? factory.createIdentifier(Constants.REQUEST_BODY_PARAMETER_NAME)
    : ['post', 'put'].includes(method)
    ? factory.createIdentifier('undefined')
    : undefined;

const compileConfigParameter = ({
  hasQueryParameters,
  queryParameterPropertySignatures,
}: Pick<Options, 'queryParameterPropertySignatures'> & {
  readonly hasQueryParameters: boolean;
}) =>
  hasQueryParameters
    ? factory.createObjectLiteralExpression(
        [
          factory.createSpreadAssignment(
            factory.createIdentifier(
              Constants.AXIOS_REQUEST_CONFIG_PARAMETER_NAME,
            ),
          ),
          factory.createPropertyAssignment(
            factory.createIdentifier('params'),
            factory.createObjectLiteralExpression(
              queryParameterPropertySignatures.map(queryParameter =>
                factory.createPropertyAssignment(
                  queryParameter.name as ts.Identifier,
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier(
                      Constants.PARAMETERS_PARAMETER_NAME,
                    ),
                    queryParameter.name as ts.Identifier,
                  ),
                ),
              ),
              true,
            ),
          ),
        ],
        true,
      )
    : factory.createIdentifier(Constants.AXIOS_REQUEST_CONFIG_PARAMETER_NAME);
