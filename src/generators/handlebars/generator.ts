import type { CompilationContext } from 'generators/handlebars/types';
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

const getRequestBodyArgument = (
  method: OperationMethod,
  typeInfo?: readonly TypeInfo[],
) => {
  if (method !== 'post' && method !== 'put') {
    return '';
  }

  return typeInfo === undefined ? 'undefined,' : 'requestBody,';
};

const formatParameters = (text: string) => text.replace(/\{/g, '${parameters.');

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
Handlebars.registerHelper('has-query-parameters', hasQueryParameters);
Handlebars.registerHelper('has-request-body', hasRequestBody);
Handlebars.registerHelper('is-query-parameter', isQueryParameter);
Handlebars.registerHelper('resolve-type', resolveType);
Handlebars.registerHelper('resolve-types', resolveTypes);
Handlebars.registerHelper('wrap-jsdoc', wrapJsdoc);

// END Handlebars helper functions

export const compileUsingHandlebars = async (
  documentInfo: DocumentInfo,
  { typesPath }: Pick<CompilationContext, 'typesPath'> = {
    typesPath: './types',
  },
) => {
  // The import MUST have the explicit suffix otherwise the ts path plugin
  // won't be able to resolve it properly for runtime
  await import('generators/handlebars/requests.precompiled.js');

  const requestsTemplate = Handlebars.templates[
    'requests.hbs'
  ] as HandlebarsTemplateDelegate<CompilationContext>;

  const operations = Object.values(documentInfo.pathItemObjects)
    .map(
      pathItemObject =>
        Object.values(pathItemObject).filter(Boolean) as OperationInfo[],
    )
    .flat()
    .sort((a, b) => a.operationId.localeCompare(b.operationId));

  const parameterSchemaTypes = operations.flatMap(({ parameters }) =>
    parameters.flatMap(({ typeInfo: { type } }) => type),
  );

  const schemaTypes = [
    ...new Set(
      operations
        .flatMap(({ responseType }) => responseType.flatMap(({ type }) => type))
        .concat(parameterSchemaTypes)
        .filter(
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

  const compiledOutput = requestsTemplate({
    typesPath,
    operations,
    schemaTypes,
  });

  return format(compiledOutput, {
    ...{
      arrowParens: 'avoid',
      singleQuote: true,
      tabWidth: 2,
      trailingComma: 'all',
    },
    parser: 'typescript',
  });
};
