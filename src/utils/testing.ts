import type { OpenAPIV3 } from 'openapi-types';
import yaml from 'yaml';

export const createTestDocument = (document: Partial<OpenAPIV3.Document>) =>
  yaml.stringify({
    openapi: '3.0.2',
    info: {
      title: 'API under test',
      version: '1.0.0-SNAPSHOT',
    },
    ...document,
  } as OpenAPIV3.Document);

export const createTestDocumentWithPaths = (paths: OpenAPIV3.PathsObject) =>
  createTestDocument({ paths });
