/* istanbul ignore file */

import type { OpenAPIV3 } from 'openapi-types';
import yaml from 'yaml';

export const createTestDocument = (document: Partial<OpenAPIV3.Document>) =>
  yaml.stringify({
    openapi: '3.1',
    info: {
      title: 'API under test',
      version: '1.0.0-SNAPSHOT',
    },
    ...document,
  } as OpenAPIV3.Document);

export const createTestDocumentWithPaths = (
  paths: OpenAPIV3.Document['paths'],
) => createTestDocument({ paths });

export const createTestDocumentWithSchemas = (
  schemas: NonNullable<
    NonNullable<OpenAPIV3.Document['components']>['schemas']
  >,
) => createTestDocument({ components: { schemas } });
