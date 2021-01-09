import { compileDocument } from 'generator';
import { parseYaml } from 'parser';
import { compose } from 'ramda';
import { createTestDocument, createTestDocumentWithPaths } from 'utils/testing';

// TESTEE function
const compile = compose(compileDocument, parseYaml);

describe('Error Handling', () => {
  it('throws for an operation without an operationId', () => {
    // GIVEN an OpenAPI schema that contains an endpoint with no operationId
    const document = createTestDocumentWithPaths({
      '/api/test': {
        get: {
          responses: {
            204: {
              description: 'Response under test.',
            },
          },
          summary: 'Endpoint under test.',
        },
      },
    });

    // WHEN attempting to compile
    const functionUnderTest = () => compile(document);

    // THEN the compiler should throw an error
    expect(functionUnderTest).toThrowErrorMatchingInlineSnapshot(
      `"'get' operation object has no operation id"`,
    );
  });

  it('throws for an operation without any responses', () => {
    // GIVEN an OpenAPI schema that contains an endpoint with no responses
    const document = createTestDocumentWithPaths({
      '/api/test': {
        get: {
          operationId: 'getOperation',
          summary: 'Endpoint under test.',
        },
      },
    });

    // WHEN attempting to compile
    const functionUnderTest = () => compile(document);

    // THEN the compiler should throw an error
    expect(functionUnderTest).toThrowErrorMatchingInlineSnapshot(
      `"'get' operation object has no responses"`,
    );
  });

  it('throws for an operation that references a parameter that does not exist', () => {
    // GIVEN an OpenAPI schema that contains a single endpoint with a reference
    // to a parameter that does not exist
    const document = createTestDocumentWithPaths({
      '/api/test/{does-not-exist}': {
        parameters: [
          {
            $ref: '#/components/parameters/does-not-exist',
          },
        ],
        get: {
          operationId: 'getOperation',
          responses: {
            204: {
              description: 'No content.',
            },
          },
          summary: 'Endpoint under test.',
        },
      },
    });

    // WHEN attempting to compile
    const functionUnderTest = () => compile(document);

    // THEN the compiler should throw an error
    expect(functionUnderTest).toThrowErrorMatchingInlineSnapshot(
      `"Cannot dereference component '#/components/parameters/does-not-exist'"`,
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
        '/api/test/{param-ref}': {
          parameters: [
            {
              $ref: '#/components/parameters/deep-param-ref',
            },
          ],
          get: {
            operationId: 'getOperation',
            responses: {
              204: {
                description: 'No content.',
              },
            },
            summary: 'Endpoint under test.',
          },
        },
      },
    });

    // WHEN attempting to compile
    const functionUnderTest = () => compile(document);

    // THEN the compiler should throw an error
    expect(functionUnderTest).toThrowErrorMatchingInlineSnapshot(
      `"Dereferenced component '#/components/parameters/deep-param-ref' is a deep reference to '#/components/parameters/param-ref', which is not supported"`,
    );
  });

  it('throws when trying to dereference a type that is not a schema', () => {
    // GIVEN an OpenAPI schema that contains a single endpoint with a reference
    // to a type that is not a schema
    const document = createTestDocumentWithPaths({
      '/api/test': {
        get: {
          operationId: 'getOperation',
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
          summary: 'Endpoint under test.',
        },
      },
    });

    // WHEN attempting to compile
    const functionUnderTest = () => compile(document);

    // THEN the compiler should throw an error
    expect(functionUnderTest).toThrowErrorMatchingInlineSnapshot(
      `"The reference '#/components/examples/ExampleDto' does not match the pattern '#/components/schemas/*'"`,
    );
  });

  it('throws when trying to dereference a deeply nested component', () => {
    // GIVEN an OpenAPI schema that contains a single endpoint with a deeply
    // nested component
    const document = createTestDocument({
      components: {
        responses: {
          TestRefResponse: {
            $ref: '#/components/responses/TestResponse',
          },
          TestResponse: {
            description: 'No content.',
            content: {
              'application/json': {
                schema: {},
              },
            },
          },
        },
      },
      paths: {
        '/api/test': {
          get: {
            operationId: 'getOperation',
            responses: {
              204: {
                $ref: '#/components/responses/TestRefResponse',
              },
            },
            summary: 'Endpoint under test.',
          },
        },
      },
    });

    // WHEN attempting to compile
    const functionUnderTest = () => compile(document);

    // THEN the compiler should throw an error
    expect(functionUnderTest).toThrowErrorMatchingInlineSnapshot(
      `"Dereferenced component '#/components/responses/TestRefResponse' is a deep reference to '#/components/responses/TestResponse', which is not supported"`,
    );
  });

  it('throws when trying to dereference an unsupported component', () => {
    // GIVEN an OpenAPI schema that contains a single endpoint with a deeply
    // nested component
    const document = createTestDocumentWithPaths({
      '/api/test': {
        get: {
          operationId: 'getOperation',
          responses: {
            204: {
              $ref: '#/components/callbacks/TestCallback',
            },
          },
          summary: 'Endpoint under test.',
        },
      },
    });

    // WHEN attempting to compile
    const functionUnderTest = () => compile(document);

    // THEN the compiler should throw an error
    expect(functionUnderTest).toThrowErrorMatchingInlineSnapshot(
      `"Cannot dereference component '#/components/callbacks/TestCallback'"`,
    );
  });
});
