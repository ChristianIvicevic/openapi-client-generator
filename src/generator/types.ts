import type { OpenAPIV3 } from 'openapi-types';

export type Context = {
  readonly document: OpenAPIV3.Document;
  readonly path?: string;
  readonly referencedSchemas: string[];
};

export type OperationMethod = 'get' | 'post' | 'put' | 'delete';
