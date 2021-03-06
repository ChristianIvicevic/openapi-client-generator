import { compile } from 'index';
import { createTestDocument, createTestDocumentWithPaths } from 'utils/testing';

describe('Response Bodies', () => {
  it('compiles operations with a request body content $ref', () => {
    // GIVEN an OpenAPI schema that contains operations with a request body
    // content $ref
    const document = createTestDocumentWithPaths({
      '/api/test': {
        post: {
          operationId: 'postOperation',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/TestDto',
                },
              },
            },
          },
          responses: {
            204: {
              description: 'No content.',
            },
          },
          summary: 'Endpoint under test.',
        },
        put: {
          operationId: 'putOperation',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/TestDto',
                },
              },
            },
          },
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
      import type { TestDto } from './schemas';
      /**
       * Endpoint under test.
       * @param requestBody The HTTP request content sent to the server.
       * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
       */
      export const postOperation = async (
        requestBody?: TestDto | undefined,
        config?: AxiosRequestConfig,
      ) => axios.post<void>('/api/test', requestBody, config);
      /**
       * Endpoint under test.
       * @param requestBody The HTTP request content sent to the server.
       * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
       */
      export const putOperation = async (
        requestBody?: TestDto | undefined,
        config?: AxiosRequestConfig,
      ) => axios.put<void>('/api/test', requestBody, config);
      "
    `);
  });

  it('compiles operations with inline request body content', () => {
    // GIVEN an OpenAPI schema that contains operations with inline request
    // body content
    const document = createTestDocumentWithPaths({
      '/api/test': {
        post: {
          operationId: 'postOperation',
          requestBody: {
            content: {
              'application/json': {
                schema: {},
              },
            },
          },
          responses: {
            204: {
              description: 'No content.',
            },
          },
          summary: 'Endpoint under test.',
        },
        put: {
          operationId: 'putOperation',
          requestBody: {
            content: {
              'application/json': {
                schema: {},
              },
            },
          },
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
       * @param requestBody The HTTP request content sent to the server.
       * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
       */
      export const postOperation = async (
        requestBody?: unknown | undefined,
        config?: AxiosRequestConfig,
      ) => axios.post<void>('/api/test', requestBody, config);
      /**
       * Endpoint under test.
       * @param requestBody The HTTP request content sent to the server.
       * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
       */
      export const putOperation = async (
        requestBody?: unknown | undefined,
        config?: AxiosRequestConfig,
      ) => axios.put<void>('/api/test', requestBody, config);
      "
    `);
  });

  it('compiles operations with request bodies that are $refs', () => {
    // GIVEN an OpenAPI schema that contains operations with request bodies
    // that are $refs
    const document = createTestDocument({
      components: {
        requestBodies: {
          TestRequestBody: {
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
          post: {
            operationId: 'postOperation',
            requestBody: {
              $ref: '#/components/requestBodies/TestRequestBody',
            },
            responses: {
              204: {
                description: 'No content.',
              },
            },
            summary: 'Endpoint under test.',
          },
          put: {
            operationId: 'putOperation',
            requestBody: {
              $ref: '#/components/requestBodies/TestRequestBody',
            },
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
       * @param requestBody The HTTP request content sent to the server.
       * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
       */
      export const postOperation = async (
        requestBody?: unknown | undefined,
        config?: AxiosRequestConfig,
      ) => axios.post<void>('/api/test', requestBody, config);
      /**
       * Endpoint under test.
       * @param requestBody The HTTP request content sent to the server.
       * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
       */
      export const putOperation = async (
        requestBody?: unknown | undefined,
        config?: AxiosRequestConfig,
      ) => axios.put<void>('/api/test', requestBody, config);
      "
    `);
  });

  it('compiles operations with required request bodies', () => {
    // GIVEN an OpenAPI schema that contains operations with request bodies
    // marked as required
    const document = createTestDocumentWithPaths({
      '/api/test': {
        post: {
          operationId: 'postOperation',
          requestBody: {
            content: {
              'application/json': {
                schema: {},
              },
            },
            required: true,
          },
          responses: {
            204: {
              description: 'No content.',
            },
          },
          summary: 'Endpoint under test.',
        },
        put: {
          operationId: 'putOperation',
          requestBody: {
            content: {
              'application/json': {
                schema: {},
              },
            },
            required: true,
          },
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
       * @param requestBody The HTTP request content sent to the server.
       * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
       */
      export const postOperation = async (
        requestBody: unknown,
        config?: AxiosRequestConfig,
      ) => axios.post<void>('/api/test', requestBody, config);
      /**
       * Endpoint under test.
       * @param requestBody The HTTP request content sent to the server.
       * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
       */
      export const putOperation = async (
        requestBody: unknown,
        config?: AxiosRequestConfig,
      ) => axios.put<void>('/api/test', requestBody, config);
      "
    `);
  });
});
