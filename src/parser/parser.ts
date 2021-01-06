import { camelCase } from 'change-case';
import type { OpenAPIV3 } from 'openapi-types';
import { resolveContentType, resolveParameter } from 'parser/resolver';
import type {
  DocumentInfo,
  OperationInfo,
  OperationMethod,
  ParserContext,
  PathItemObjectInfo,
} from 'parser/types';
import { partial } from 'ramda';
import { assertIsDefined } from 'utils/assert';
import { getLogger } from 'utils/logging';
import yaml from 'yaml';

export const parseYaml = (content: string): DocumentInfo => {
  const logger = getLogger();
  const document = yaml.parse(content) as OpenAPIV3.Document;

  const schemaObjects = Object.entries(
    document.components?.schemas ?? {},
  ).reduce<
    Record<
      string,
      | OpenAPIV3.ReferenceObject
      | OpenAPIV3.ArraySchemaObject
      | OpenAPIV3.NonArraySchemaObject
    >
  >(
    (currentSchemas, [schemaName, schemaObject]) => ({
      ...currentSchemas,
      [schemaName]: schemaObject,
    }),
    {},
  );

  const pathItemObjects = Object.entries(document.paths ?? {}).map(
    ([path, pathItemObject]) => {
      assertIsDefined(pathItemObject);

      logger.verbose(`Parsing path '${path}'`);

      const context: ParserContext = { document, path };
      return parsePathItemObject(context, pathItemObject);
    },
  );

  return { schemaObjects, pathItemObjects };
};

const parsePathItemObject = (
  context: ParserContext,
  pathItemObject: OpenAPIV3.PathItemObject,
): PathItemObjectInfo => {
  const parameters = (pathItemObject.parameters ?? []).map(
    partial(resolveParameter, [context]),
  );

  // TODO: Use TS plugin to generate from type
  return ([
    'get',
    'post',
    'put',
    'delete',
  ] as OperationMethod[]).reduce<PathItemObjectInfo>(
    (acc, method) => ({
      ...acc,
      [method]: parseOperationObject(
        { ...context, method, parameters },
        pathItemObject[method],
      ),
    }),
    {},
  );
};

const parseOperationObject = (
  context: ParserContext,
  operationObject?: OpenAPIV3.OperationObject,
): OperationInfo | undefined => {
  const logger = getLogger();
  const { path, method, parameters } = context;

  assertIsDefined(path);
  assertIsDefined(method);

  if (operationObject === undefined) {
    logger.debug(`Skipping empty '${method}' operation object`);
    return undefined;
  }

  if (operationObject.operationId === undefined) {
    throw Error(`'${method}' operation object has no operation id`);
  }

  logger.debug(`Parsing responses for '${method}' operation object`);

  const { responses, requestBody, operationId, summary } = operationObject;

  const responseType = resolveContentType(
    Object.entries(responses ?? {})
      .filter(isResponseOk)
      .map(([, response]) => response),
  );

  // TODO: Handle required flag for the request body
  const requestBodyType =
    requestBody === undefined ? undefined : resolveContentType([requestBody]);

  const operationParameters = [
    ...(parameters ?? []),
    ...(operationObject.parameters ?? []).map(
      partial(resolveParameter, [context]),
    ),
  ];

  return {
    path,
    method,
    operationId: camelCase(operationId),
    summary,
    responseType,
    requestBodyType,
    parameters: operationParameters,
  };
};

const isResponseOk = ([statusCode]: [string, unknown]) =>
  statusCode.toString().startsWith('2') ||
  // We have to consider 'default' responses as well since they can be of any
  // kind, be it OK or ERROR
  statusCode.toString().startsWith('default');
