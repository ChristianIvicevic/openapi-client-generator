/* istanbul ignore file */

import winston, { format, transports } from 'winston';
import { consoleFormat } from 'winston-console-format';

export const configureLogging = (level = 'info') =>
  winston.configure({
    level,
    format: format.combine(
      format.timestamp(),
      format.ms(),
      format.errors({ stack: true }),
      format.splat(),
      format.json(),
    ),
    defaultMeta: { service: 'openapi-client-generator' },
    transports: [
      new transports.Console({
        silent: process.env.NODE_ENV === 'test',
        format: format.combine(
          format.colorize({ all: true }),
          format.padLevels(),
          consoleFormat({
            showMeta: true,
            metaStrip: ['timestamp', 'service'],
            inspectOptions: {
              depth: Infinity,
              colors: true,
              maxArrayLength: Infinity,
              breakLength: 120,
              compact: Infinity,
            },
          }),
        ),
      }),
    ],
  });
