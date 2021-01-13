import { compileDocument } from 'generator';
import { parseYaml } from 'parser';
import { compose } from 'ramda';
import { createTestDocument, createTestDocumentWithPaths } from 'utils/testing';

// TESTEE function
const compile = compose(compileDocument, parseYaml);

describe('Responses', () => {
  it('compiles operations with empty responses', () => {
    // GIVEN an OpenAPI schema that contains operations with empty responses
    const document = createTestDocumentWithPaths({
      '/api/test': {
        get: {
          operationId: 'getOperation',
          responses: {
            204: {
              description: 'No content.',
            },
          },
          summary: 'Endpoint under test.',
        },
        post: {
          operationId: 'postOperation',
          responses: {
            204: {
              description: 'No content.',
            },
          },
          summary: 'Endpoint under test.',
        },
        put: {
          operationId: 'putOperation',
          responses: {
            204: {
              description: 'No content.',
            },
          },
          summary: 'Endpoint under test.',
        },
        delete: {
          operationId: 'deleteOperation',
          responses: {
            204: {
              description: 'No content.',
            },
          },
          summary: 'Endpoint under test.',
        },
      },
    });

    // WHEN compiling
    const { requests } = compile(document);

    // THEN the output matches the snapshot
    expect(requests).toMatchInlineSnapshot(`
      "/* eslint-disable */
      /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
      import type { AxiosRequestConfig } from 'axios';
      import axios from 'axios';
      /**
       * Endpoint under test.
       * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
       */
      export const deleteOperation = async (config?: AxiosRequestConfig) =>
        axios.delete<void>('/api/test', config);
      /**
       * Endpoint under test.
       * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
       */
      export const getOperation = async (config?: AxiosRequestConfig) =>
        axios.get<void>('/api/test', config);
      /**
       * Endpoint under test.
       * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
       */
      export const postOperation = async (config?: AxiosRequestConfig) =>
        axios.post<void>('/api/test', undefined, config);
      /**
       * Endpoint under test.
       * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
       */
      export const putOperation = async (config?: AxiosRequestConfig) =>
        axios.put<void>('/api/test', undefined, config);
      "
    `);
  });

  it('compiles operations with a response content schema $ref', () => {
    // GIVEN an OpenAPI schema that contains operations with a response content
    // schema $ref
    const document = createTestDocumentWithPaths({
      '/api/test': {
        get: {
          operationId: 'getOperation',
          responses: {
            204: {
              description: 'No content.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/TestDto',
                  },
                },
              },
            },
          },
          summary: 'Endpoint under test.',
        },
        post: {
          operationId: 'postOperation',
          responses: {
            204: {
              description: 'No content.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/TestDto',
                  },
                },
              },
            },
          },
          summary: 'Endpoint under test.',
        },
        put: {
          operationId: 'putOperation',
          responses: {
            204: {
              description: 'No content.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/TestDto',
                  },
                },
              },
            },
          },
          summary: 'Endpoint under test.',
        },
        delete: {
          operationId: 'deleteOperation',
          responses: {
            204: {
              description: 'No content.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/TestDto',
                  },
                },
              },
            },
          },
          summary: 'Endpoint under test.',
        },
      },
    });

    // WHEN compiling
    const { requests } = compile(document);

    // THEN the output matches the snapshot
    expect(requests).toMatchInlineSnapshot(`
      "/* eslint-disable */
      /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
      import type { AxiosRequestConfig } from 'axios';
      import axios from 'axios';
      import type { TestDto } from './schemas';
      /**
       * Endpoint under test.
       * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
       */
      export const deleteOperation = async (config?: AxiosRequestConfig) =>
        axios.delete<TestDto>('/api/test', config);
      /**
       * Endpoint under test.
       * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
       */
      export const getOperation = async (config?: AxiosRequestConfig) =>
        axios.get<TestDto>('/api/test', config);
      /**
       * Endpoint under test.
       * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
       */
      export const postOperation = async (config?: AxiosRequestConfig) =>
        axios.post<TestDto>('/api/test', undefined, config);
      /**
       * Endpoint under test.
       * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
       */
      export const putOperation = async (config?: AxiosRequestConfig) =>
        axios.put<TestDto>('/api/test', undefined, config);
      "
    `);
  });

  it('compiles operations with a response $ref array', () => {
    // GIVEN an OpenAPI schema that contains operations with a response $ref
    // array
    const document = createTestDocumentWithPaths({
      '/api/test': {
        get: {
          operationId: 'getOperation',
          responses: {
            204: {
              description: 'No content.',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/TestDto',
                    },
                  },
                },
              },
            },
          },
          summary: 'Endpoint under test.',
        },
        post: {
          operationId: 'postOperation',
          responses: {
            204: {
              description: 'No content.',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/TestDto',
                    },
                  },
                },
              },
            },
          },
          summary: 'Endpoint under test.',
        },
        put: {
          operationId: 'putOperation',
          responses: {
            204: {
              description: 'No content.',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/TestDto',
                    },
                  },
                },
              },
            },
          },
          summary: 'Endpoint under test.',
        },
        delete: {
          operationId: 'deleteOperation',
          responses: {
            204: {
              description: 'No content.',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/TestDto',
                    },
                  },
                },
              },
            },
          },
          summary: 'Endpoint under test.',
        },
      },
    });

    // WHEN compiling
    const { requests } = compile(document);

    // THEN the output matches the snapshot
    expect(requests).toMatchInlineSnapshot(`
      "/* eslint-disable */
      /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
      import type { AxiosRequestConfig } from 'axios';
      import axios from 'axios';
      import type { TestDto } from './schemas';
      /**
       * Endpoint under test.
       * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
       */
      export const deleteOperation = async (config?: AxiosRequestConfig) =>
        axios.delete<readonly TestDto[]>('/api/test', config);
      /**
       * Endpoint under test.
       * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
       */
      export const getOperation = async (config?: AxiosRequestConfig) =>
        axios.get<readonly TestDto[]>('/api/test', config);
      /**
       * Endpoint under test.
       * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
       */
      export const postOperation = async (config?: AxiosRequestConfig) =>
        axios.post<readonly TestDto[]>('/api/test', undefined, config);
      /**
       * Endpoint under test.
       * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
       */
      export const putOperation = async (config?: AxiosRequestConfig) =>
        axios.put<readonly TestDto[]>('/api/test', undefined, config);
      "
    `);
  });

  it('compiles operations with an inline response array', () => {
    // GIVEN an OpenAPI schema that contains operations with an inline response
    // array
    const document = createTestDocumentWithPaths({
      '/api/test': {
        get: {
          operationId: 'getOperation',
          responses: {
            204: {
              description: 'No content.',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {},
                  },
                },
              },
            },
          },
          summary: 'Endpoint under test.',
        },
        post: {
          operationId: 'postOperation',
          responses: {
            204: {
              description: 'No content.',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {},
                  },
                },
              },
            },
          },
          summary: 'Endpoint under test.',
        },
        put: {
          operationId: 'putOperation',
          responses: {
            204: {
              description: 'No content.',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {},
                  },
                },
              },
            },
          },
          summary: 'Endpoint under test.',
        },
        delete: {
          operationId: 'deleteOperation',
          responses: {
            204: {
              description: 'No content.',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {},
                  },
                },
              },
            },
          },
          summary: 'Endpoint under test.',
        },
      },
    });

    // WHEN compiling
    const { requests } = compile(document);

    // THEN the output matches the snapshot
    expect(requests).toMatchInlineSnapshot(`
      "/* eslint-disable */
      /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
      import type { AxiosRequestConfig } from 'axios';
      import axios from 'axios';
      /**
       * Endpoint under test.
       * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
       */
      export const deleteOperation = async (config?: AxiosRequestConfig) =>
        axios.delete<readonly unknown[]>('/api/test', config);
      /**
       * Endpoint under test.
       * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
       */
      export const getOperation = async (config?: AxiosRequestConfig) =>
        axios.get<readonly unknown[]>('/api/test', config);
      /**
       * Endpoint under test.
       * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
       */
      export const postOperation = async (config?: AxiosRequestConfig) =>
        axios.post<readonly unknown[]>('/api/test', undefined, config);
      /**
       * Endpoint under test.
       * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
       */
      export const putOperation = async (config?: AxiosRequestConfig) =>
        axios.put<readonly unknown[]>('/api/test', undefined, config);
      "
    `);
  });

  it('compiles operations with a response object that is a $ref', () => {
    // GIVEN an OpenAPI schema that contains operations with a response object
    // that is a $ref
    const document = createTestDocument({
      components: {
        responses: {
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
                $ref: '#/components/responses/TestResponse',
              },
            },
            summary: 'Endpoint under test.',
          },
          post: {
            operationId: 'postOperation',
            responses: {
              204: {
                $ref: '#/components/responses/TestResponse',
              },
            },
            summary: 'Endpoint under test.',
          },
          put: {
            operationId: 'putOperation',
            responses: {
              204: {
                $ref: '#/components/responses/TestResponse',
              },
            },
            summary: 'Endpoint under test.',
          },
          delete: {
            operationId: 'deleteOperation',
            responses: {
              204: {
                $ref: '#/components/responses/TestResponse',
              },
            },
            summary: 'Endpoint under test.',
          },
        },
      },
    });

    // WHEN compiling
    const { requests } = compile(document);

    // THEN the output matches the snapshot
    expect(requests).toMatchInlineSnapshot(`
      "/* eslint-disable */
      /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
      import type { AxiosRequestConfig } from 'axios';
      import axios from 'axios';
      /**
       * Endpoint under test.
       * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
       */
      export const deleteOperation = async (config?: AxiosRequestConfig) =>
        axios.delete<unknown>('/api/test', config);
      /**
       * Endpoint under test.
       * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
       */
      export const getOperation = async (config?: AxiosRequestConfig) =>
        axios.get<unknown>('/api/test', config);
      /**
       * Endpoint under test.
       * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
       */
      export const postOperation = async (config?: AxiosRequestConfig) =>
        axios.post<unknown>('/api/test', undefined, config);
      /**
       * Endpoint under test.
       * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
       */
      export const putOperation = async (config?: AxiosRequestConfig) =>
        axios.put<unknown>('/api/test', undefined, config);
      "
    `);
  });
});
