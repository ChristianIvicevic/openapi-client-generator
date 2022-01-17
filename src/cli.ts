/* istanbul ignore file */

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { configureLogging } from 'generator/logging';
import { generateSourceFilesOrThrow } from 'index';
import { join } from 'path';
import winston from 'winston';
import yargs from 'yargs';

const commandLineArguments = yargs
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
    r: {
      alias: 'requests',
      type: 'string',
      description: 'File name to write generated request methods to',
      default: 'requests.ts',
    },
    s: {
      alias: 'schemas',
      type: 'string',
      description: 'File name to write generated schemas to',
      default: 'schemas.ts',
    },
    p: {
      alias: 'paths',
      type: 'string',
      description: 'File name to write generated API paths to',
      default: 'paths.ts',
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
    help: {
      type: 'boolean',
      description: 'Outputs this message',
    },
  })
  .wrap(80)
  .parseSync();

void (() => {
  const {
    i: inputFile,
    o: outputFolder,
    r: requestsFileName,
    s: schemasFileName,
    p: pathsFileName,
    v: verbose,
    d: debug,
  } = commandLineArguments;

  configureLogging(
    // eslint-disable-next-line no-nested-ternary
    verbose === true ? 'verbose' : debug === true ? 'debug' : 'info',
  );

  if (!existsSync(inputFile)) {
    winston.error(`The input file '${inputFile}' does not exist`);
    process.exit(1);
  }

  if (!existsSync(outputFolder)) {
    winston.error(`The output directory '${outputFolder}' does not exist`);
    process.exit(1);
  }

  winston.info(`Parsing OpenAPIV3.1 document at '${inputFile}'`);

  const requestsFilePath = join(outputFolder, requestsFileName);
  const schemasFilePath = join(outputFolder, schemasFileName);
  const pathsFilePath = join(outputFolder, pathsFileName);

  try {
    const schemaContent = readFileSync(inputFile).toString();
    const { operationsFileContent, schemaFileContent, pathsFileContent } =
      generateSourceFilesOrThrow(schemaContent, { schemasFileName });
    writeFileSync(requestsFilePath, operationsFileContent);
    writeFileSync(schemasFilePath, schemaFileContent);
    writeFileSync(pathsFilePath, pathsFileContent);
  } catch (e: unknown) {
    winston.error(debug === true ? e : String(e));
    process.exit(1);
  }

  winston.info('🎉 OpenAPI client generation finished!');
  winston.info(`Request function are available at '${requestsFilePath}'`);
  winston.info(`Schema types are available at '${schemasFilePath}'`);
  winston.info(`Paths are available at '${pathsFilePath}'`);
})();
