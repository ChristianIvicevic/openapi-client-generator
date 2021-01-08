import { camelCase, pascalCase } from 'change-case';
import { createLeadingTrivia } from 'generators/typescript/factories/leading-trivia';
import { createRequestFunction } from 'generators/typescript/factories/request-function';
import type { TypescriptCompilationContext } from 'generators/typescript/types';
import type { OpenAPIV3 } from 'openapi-types';
import { OperationMethod } from 'parser/types';
import { partial, partition } from 'ramda';
import ts, { factory } from 'typescript';
import { assertIsDefined } from 'utils/assert';
import { format } from 'utils/format';
import { compact } from 'utils/fp';
import { getLogger } from 'utils/logging';
import { isReferenceObject } from 'utils/type-guards';

export const compileUsingTypescript = (document: OpenAPIV3.Document) => {
  const logger = getLogger();
  const referencedSchemas: string[] = [];

  logger.verbose('Compiling schemas...');
  const compiledSchemaNodes = Object.entries(document.components?.schemas ?? {})
    .sort(([a], [b]) => a.localeCompare(b))
    .flatMap(([schema, schemaObject]) => {
      logger.debug(`Compiling schema '${schema}'`);
      return compileSchema(
        { document, referencedSchemas },
        schema,
        schemaObject,
      );
    });

  logger.verbose('Compiling operations...');
  // This block is a workaround to prefetch operation ids in order to sort the
  // generated methods alphanumerically rather than in their order inside the
  // schema file. This is intentional to produce more deterministic output
  // during compilation.
  const compiledOperationNodes = compact(
    Object.entries(document.paths ?? {})
      .flatMap(([path, pathItemObject]) => {
        assertIsDefined(pathItemObject);

        const { parameters } = pathItemObject;

        return compact(
          (['get', 'post', 'put', 'delete'] as OperationMethod[]).map(method =>
            pathItemObject[method]
              ? {
                  context: { document, path, referencedSchemas },
                  method,
                  pathParameters: parameters,
                  operationObject: pathItemObject[method],
                  operationId:
                    pathItemObject[method]?.operationId ?? '<NO OPERATION ID>',
                }
              : undefined,
          ),
        );
      })
      .sort((a, b) => a.operationId?.localeCompare(b.operationId))
      .flatMap(({ context, method, operationObject, pathParameters }) =>
        compileOperation(context, method, pathParameters, operationObject),
      ),
  );

  if (compiledSchemaNodes.length !== 0) {
    ts.addSyntheticLeadingComment(
      compiledSchemaNodes[0],
      ts.SyntaxKind.MultiLineCommentTrivia,
      ' eslint-disable ',
      true,
    );

    ts.addSyntheticLeadingComment(
      compiledSchemaNodes[0],
      ts.SyntaxKind.MultiLineCommentTrivia,
      ' THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY ',
      true,
    );
  }

  const schemasContent = ts
    .createPrinter({ newLine: ts.NewLineKind.LineFeed })
    .printList(
      ts.ListFormat.MultiLine,
      factory.createNodeArray(compiledSchemaNodes),
      ts.createSourceFile(
        'schemas.ts',
        '',
        ts.ScriptTarget.Latest,
        false,
        ts.ScriptKind.TS,
      ),
    );

  const requestsContent = ts
    .createPrinter({ newLine: ts.NewLineKind.LineFeed })
    .printList(
      ts.ListFormat.MultiLine,
      factory.createNodeArray([
        ...createLeadingTrivia({
          referencedSchemas: [
            ...new Set(referencedSchemas.sort((a, b) => a.localeCompare(b))),
          ],
        }),
        ...compiledOperationNodes,
      ]),
      ts.createSourceFile(
        'requests.ts',
        '',
        ts.ScriptTarget.Latest,
        false,
        ts.ScriptKind.TS,
      ),
    );

  return {
    schemas: format(schemasContent),
    requests: format(requestsContent),
  };
};

const compileSchema = (
  context: TypescriptCompilationContext,
  schemaName: string,
  schemaObject:
    | OpenAPIV3.ReferenceObject
    | OpenAPIV3.ArraySchemaObject
    | OpenAPIV3.NonArraySchemaObject,
) => {
  const description = isReferenceObject(schemaObject)
    ? // TODO: Dereference description of deeply referenced schema object.
      ''
    : schemaObject.description ?? '';
  return compact([
    description.length !== 0 && factory.createJSDocComment(description, []),
    factory.createTypeAliasDeclaration(
      undefined,
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createIdentifier(pascalCase(schemaName)),
      undefined,
      resolveSchema(context, schemaObject),
    ),
  ]);
};

const compileOperation = (
  context: TypescriptCompilationContext,
  method: OperationMethod,
  pathParameters: readonly (
    | OpenAPIV3.ReferenceObject
    | OpenAPIV3.ParameterObject
  )[] = [],
  operationObject?: OpenAPIV3.OperationObject,
) => {
  const logger = getLogger();
  const { path } = context;

  assertIsDefined(path);

  if (operationObject === undefined) {
    logger.debug(`Skipping empty '${method}' operation object`);
    return undefined;
  }

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

  logger.debug(`Compiling operation '${operationId}'`);

  const responseTypes = compileResponses(context, responses);
  // TODO: Handle required flag for the request body.
  const requestBodyTypes = compileRequestBody(context, requestBody);
  const {
    pathParameterPropertySignatures,
    queryParameterPropertySignatures,
  } = compileAndPartitionParameters(context, [
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

const compileAndPartitionParameters = (
  context: TypescriptCompilationContext,
  parameters: readonly (
    | OpenAPIV3.ReferenceObject
    | OpenAPIV3.ParameterObject
  )[],
) => {
  const { document } = context;
  const [
    pathParameters,
    otherParameters,
  ] = partition<OpenAPIV3.ParameterObject>(
    parameter => parameter.in === 'path',
    parameters.map(parameter => {
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
        throw Error(
          `Dereferenced parameter '${parameter.$ref}' is a deep reference to '${referencedParameter.$ref}', which is not supported`,
        );
      }

      return referencedParameter;
    }),
  );

  // TODO: Handle header and cookie parameters.
  const pathParameterPropertySignatures = compileParameterSignatures(
    context,
    pathParameters,
  );
  const queryParameterPropertySignatures = compileParameterSignatures(
    context,
    otherParameters.filter(parameter => parameter.in === 'query'),
  );

  return {
    pathParameterPropertySignatures,
    queryParameterPropertySignatures,
  };
};

const compileParameterSignatures = (
  context: TypescriptCompilationContext,
  parameterObjects: readonly OpenAPIV3.ParameterObject[],
) =>
  parameterObjects.map(parameter =>
    factory.createPropertySignature(
      [factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)],
      factory.createIdentifier(parameter.name),
      parameter.required
        ? undefined
        : factory.createToken(ts.SyntaxKind.QuestionToken),
      parameter.schema === undefined
        ? factory.createKeywordTypeNode(ts.SyntaxKind.NeverKeyword)
        : resolveSchema(context, parameter.schema),
    ),
  );

const compileResponses = (
  context: TypescriptCompilationContext,
  responses?: OpenAPIV3.ResponsesObject,
) => {
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
    .flatMap(response => compileResponseOrRequestBody(context, response));
};

const compileRequestBody = (
  context: TypescriptCompilationContext,
  requestBody?: OpenAPIV3.ReferenceObject | OpenAPIV3.RequestBodyObject,
) => {
  if (requestBody === undefined) {
    return undefined;
  }

  return compileResponseOrRequestBody(context, requestBody);
};

const compileResponseOrRequestBody = (
  context: TypescriptCompilationContext,
  component:
    | OpenAPIV3.ReferenceObject
    | OpenAPIV3.ResponseObject
    | OpenAPIV3.RequestBodyObject,
) => {
  if (isReferenceObject(component)) {
    // TODO: Implement dereferencing via context.
    throw Error('NYI: Resolving #/components/(responses|requestBodies)/*');
  }

  if (component.content === undefined) {
    return [factory.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword)];
  }

  return Object.entries(component.content).map(([mediaType, mediaTypeObject]) =>
    compileMediaType(context, mediaType, mediaTypeObject),
  );
};

const compileMediaType = (
  context: TypescriptCompilationContext,
  mediaType: string,
  mediaTypeObject: OpenAPIV3.MediaTypeObject,
): ts.TypeNode => {
  const logger = getLogger();

  const supportedMediaTypes = [
    '*/*',
    'application/json',
    'application/octet-stream',
    'application/x-yaml',
  ];

  const { schema } = mediaTypeObject;

  if (
    !supportedMediaTypes.some(supportedMediaType =>
      mediaType.startsWith(supportedMediaType),
    ) ||
    // TODO: This check doesn't seem correct...
    schema === undefined
  ) {
    logger.warn(`Ignoring unsupported content type '${mediaType}'`);
    return factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword);
  }

  return resolveSchema(context, schema);
};

const resolveRefSchema = (
  { referencedSchemas }: TypescriptCompilationContext,
  $ref: OpenAPIV3.ReferenceObject['$ref'],
) => {
  if ($ref.startsWith('#/components/schemas')) {
    const schema = pascalCase($ref.replace('#/components/schemas/', ''));
    referencedSchemas.push(schema);
    return factory.createTypeReferenceNode(factory.createIdentifier(schema));
  }
  throw Error(
    `The reference '${$ref}' does not match the pattern '#/components/schemas/*'`,
  );
};

const resolveSchema = (
  context: TypescriptCompilationContext,
  schemaObject:
    | OpenAPIV3.ReferenceObject
    | OpenAPIV3.NonArraySchemaObject
    | OpenAPIV3.ArraySchemaObject,
): ts.TypeNode => {
  if (isReferenceObject(schemaObject)) {
    return resolveRefSchema(context, schemaObject.$ref);
  }

  return schemaObject.nullable
    ? factory.createUnionTypeNode([
        resolveInlineSchema(context, schemaObject),
        factory.createLiteralTypeNode(factory.createNull()),
      ])
    : resolveInlineSchema(context, schemaObject);
};

const resolveInlineSchema = (
  context: TypescriptCompilationContext,
  schemaObject: OpenAPIV3.NonArraySchemaObject | OpenAPIV3.ArraySchemaObject,
) => {
  switch (schemaObject.type) {
    case 'array':
      return factory.createTypeOperatorNode(
        ts.SyntaxKind.ReadonlyKeyword,
        factory.createArrayTypeNode(resolveSchema(context, schemaObject.items)),
      );
    case 'boolean':
      return factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);
    case 'integer':
    case 'number':
      return factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
    // This is a bandaid fix until the openapi-types packages adds null to the
    // types which is available with OpenAPI v3.1
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    case 'null':
    // @ts-ignore
    // eslint-disable-next-line no-fallthrough
    case "'null'":
      return factory.createLiteralTypeNode(factory.createNull());
    /* eslint-enable @typescript-eslint/ban-ts-comment */
    case 'object':
      return resolveObjectSchema(context, schemaObject);
    case 'string':
      return schemaObject.enum === undefined
        ? factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
        : factory.createUnionTypeNode(
            schemaObject.enum.map(enumValue =>
              factory.createLiteralTypeNode(
                factory.createStringLiteral(String(enumValue)),
              ),
            ),
          );
    default:
      return resolveFallbackSchema(context, schemaObject);
  }
};

const resolveFallbackSchema = (
  context: TypescriptCompilationContext,
  schemaObject: OpenAPIV3.NonArraySchemaObject,
) =>
  tryResolveCombinedSchema(context, schemaObject) ??
  tryResolveDictionarySchema(context, schemaObject) ??
  factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword);

const resolveObjectSchema = (
  context: TypescriptCompilationContext,
  schemaObject: OpenAPIV3.NonArraySchemaObject,
) => {
  const { required, properties } = schemaObject;

  if (properties === undefined) {
    return resolveFallbackSchema(context, schemaObject);
  }

  const isRequired = (property: string) => (required ?? []).includes(property);

  const objectProperties = Object.entries(properties).map(([name, prop]) =>
    factory.createPropertySignature(
      [factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)],
      factory.createIdentifier(name),
      isRequired(name)
        ? undefined
        : factory.createToken(ts.SyntaxKind.QuestionToken),
      resolveSchema(context, prop),
    ),
  );

  return objectProperties.length === 0
    ? factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword)
    : factory.createTypeLiteralNode(objectProperties);
};

const tryResolveCombinedSchema = (
  context: TypescriptCompilationContext,
  schemaObject: OpenAPIV3.NonArraySchemaObject,
) => {
  if (schemaObject.allOf) {
    return factory.createIntersectionTypeNode(
      schemaObject.allOf.map(partial(resolveSchema, [context])),
    );
  }

  if (schemaObject.oneOf) {
    return factory.createUnionTypeNode(
      schemaObject.oneOf.map(partial(resolveSchema, [context])),
    );
  }

  return undefined;
};

const tryResolveDictionarySchema = (
  context: TypescriptCompilationContext,
  schemaObject: OpenAPIV3.NonArraySchemaObject,
) => {
  const { additionalProperties } = schemaObject;

  // TODO: additionalProperties === true is not handled yet for excess properties.
  if (
    additionalProperties !== undefined &&
    typeof additionalProperties !== 'boolean'
  ) {
    return factory.createTypeReferenceNode(factory.createIdentifier('Record'), [
      factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
      resolveSchema(context, additionalProperties),
    ]);
  }

  return undefined;
};
