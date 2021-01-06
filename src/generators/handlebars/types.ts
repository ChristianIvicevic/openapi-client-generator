import type { OpenAPIV3 } from 'openapi-types';
import type { OperationInfo } from 'parser/types';

export type SchemasCompilationContext = {
  readonly schemaObjects: ReadonlyArray<{
    readonly name: string;
    readonly schemaObject:
      | OpenAPIV3.ReferenceObject
      | OpenAPIV3.ArraySchemaObject
      | OpenAPIV3.NonArraySchemaObject;
  }>;
};

export type RequestsCompilationContext = {
  readonly referencedSchemas: readonly string[];
  readonly operations: readonly OperationInfo[];
};
