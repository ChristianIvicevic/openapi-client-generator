import { pascalCase } from 'change-case';
import { generateSchema } from 'generators/handlebars/schemas';
import type {
  RequestsCompilationContext,
  SchemasCompilationContext,
} from 'generators/handlebars/types';
import * as Handlebars from 'handlebars';
import type {
  DocumentInfo,
  OperationInfo,
  OperationMethod,
  ParameterInfo,
  TypeInfo,
} from 'parser/types';
import { format } from 'prettier';
import { getLogger } from 'utils/logging';
import wordWrap from 'word-wrap';

const wrapJsdoc = (text: string) =>
  wordWrap(text, {
    width: 80 - 3,
    newline: '\n * ',
    indent: '',
  });

// BEGIN Handlebars helper functions

const formatParameters = (text: string) => text.replace(/\{/g, '${parameters.');

const getRequestBodyArgument = (
  method: OperationMethod,
  typeInfo?: readonly TypeInfo[],
) => {
  if (method !== 'post' && method !== 'put') {
    return '';
  }

  return typeInfo === undefined ? 'undefined,' : 'requestBody,';
};

const hasQueryParameters = (parameterInfo: ParameterInfo[]) =>
  parameterInfo.some(parameter => parameter.in === 'query');

const hasRequestBody = (typeInfo?: readonly TypeInfo[]) =>
  typeInfo !== undefined;

const isQueryParameter = (parameterInfo: ParameterInfo) =>
  parameterInfo.in === 'query';

const resolveType = ({ isArray, type }: TypeInfo) =>
  isArray ? `readonly ${type}[]` : type;

const resolveTypes = (typeInfo?: readonly TypeInfo[]) => {
  const logger = getLogger();

  // TODO: Figure out whether this is even possible.
  if (typeInfo === undefined) {
    logger.warn(`A type was unexpectedly resolved to 'unknown'`);
    return 'unknown';
  }

  const compiledType = typeInfo.map(resolveType).join(' | ');
  return `(${compiledType})`;
};

Handlebars.registerHelper('format-parameters', formatParameters);
Handlebars.registerHelper('get-request-body-arg', getRequestBodyArgument);
Handlebars.registerHelper('generate-schema', generateSchema);
Handlebars.registerHelper('has-query-parameters', hasQueryParameters);
Handlebars.registerHelper('has-request-body', hasRequestBody);
Handlebars.registerHelper('is-query-parameter', isQueryParameter);
Handlebars.registerHelper('resolve-type', resolveType);
Handlebars.registerHelper('resolve-types', resolveTypes);
Handlebars.registerHelper('wrap-jsdoc', wrapJsdoc);

// END Handlebars helper functions

const prettier = (content: string) =>
  format(content, {
    ...{
      arrowParens: 'avoid',
      singleQuote: true,
      tabWidth: 2,
      trailingComma: 'all',
    },
    parser: 'typescript',
  });

export const compileUsingHandlebars = async ({
  pathItemObjects,
  schemaObjects,
}: DocumentInfo) => {
  // The import MUST have the explicit suffix otherwise the ts path plugin
  // won't be able to resolve it properly for runtime
  await import('generators/handlebars/templates/templates.precompiled.js');

  const schemasTemplate = Handlebars.templates[
    'schemas.hbs'
  ] as HandlebarsTemplateDelegate<SchemasCompilationContext>;

  const requestsTemplate = Handlebars.templates[
    'requests.hbs'
  ] as HandlebarsTemplateDelegate<RequestsCompilationContext>;

  const operations = Object.values(pathItemObjects)
    .map(
      pathItemObject =>
        Object.values(pathItemObject).filter(Boolean) as OperationInfo[],
    )
    .flat()
    .sort((a, b) => a.operationId.localeCompare(b.operationId));

  const referencedTypes = operations.flatMap(
    ({ parameters, requestBodyType, responseType }) => [
      ...parameters.map(({ typeInfo: { type } }) => type),
      ...(requestBodyType?.map(({ type }) => type) ?? []),
      ...responseType.map(({ type }) => type),
    ],
  );

  const referencedSchemas = [
    ...new Set(
      referencedTypes.filter(
        type =>
          ![
            'boolean',
            'number',
            'object',
            'string',
            'unknown',
            'void',
          ].includes(type),
      ),
    ),
  ].sort((a, b) => a.localeCompare(b));

  const parsedSchemaObjects = Object.entries(schemaObjects)
    .map(([name, schemaObject]) => ({ name: pascalCase(name), schemaObject }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const compiledSchemasOutput = schemasTemplate({
    schemaObjects: parsedSchemaObjects,
  });

  const compiledRequestsOutput = requestsTemplate({
    operations,
    referencedSchemas,
  });

  return {
    schemas: prettier(compiledSchemasOutput),
    requests: prettier(compiledRequestsOutput),
  };
};
