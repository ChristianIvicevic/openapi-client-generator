import { compileDocument } from 'generator';
import { parseYaml } from 'parser';
import { compose } from 'ramda';
import { createTestDocumentWithPaths } from 'utils/testing';

// TESTEE function
const compile = compose(compileDocument, parseYaml);

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
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const postOperation = async (
        requestBody: TestDto,
        config?: AxiosRequestConfig,
      ) => axios.post<void>('/api/test', requestBody, config);
      /**
       * Endpoint under test.
       * @param requestBody The HTTP request content sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const putOperation = async (
        requestBody: TestDto,
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
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const postOperation = async (
        requestBody: unknown,
        config?: AxiosRequestConfig,
      ) => axios.post<void>('/api/test', requestBody, config);
      /**
       * Endpoint under test.
       * @param requestBody The HTTP request content sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const putOperation = async (
        requestBody: unknown,
        config?: AxiosRequestConfig,
      ) => axios.put<void>('/api/test', requestBody, config);
      "
    `);
  });
});
