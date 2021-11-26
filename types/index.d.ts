import type * as E from 'fp-ts/Either';

/**
 * Generator options to customize the behavior of the generator.
 */
export declare type GeneratorOptions = {
  /**
   * File name to write generated schemas to. Defaults to `schemas.ts`.
   */
  readonly schemasFileName?: string;
};

/**
 * Tries to parse the given OpenAPI schema and compiles it into two separate
 * Typescript files, one for the schemas and one for the operations.
 *
 * This method will throw if compilation errors have occurred.
 * @param openApiSchema OpenAPI schema content as string.
 * @param options Optional compiler options.
 */
export declare const generateSourceFilesOrThrow: (
  openApiSchema: string,
  options?: GeneratorOptions,
) => {
  schemaFileContent: string;
  operationsFileContent: string;
};

/**
 * Tries to parse the given OpenAPI schema and compiles it into two separate
 * Typescript files, one for the schemas and one for the operations.
 * @param openApiSchema OpenAPI schema content as string.
 * @param options Optional compiler options.
 */
export declare const generateSourceFiles: (
  openApiSchema: string,
  options?: GeneratorOptions,
) => E.Either<
  readonly string[],
  {
    schemaFileContent: string;
    operationsFileContent: string;
  }
>;
