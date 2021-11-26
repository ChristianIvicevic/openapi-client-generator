/* istanbul ignore file */

// eslint-disable-next-line max-classes-per-file
import type { OpenAPIV3 } from 'openapi-types';

export class UnsupportedMixedSchemaObjectError extends Error {
  public constructor(private readonly schemaName: string) {
    super(
      `Unsupported mixed schema object error for '${schemaName}'. The type of '${schemaName}' is declared as an array, however the generator does not support this. Did you mean to make the type nullable according to OpenAPI v3.1? If so, use 'oneOf' including 'type: null' as one of the possible types instead.`,
    );
  }
}

export class ReferenceDoesntMatchValidPatternError extends Error {
  public constructor() {
    super('Cannot dereference specified ref.');
  }
}

export class OperationIdNotDefinedError extends Error {
  public constructor(
    private readonly path: string,
    private readonly method: OpenAPIV3.HttpMethods,
  ) {
    super(
      `The '${method}' method for the path '${path}' needs an operation id.`,
    );
  }
}

export class OperationHasNoResponsesError extends Error {
  public constructor(
    private readonly path: string,
    private readonly method: OpenAPIV3.HttpMethods,
  ) {
    super(`The '${method}' method for the path '${path}' has no responses.`);
  }
}
