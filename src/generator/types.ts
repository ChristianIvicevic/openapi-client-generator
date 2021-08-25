import type { OpenAPIV3 } from 'openapi-types';

export type CompilerOptions = {
  readonly schemasFileName?: string;
};

export type Context = {
  readonly document: OpenAPIV3.Document;
  readonly path?: string;
};

export type OperationMethod = 'get' | 'post' | 'put' | 'delete';
