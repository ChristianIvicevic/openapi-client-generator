import { Constants } from 'generator/constants';
import { createLeadingTrivia } from 'generator/factories/leading-trivia';
import type { CreateOperationOrThrowParameters } from 'generator/factories/operation';
import { createOperationOrThrow } from 'generator/factories/operation';
import { createSchemaDeclaration } from 'generator/factories/schema-declaration';
import type { OpenAPIV3 } from 'openapi-types';
import ts, { factory } from 'typescript';
import { assertIsDefined } from 'utils/assert';
import { format } from 'utils/format';
import { compact } from 'utils/fp';
import { getLogger } from 'utils/logging';

export const compileDocument = (document: OpenAPIV3.Document) => {
  const logger = getLogger();
  const referencedSchemas: string[] = [];

  logger.verbose('Compiling schemas...');
  const compiledSchemas = Object.entries(document.components?.schemas ?? {})
    .sort(([a], [b]) => a.localeCompare(b))
    .flatMap(([schema, schemaObject]) => {
      logger.debug(`Compiling schema '${schema}'`);
      return createSchemaDeclaration(
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
  const compiledOperations = compact(
    Object.entries(document.paths ?? {})
      .flatMap(([path, pathItemObject]) => {
        assertIsDefined(pathItemObject);

        const { parameters: pathParameters } = pathItemObject;

        return compact(
          Constants.SUPPORTED_OPERATION_METHODS.map((method):
            | CreateOperationOrThrowParameters
            | undefined =>
            pathItemObject[method]
              ? {
                  operationId:
                    pathItemObject[method]?.operationId ?? '<NO OPERATION ID>',
                  parameters: [
                    { document, path, referencedSchemas },
                    method,
                    pathParameters,
                    pathItemObject[method],
                  ],
                }
              : undefined,
          ),
        );
      })
      .sort((a, b) => a.operationId.localeCompare(b.operationId))
      .flatMap(({ parameters }) => createOperationOrThrow(...parameters)),
  );

  const schemasContent = compileNodes(compiledSchemas);
  const requestsContent = compileNodes([
    ...createLeadingTrivia({
      referencedSchemas: [
        ...new Set(referencedSchemas.sort((a, b) => a.localeCompare(b))),
      ],
    }),
    ...compiledOperations,
  ]);

  return {
    schemas: format(schemasContent),
    requests: format(requestsContent),
  };
};

const compileNodes = <T extends ts.Node>(elements: readonly T[]) =>
  [
    '/* eslint-disable */',
    '/* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */',
    ts
      .createPrinter({ newLine: ts.NewLineKind.LineFeed })
      .printList(
        ts.ListFormat.MultiLine,
        factory.createNodeArray(elements),
        ts.createSourceFile(
          'output.ts',
          '',
          ts.ScriptTarget.Latest,
          false,
          ts.ScriptKind.TS,
        ),
      ),
  ].join('\n');
