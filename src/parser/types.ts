import type { OpenAPIV3 } from 'openapi-types';
import type { LiteralUnion } from 'type-fest';

export type DocumentInfo = {
  readonly pathItemObjects: readonly PathItemObjectInfo[];
};

export type ParserContext = {
  readonly document: OpenAPIV3.Document;
  readonly path: string;
  readonly method?: OperationMethod;
  readonly parameters?: readonly ParameterInfo[];
};

export type OperationMethod = 'get' | 'post' | 'put' | 'delete';

export type OperationInfo = {
  readonly path: string;
  readonly method: OperationMethod;
  readonly operationId: string;
  readonly summary?: string;
  readonly responseType: readonly TypeInfo[];
  readonly requestBodyType?: readonly TypeInfo[];
  readonly parameters: readonly ParameterInfo[];
};

export type ParameterInfo = {
  readonly name: string;
  readonly in: string;
  readonly description?: string;
  readonly typeInfo: TypeInfo;
};

export type PathItemObjectInfo = {
  readonly [K in OperationMethod]?: OperationInfo;
};

export type TypeInfo = {
  readonly type: LiteralUnion<
    'boolean' | 'number' | 'object' | 'string' | 'unknown' | 'void',
    string
  >;
  readonly isArray?: boolean;
};
