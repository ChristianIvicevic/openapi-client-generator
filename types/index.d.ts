/**
 * Compiler options to customize the behavior of the generator.
 */
export declare type CompilerOptions = {
  /**
   * File name to write generated schemas to. Defaults to `schemas.ts`.
   */
  readonly schemasFileName?: string;
};

/**
 * Tries to parse the given OpenAPI YAML schema and compiles it into two
 * separate Typescript files, one for the schemas and one for the requests.
 *
 * This method assumes that the supplied argument is valid YAML. Even though
 * the YAML isn't validated against the OpenAPI specification schema the code
 * generator will verify that all necessary properties such as operation ids
 * etc. are defined.
 *
 * @param yamlSchema OpenAPI YAML schema content as string.
 * @param options Optional compiler options.
 */
export declare const compile: (
  yamlSchema: string,
  options?: CompilerOptions | undefined,
) => {
  schemas: string;
  requests: string;
};
