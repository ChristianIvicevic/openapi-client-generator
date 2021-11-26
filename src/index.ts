import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { generateOperations } from 'generator/operations';
import type { GeneratorOptions } from 'generator/options';
import { generateSchemas } from 'generator/schemas';
import type { OpenAPIV3_1 } from 'openapi-types';
import winston from 'winston';
import yaml from 'yaml';

/* istanbul ignore next */
const handleErrors = E.getOrElseW((errors: readonly string[]) => {
  errors.forEach(error => winston.error(error));
  throw new Error(
    'There have been errors during compilation. Please check the output log for details.',
  );
});

/**
 * Tries to parse the given OpenAPI schema and compiles it into two separate
 * Typescript files, one for the schemas and one for the operations.
 *
 * This method will throw if compilation errors have occurred.
 * @param openApiSchema OpenAPI schema content as string.
 * @param options Optional compiler options.
 */
export const generateSourceFilesOrThrow = (
  openApiSchema: string,
  options?: GeneratorOptions,
) => pipe(generateSourceFiles(openApiSchema, options), handleErrors);

/**
 * Tries to parse the given OpenAPI schema and compiles it into two separate
 * Typescript files, one for the schemas and one for the operations.
 * @param openApiSchema OpenAPI schema content as string.
 * @param options Optional compiler options.
 */
export const generateSourceFiles = (
  openApiSchema: string,
  options?: GeneratorOptions,
): E.Either<
  readonly string[],
  {
    schemaFileContent: string;
    operationsFileContent: string;
  }
> =>
  pipe(
    [generateSchemas, generateOperations],
    RA.map(generate =>
      generate(yaml.parse(openApiSchema) as OpenAPIV3_1.Document, options),
    ),
    RA.sequence(E.getApplicativeValidation(RA.getSemigroup<string>())),
    E.map(([schemaFileContent, operationsFileContent]) => ({
      schemaFileContent,
      operationsFileContent,
    })),
  );
