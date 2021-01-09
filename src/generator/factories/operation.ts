import { camelCase } from 'change-case';
import { createAndPartitionParameters } from 'generator/factories/parameters';
import { createRequestBody } from 'generator/factories/request-body';
import { createRequestFunction } from 'generator/factories/request-function';
import { createResponses } from 'generator/factories/responses';
import type { Context, OperationMethod } from 'generator/types';
import type { OpenAPIV3 } from 'openapi-types';
import { assertIsDefined } from 'utils/assert';

export type CreateOperationOrThrowParameters = {
  operationId: string;
  parameters: Parameters<typeof createOperationOrThrow>;
};

export const createOperationOrThrow = (
  context: Context,
  method: OperationMethod,
  pathParameters: readonly (
    | OpenAPIV3.ReferenceObject
    | OpenAPIV3.ParameterObject
  )[] = [],
  operationObject: OpenAPIV3.OperationObject,
) => {
  const { path } = context;

  assertIsDefined(path);

  const {
    operationId,
    summary,
    responses,
    requestBody,
    parameters,
  } = operationObject;

  if (operationId === undefined) {
    throw Error(`'${method}' operation object has no operation id`);
  }

  if (responses === undefined) {
    throw Error(`'${method}' operation object has no responses`);
  }

  const responseTypes = createResponses(context, responses);
  // TODO: Handle required flag for the request body.
  const requestBodyTypes = createRequestBody(context, requestBody);
  const {
    pathParameterPropertySignatures,
    queryParameterPropertySignatures,
  } = createAndPartitionParameters(context, [
    ...pathParameters,
    ...(parameters ?? []),
  ]);

  return createRequestFunction({
    operationId: camelCase(operationId),
    method,
    path,
    summary,
    responseTypes,
    requestBodyTypes,
    pathParameterPropertySignatures,
    queryParameterPropertySignatures,
  });
};
