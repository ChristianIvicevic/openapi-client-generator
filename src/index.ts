/* istanbul ignore file */

import { compileDocument } from 'generator';
import { parseYaml } from 'parser';
import { compose } from 'ramda';

/**
 * Tries to parse the given OpenAPI YAML schema and compiles it into two
 * separate Typescript files, one for the schemas and one for the requests.
 *
 * This method assumes that the supplied argument is valid YAML. Even though
 * the YAML isn't validated against the OpenAPI specification schema the code
 * generator will verify that all necessary properties such as operation ids
 * etc. are defined.
 *
 * @param x0 OpenAPI YAML schema content as string.
 */
export const compile = compose(compileDocument, parseYaml);
