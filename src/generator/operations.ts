import * as E from 'fp-ts/Either';
import { constFalse, flow, pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import { Constants } from 'generator/constants';
import {
  OperationHasNoResponsesError,
  OperationIdNotDefinedError,
} from 'generator/errors';
import { formatUsingPrettier, organizeImports } from 'generator/format';
import type { GeneratorOptions } from 'generator/options';
import { resolveSchemaOrReferenceObject } from 'generator/schemas';
import {
  applicativeValidation,
  assertIsDefined,
  compileNodes,
  concatOptions,
  dereferenceComponent,
  formatOperationId,
  formatSchemaName,
  liftN,
} from 'generator/utils';
import type { OpenAPIV3_1 } from 'openapi-types';
import { OpenAPIV3 } from 'openapi-types';
import ts, { factory } from 'typescript';

const supportedMethods = Object.values(OpenAPIV3.HttpMethods);

export const generateOperations = (
  document: OpenAPIV3_1.Document,
  options?: GeneratorOptions,
) =>
  pipe(
    document.paths ?? {},
    R.toArray,
    RA.map(([path, pathItemObject]) => {
      assertIsDefined(pathItemObject);
      return generatePathItemNodes(document, pathItemObject, path);
    }),
    RA.sequence(applicativeValidation),
    E.mapLeft(RA.map(error => error.message)),
    E.map(RA.flatten),
    E.map(generatedOperations => [
      ...generateImports(
        document.components?.schemas,
        options?.schemasFileName,
      ),
      ...generatedOperations,
    ]),
    E.map(flow(compileNodes, organizeImports, formatUsingPrettier)),
  );

const generatePathItemNodes = (
  document: OpenAPIV3_1.Document,
  pathItemObject: OpenAPIV3_1.PathItemObject,
  path: string,
) =>
  pipe(
    Object.entries(pathItemObject),
    RA.filterMap(([method, operationObject]) =>
      supportedMethods.includes(method as OpenAPIV3.HttpMethods)
        ? O.some([
            method as OpenAPIV3.HttpMethods,
            // This type narrowing seems to be required since the inferred type
            // for the operation object is bigger than expected.
            operationObject as OpenAPIV3_1.OperationObject,
          ] as const)
        : O.none,
    ),
    RA.map(([method, operationObject]) =>
      liftN(generateOperationObjectNodes)(
        document,
        path,
        pathItemObject.parameters,
        method,
        operationObject,
      ),
    ),
    RA.sequence(applicativeValidation),
    E.map(RA.flatten),
  );

const generateOperationObjectNodes = (
  document: OpenAPIV3_1.Document,
  path: string,
  parameters: OpenAPIV3_1.PathItemObject['parameters'],
  method: OpenAPIV3_1.HttpMethods,
  operationObject: OpenAPIV3_1.OperationObject,
): E.Either<Error, readonly ts.Node[]> => {
  if (operationObject.operationId === undefined) {
    return E.left(new OperationIdNotDefinedError(path, method));
  }

  if (operationObject.responses === undefined) {
    return E.left(new OperationHasNoResponsesError(path, method));
  }

  return E.right(
    pipe(
      [generateOperationJSDocNode, generateOperationNode],
      RA.map(generate =>
        generate(document, path, parameters, method, operationObject),
      ),
    ),
  );
};

const generateOperationJSDocNode = (
  document: OpenAPIV3_1.Document,
  _path: string,
  parameters: OpenAPIV3_1.PathItemObject['parameters'],
  method: OpenAPIV3_1.HttpMethods,
  operationObject: OpenAPIV3_1.OperationObject,
) => {
  // TODO: This is duplicated and has to be consolidated.
  const hasPathOrQueryParameters = pipe(
    parameters ?? [],
    RA.concat(operationObject.parameters ?? []),
    O.fromNullable,
    O.map(RA.map(item => dereferenceComponent(document, 'parameters', item))),
    O.chain(O.sequenceArray),
    O.map(
      RA.some(parameter => parameter.in === 'path' || parameter.in === 'query'),
    ),
    O.getOrElse(constFalse),
  );

  // Only POST, PUT and PATCH may have request bodies, everything else is
  // considered to be an anti-pattern.
  // https://opensource.zalando.com/restful-api-guidelines/#148
  const hasRequestBody =
    (method === 'post' || method === 'put' || method === 'patch') &&
    operationObject.requestBody !== undefined;

  return factory.createJSDocComment(
    operationObject.summary,
    pipe(
      [
        hasPathOrQueryParameters
          ? factory.createJSDocParameterTag(
              factory.createIdentifier('param'),
              factory.createIdentifier(Constants.PARAMETERS_PARAMETER_NAME),
              false,
              undefined,
              false,
              'The HTTP request (path, query, header and cookie) parameters sent to the server.',
            )
          : undefined,
        hasRequestBody
          ? factory.createJSDocParameterTag(
              factory.createIdentifier('param'),
              factory.createIdentifier(Constants.REQUEST_BODY_PARAMETER_NAME),
              false,
              undefined,
              false,
              'The HTTP request content sent to the server.',
            )
          : undefined,
        factory.createJSDocParameterTag(
          factory.createIdentifier('param'),
          factory.createIdentifier(
            Constants.AXIOS_REQUEST_CONFIG_PARAMETER_NAME,
          ),
          false,
          undefined,
          false,
          `A custom \`${Constants.AXIOS_REQUEST_CONFIG_TYPE}\` object that is used to override the global configuration for this request. This value is optional.`,
        ),
      ],
      RA.filterMap(O.fromNullable),
    ),
  );
};

const createPropertySignature = (parameter: OpenAPIV3_1.ParameterObject) => {
  const propertySignature = factory.createPropertySignature(
    [factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)],
    factory.createIdentifier(parameter.name),
    parameter.required
      ? undefined
      : factory.createToken(ts.SyntaxKind.QuestionToken),
    pipe(
      // TODO: Propagate any possible E.Left while attempting to resolve
      //  schemas instead of blindly ignoring them. To facilitate this the
      //  surrounding function must be refactored to return an Either.
      parameter.schema,
      O.fromNullable,
      O.map(resolveSchemaOrReferenceObject),
      O.map(
        E.getOrElseW(() =>
          // TODO: Figure out when this branch is reached.
          factory.createKeywordTypeNode(ts.SyntaxKind.NeverKeyword),
        ),
      ),
      O.getOrElseW(() =>
        // TODO: Figure out when this branch is reached.
        factory.createKeywordTypeNode(ts.SyntaxKind.NeverKeyword),
      ),
    ),
  );

  if (parameter.description !== undefined) {
    ts.addSyntheticLeadingComment(
      propertySignature,
      ts.SyntaxKind.MultiLineCommentTrivia,
      `*\n * ${parameter.description}\n `,
      true,
    );
  }

  return propertySignature;
};

const createPathTemplateExpression = (path: string) => {
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

const generateParameterSignatures = (
  document: OpenAPIV3_1.Document,
  parameterSource: string,
  parameters?: (OpenAPIV3_1.ParameterObject | OpenAPIV3_1.ReferenceObject)[],
  operationParameters?: (
    | OpenAPIV3_1.ParameterObject
    | OpenAPIV3_1.ReferenceObject
  )[],
) =>
  pipe(
    parameters ?? [],
    RA.concat(operationParameters ?? []),
    RA.map(item => dereferenceComponent(document, 'parameters', item)),
    // TODO: This will be O.none if any of the parameters cannot be
    //  dereferenced and represents an invalid input that we have to handle
    //  somehow. Alternatively, if we don't care we can maybe use RA.compact
    //  to drop all parameters that could not be referenced.
    // TODO: There seems to be a skipped test that actually asserts whether
    //  unresolvable parameters are reported as errors.
    O.sequenceArray,
    O.map(RA.filter(parameter => parameter.in === parameterSource)),
    O.map(RA.map(createPropertySignature)),
    O.filter(signatures => signatures.length !== 0),
  );

const generateOperationNode = (
  document: OpenAPIV3_1.Document,
  path: string,
  parameters: OpenAPIV3_1.PathItemObject['parameters'],
  method: OpenAPIV3_1.HttpMethods,
  operationObject: OpenAPIV3_1.OperationObject,
) => {
  // TODO: This is actually guaranteed at the callsite, but we might want to
  //  consider consolidating these assertions. It might be possible to inline
  //  this function body into the callsite to use the same values for generating
  //  operation nodes and their documentation rather than doing it twice.
  assertIsDefined(operationObject.operationId);
  assertIsDefined(operationObject.responses);

  // ---------------------------------------------------------------------------

  const pathParameterSignatures = generateParameterSignatures(
    document,
    'path',
    parameters,
    operationObject.parameters,
  );
  const hasPathParameters = O.isSome(pathParameterSignatures);

  const queryParameterSignatures = generateParameterSignatures(
    document,
    'query',
    parameters,
    operationObject.parameters,
  );

  const parametersParameterDeclaration = pipe(
    [pathParameterSignatures, queryParameterSignatures],
    concatOptions<ts.PropertySignature>(),
    O.map(propertySignature =>
      factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier(Constants.PARAMETERS_PARAMETER_NAME),
        undefined,
        factory.createTypeLiteralNode(propertySignature),
        undefined,
      ),
    ),
  );

  // ---------------------------------------------------------------------------

  const requestBodyObject = pipe(
    operationObject.requestBody,
    O.fromNullable,
    O.chain(requestBody =>
      dereferenceComponent(document, 'requestBodies', requestBody),
    ),
  );

  const isRequestBodyRequired = pipe(
    requestBodyObject,
    O.map(({ required }) => required === true),
    O.getOrElse(constFalse),
  );

  const requestBodyParameterDeclaration = pipe(
    requestBodyObject,
    // TODO: Only the application/json media type is supported for now. Figure
    //  out whether support for other media types is required.
    O.filterMap(requestBody =>
      O.fromNullable(requestBody.content?.['application/json']?.schema),
    ),
    // TODO: Propagate any possible E.Left while attempting to resolve schemas
    //  instead of blindly ignoring them. To facilitate this the surrounding
    //  function must be refactored to return an Either.
    O.map(resolveSchemaOrReferenceObject),
    // TODO: This discards the error... for now.
    O.chain(O.fromEither),
    O.map(requestBodyType =>
      factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier(Constants.REQUEST_BODY_PARAMETER_NAME),
        isRequestBodyRequired
          ? undefined
          : factory.createToken(ts.SyntaxKind.QuestionToken),
        factory.createUnionTypeNode([requestBodyType]),
        undefined,
      ),
    ),
  );

  const axiosConfigParameterDeclaration = factory.createParameterDeclaration(
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
  );

  const parameterDeclarations = RA.compact([
    parametersParameterDeclaration,
    requestBodyParameterDeclaration,
    O.some(axiosConfigParameterDeclaration),
  ]);

  // ---------------------------------------------------------------------------

  const responseType = pipe(
    operationObject.responses,
    R.toArray,
    RA.filter(([statusCode]) => statusCode.startsWith('2')),
    RA.filterMap(([, response]) =>
      dereferenceComponent(document, 'responses', response),
    ),
    RA.filterMap(response =>
      O.fromNullable(
        // TODO: Only the application/json media type is supported for now.
        //  Figure out whether support for other media types is required.
        response.content?.['application/json']?.schema,
      ),
    ),
    // TODO: Propagate any possible E.Left while attempting to resolve schemas
    //  instead of blindly ignoring them. To facilitate this the surrounding
    //  function must be refactored to return an Either.
    RA.map(resolveSchemaOrReferenceObject),
    E.sequenceArray,
    // TODO: This discards the errors... for now.
    O.fromEither,
    O.filter(responseTypes => responseTypes.length !== 0),
    O.getOrElseW(() => [
      factory.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword),
    ]),
  );

  // ---------------------------------------------------------------------------

  const pathArgument = (
    hasPathParameters
      ? createPathTemplateExpression
      : factory.createStringLiteral
  )(path);

  // Only POST, PUT and PATCH may have request bodies, everything else is
  // considered to be an anti-pattern.
  // https://opensource.zalando.com/restful-api-guidelines/#148
  const requestBodyArgument =
    // eslint-disable-next-line no-nested-ternary
    method === 'post' || method === 'put' || method === 'patch'
      ? operationObject.requestBody === undefined
        ? factory.createIdentifier('undefined')
        : factory.createIdentifier(Constants.REQUEST_BODY_PARAMETER_NAME)
      : undefined;

  const configArgument = pipe(
    queryParameterSignatures,
    O.map(
      RA.map(({ name }) =>
        factory.createPropertyAssignment(
          name as ts.Identifier,
          factory.createPropertyAccessExpression(
            factory.createIdentifier(Constants.PARAMETERS_PARAMETER_NAME),
            name as ts.Identifier,
          ),
        ),
      ),
    ),
    O.map(queryParameterAssignments =>
      factory.createObjectLiteralExpression(
        [
          factory.createSpreadAssignment(
            factory.createIdentifier(
              Constants.AXIOS_REQUEST_CONFIG_PARAMETER_NAME,
            ),
          ),
          factory.createPropertyAssignment(
            factory.createIdentifier('params'),
            factory.createObjectLiteralExpression(
              queryParameterAssignments,
              true,
            ),
          ),
        ],
        true,
      ),
    ),
    O.getOrElseW(() =>
      factory.createIdentifier(Constants.AXIOS_REQUEST_CONFIG_PARAMETER_NAME),
    ),
  );

  const operationArguments = pipe(
    [pathArgument, requestBodyArgument, configArgument],
    RA.filterMap(O.fromNullable),
  );

  // ---------------------------------------------------------------------------

  return factory.createVariableStatement(
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(
            formatOperationId(operationObject.operationId),
          ),
          undefined,
          undefined,
          factory.createArrowFunction(
            [factory.createModifier(ts.SyntaxKind.AsyncKeyword)],
            undefined,
            parameterDeclarations,
            undefined,
            factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier(Constants.AXIOS_IMPORT_NAME),
                factory.createIdentifier(method),
              ),
              [factory.createUnionTypeNode(responseType)],
              operationArguments,
            ),
          ),
        ),
      ],
      ts.NodeFlags.Const,
    ),
  );
};

const generateImports = (
  schemas: NonNullable<OpenAPIV3_1.Document['components']>['schemas'],
  schemasFileName = 'schemas',
) => {
  const axiosRequestConfigImport = O.some(
    factory.createImportDeclaration(
      undefined,
      undefined,
      factory.createImportClause(
        true,
        undefined,
        factory.createNamedImports([
          factory.createImportSpecifier(
            undefined,
            factory.createIdentifier(Constants.AXIOS_REQUEST_CONFIG_TYPE),
          ),
        ]),
      ),
      factory.createStringLiteral(Constants.AXIOS_PACKAGE_NAME),
    ),
  );

  const axiosImport = O.some(
    factory.createImportDeclaration(
      undefined,
      undefined,
      factory.createImportClause(
        false,
        factory.createIdentifier(Constants.AXIOS_IMPORT_NAME),
        undefined,
      ),
      factory.createStringLiteral(Constants.AXIOS_PACKAGE_NAME),
    ),
  );

  const schemasImport = pipe(
    schemas ?? {},
    R.keys,
    RA.map(schema =>
      factory.createImportSpecifier(
        undefined,
        factory.createIdentifier(formatSchemaName(schema)),
      ),
    ),
    importSpecifiers =>
      importSpecifiers.length === 0
        ? O.none
        : O.some(
            factory.createImportDeclaration(
              undefined,
              undefined,
              factory.createImportClause(
                true,
                undefined,
                factory.createNamedImports(importSpecifiers),
              ),
              factory.createStringLiteral(
                `./${schemasFileName.replace(/\.ts$/, '')}`,
              ),
            ),
          ),
  );

  return RA.compact([axiosRequestConfigImport, axiosImport, schemasImport]);
};
