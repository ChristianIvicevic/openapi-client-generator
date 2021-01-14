/* istanbul ignore file */

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { getLogger } from 'utils/logging';
import yargs from 'yargs';
import { compile } from '.';

const yargsObject = yargs
  .usage('Usage: $0 -i [INPUT] -o [OUTPUT]')
  .options({
    i: {
      alias: 'input',
      type: 'string',
      description: 'Input file',
      demandOption: true,
    },
    o: {
      alias: 'output',
      type: 'string',
      description: 'Output folder',
      demandOption: true,
    },
    v: {
      alias: 'verbose',
      type: 'boolean',
      description: 'Run with verbose logging',
      conflicts: ['d'],
    },
    d: {
      alias: 'debug',
      type: 'boolean',
      description: 'Run with even more verbose logging',
      conflicts: ['v'],
    },
    version: {
      type: 'boolean',
      description: 'Prints the current compiler version',
    },
    help: {
      type: 'boolean',
      description: 'Outputs this message',
    },
  })
  .wrap(80);

void (() => {
  const {
    argv: { i: inputFile, o: outputFolder, v: verbose, d: debug },
  } = yargsObject;
  process.env.OCG_LOG_LEVEL =
    // eslint-disable-next-line no-nested-ternary
    verbose === true ? 'verbose' : debug === true ? 'debug' : 'info';

  const logger = getLogger();

  if (!existsSync(inputFile)) {
    logger.error(`The input file '${inputFile}' does not exist`);
    process.exit(1);
  }

  if (!existsSync(outputFolder)) {
    logger.error(`The output directory '${outputFolder}' does not exist`);
    process.exit(1);
  }

  logger.info(`Parsing OpenAPIV3 document at '${inputFile}'`);

  try {
    const yamlContent = readFileSync(inputFile).toString();
    const { requests, schemas } = compile(yamlContent);
    writeFileSync(join(outputFolder, 'requests.ts'), requests);
    writeFileSync(join(outputFolder, 'schemas.ts'), schemas);
  } catch (e: unknown) {
    logger.error(debug === true ? e : String(e));
    process.exit(1);
  }

  logger.info(
    [
      '🎉 Compilation finished!',
      ` * Request helpers are available at '${outputFolder}/requests.ts'`,
      ` * Schema types are available at '${outputFolder}/schemas.ts'`,
    ].join('\n'),
  );
})();
