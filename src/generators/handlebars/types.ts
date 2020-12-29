import type { OperationInfo } from 'parser/types';

export type CompilationContext = {
  readonly typesPath: string;
  readonly schemaTypes: readonly string[];
  readonly operations: readonly OperationInfo[];
};
