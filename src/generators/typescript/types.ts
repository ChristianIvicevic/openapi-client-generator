import type { OpenAPIV3 } from 'openapi-types';

export type TypescriptCompilationContext = {
  readonly document: OpenAPIV3.Document;
  readonly path?: string;
  readonly referencedSchemas: string[];
};
