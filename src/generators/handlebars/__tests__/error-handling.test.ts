import { compileUsingHandlebars } from 'generators/handlebars/generator';
import type { OpenAPIV3 } from 'openapi-types';
import { parseYaml } from 'parser/parser';
import { compose } from 'ramda';
import { createTestDocument, createTestDocumentWithPaths } from 'utils/testing';

// TESTEE function
const compile = compose(compileUsingHandlebars, parseYaml);

describe('Handlebars Generator Error Handling', () => {
  it('throws for an operation without an operationId', () => {
    // GIVEN an OpenAPI schema that contains a single endpoint with no
    // operationId
    const document = createTestDocumentWithPaths({
      '/api/sample': {
        get: {
          responses: {
            204: {
              description: 'No content',
            },
          },
          summary: 'Endpoint under test',
        } as OpenAPIV3.OperationObject,
      },
    });

    // WHEN attempting to compile with the handlebars generator
    const functionUnderTest = () => compile(document);

    // THEN the compiler should throw an error
    expect(functionUnderTest).toThrowErrorMatchingInlineSnapshot(
      `"'get' operation object has no operation id"`,
    );
  });

  it('throws for an operation that references a parameter that does not exist', () => {
    // GIVEN an OpenAPI schema that contains a single endpoint with a reference
    // to a parameter that does not exist
    const document = createTestDocumentWithPaths({
      '/api/sample/{does-not-exist}': {
        parameters: [
          {
            $ref: '#/components/parameters/does-not-exist',
          },
        ],
        get: {
          operationId: 'getSample',
          responses: {
            204: {
              description: 'No content',
            },
          },
          summary: 'Endpoint under test',
        } as OpenAPIV3.OperationObject,
      },
    });

    // WHEN attempting to compile with the handlebars generator
    const functionUnderTest = () => compile(document);

    // THEN the compiler should throw an error
    expect(functionUnderTest).toThrowErrorMatchingInlineSnapshot(
      `"Cannot dereference parameter '#/components/parameters/does-not-exist'"`,
    );
  });

  it('throws for an operation that references a parameter that is a ref as well', () => {
    // GIVEN an OpenAPI schema that contains a single endpoint with a reference
    // to a parameter that is a ref as well
    const document = createTestDocument({
      components: {
        parameters: {
          'deep-param-ref': {
            $ref: '#/components/parameters/param-ref',
          },
        },
      },
      paths: {
        '/api/sample/{param-ref}': {
          parameters: [
            {
              $ref: '#/components/parameters/deep-param-ref',
            },
          ],
          get: {
            operationId: 'getSample',
            responses: {
              204: {
                description: 'No content',
              },
            },
            summary: 'Endpoint under test',
          } as OpenAPIV3.OperationObject,
        },
      },
    });

    // WHEN attempting to compile with the handlebars generator
    const functionUnderTest = () => compile(document);

    // THEN the compiler should throw an error
    expect(functionUnderTest).toThrowErrorMatchingInlineSnapshot(
      `"Dereferenced parameter '#/components/parameters/deep-param-ref' is a deep reference to '#/components/parameters/param-ref', which is not supported"`,
    );
  });

  it('throws for an operation that references a parameter without a schema', () => {
    // GIVEN an OpenAPI schema that contains a single endpoint with a reference
    // to a parameter without a schema
    const document = createTestDocument({
      components: {
        parameters: {
          param: {
            in: 'path',
            name: 'param',
          },
        },
      },
      paths: {
        '/api/sample/{param}': {
          parameters: [
            {
              $ref: '#/components/parameters/param',
            },
          ],
          get: {
            operationId: 'getSample',
            responses: {
              204: {
                description: 'No content',
              },
            },
            summary: 'Endpoint under test',
          } as OpenAPIV3.OperationObject,
        },
      },
    });

    // WHEN attempting to compile with the handlebars generator
    const functionUnderTest = () => compile(document);

    // THEN the compiler should throw an error
    expect(functionUnderTest).toThrowErrorMatchingInlineSnapshot(
      `"There is no schema for the referenced parameter '#/components/parameters/param'"`,
    );
  });

  it('throws for an operation that has an inline parameter without a schema', () => {
    // GIVEN an OpenAPI schema that contains a single endpoint with an inline
    // parameter without a schema
    const document = createTestDocumentWithPaths({
      '/api/sample/{param}': {
        parameters: [
          {
            in: 'path',
            name: 'param',
          },
        ],
        get: {
          operationId: 'getSample',
          responses: {
            204: {
              description: 'No content',
            },
          },
          summary: 'Endpoint under test',
        } as OpenAPIV3.OperationObject,
      },
    });

    // WHEN attempting to compile with the handlebars generator
    const functionUnderTest = () => compile(document);

    // THEN the compiler should throw an error
    expect(functionUnderTest).toThrowErrorMatchingInlineSnapshot(
      `"There is no schema for the parameter 'param'"`,
    );
  });

  it('throws when trying to dereference a type that is not a schema', () => {
    // GIVEN an OpenAPI schema that contains a single endpoint with a reference
    // to a type that is not a schema
    const document = createTestDocumentWithPaths({
      '/api/sample': {
        get: {
          operationId: 'getSample',
          responses: {
            200: {
              description: 'OK',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/examples/ExampleDto',
                  },
                },
              },
            },
          },
          summary: 'Endpoint under test',
        } as OpenAPIV3.OperationObject,
      },
    });

    // WHEN attempting to compile with the handlebars generator
    const functionUnderTest = () => compile(document);

    // THEN the compiler should throw an error
    expect(functionUnderTest).toThrowErrorMatchingInlineSnapshot(
      `"The reference '#/components/examples/ExampleDto' does not match the pattern '#/components/schemas/*'"`,
    );
  });
});
