/* istanbul ignore file */

import { createLogger, format, transports } from 'winston';
import { consoleFormat } from 'winston-console-format';

export const getLogger = () =>
  createLogger({
    level: process.env.OCG_LOG_LEVEL ?? 'info',
    format: format.combine(
      format.timestamp(),
      format.ms(),
      format.errors({ stack: true }),
      format.splat(),
      format.json(),
    ),
    defaultMeta: { service: 'ts-transform-openapi' },
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
