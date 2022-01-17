import * as E from 'fp-ts/Either';
import { flow, pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import { Constants } from 'generator/constants';
import { OperationIdNotDefinedError } from 'generator/errors';
import { formatUsingPrettier, organizeImports } from 'generator/format';
import {
  createPathTemplateExpression,
  generateParameterSignatures,
} from 'generator/operations';
import type { GeneratorOptions } from 'generator/options';
import {
  applicativeValidation,
  assertIsDefined,
  compileNodes,
  liftN,
} from 'generator/utils';
import type { OpenAPIV3_1 } from 'openapi-types';
import { OpenAPIV3 } from 'openapi-types';
import ts, { factory } from 'typescript';

const supportedMethods = Object.values(OpenAPIV3.HttpMethods);

// TODO: Extract this block of code into a generic path traversal function.
export const generateApiPaths = (
  document: OpenAPIV3_1.Document,
  options?: GeneratorOptions,
) =>
  pipe(
    document.paths ?? {},
    R.toArray,
    RA.map(([path, pathItemObject]) => {
      assertIsDefined(pathItemObject);
      return generateApiPathNodes(document, pathItemObject, path);
    }),
    RA.sequence(applicativeValidation),
    E.mapLeft(RA.map(error => error.message)),
    E.map(RA.flatten),
    E.map(propertyAssignments => [
      factory.createVariableStatement(
        [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        factory.createVariableDeclarationList(
          [
            factory.createVariableDeclaration(
              factory.createIdentifier(Constants.API_PATHS_OBJECT_NAME),
              undefined,
              undefined,
              factory.createObjectLiteralExpression(
                propertyAssignments as ts.ObjectLiteralElementLike[],
                true,
              ),
            ),
          ],
          ts.NodeFlags.Const,
        ),
      ),
    ]),
    E.map(flow(compileNodes, organizeImports, formatUsingPrettier)),
  );

const generateApiPathNodes = (
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
      liftN(generateOperationObjectNode)(
        document,
        path,
        pathItemObject.parameters,
        method,
        operationObject,
      ),
    ),
    RA.sequence(applicativeValidation),
  );

const generateOperationObjectNode = (
  document: OpenAPIV3_1.Document,
  path: string,
  parameters: OpenAPIV3_1.PathItemObject['parameters'],
  method: OpenAPIV3_1.HttpMethods,
  operationObject: OpenAPIV3_1.OperationObject,
): E.Either<Error, ts.Node> => {
  if (operationObject.operationId === undefined) {
    return E.left(new OperationIdNotDefinedError(path, method));
  }

  const parametersParameterDeclaration = pipe(
    generateParameterSignatures(
      document,
      'path',
      parameters,
      operationObject.parameters,
    ),
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

  const apiPath = (
    O.isSome(parametersParameterDeclaration)
      ? createPathTemplateExpression
      : factory.createStringLiteral
  )(path);

  const propertyAssignment = factory.createPropertyAssignment(
    factory.createIdentifier(operationObject.operationId),
    factory.createArrowFunction(
      undefined,
      undefined,
      RA.compact([parametersParameterDeclaration]),
      undefined,
      factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
      apiPath,
    ),
  );

  if (operationObject.summary !== undefined) {
    ts.addSyntheticLeadingComment(
      propertyAssignment,
      ts.SyntaxKind.MultiLineCommentTrivia,
      `*\n * ${operationObject.summary}\n `,
      true,
    );
  }

  return E.right(propertyAssignment);
};
