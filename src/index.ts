import { compileDocument } from 'generator';
import type { CompileOptions } from 'generator/types';
import { parseYaml } from 'parser';

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
export const compile = (yamlSchema: string, options?: CompileOptions) =>
  compileDocument(parseYaml(yamlSchema), options);
