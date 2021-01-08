import { compileDocument } from 'generator/generator';
import type { OpenAPIV3 } from 'openapi-types';
import { parseYaml } from 'parser/parser';
import { compose } from 'ramda';
import { createTestDocumentWithPaths } from 'utils/testing';

// TESTEE function
const compile = compose(compileDocument, parseYaml);

// TODO: Responses with mediaType application/x-yaml

describe('Typescript Generator Response Bodies', () => {
  it('compiles operations with a request body content $ref', () => {
    // GIVEN an OpenAPI schema that contains operations with a request body
    // content $ref
    const document = createTestDocumentWithPaths({
      '/api/sample': {
        post: {
          operationId: 'postSample',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SampleDto',
                },
              },
            },
          },
          responses: {
            204: {
              description: 'No content',
            },
          },
          summary: 'Endpoint Summary',
        } as OpenAPIV3.OperationObject,
        put: {
          operationId: 'putSample',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SampleDto',
                },
              },
            },
          },
          responses: {
            204: {
              description: 'No content',
            },
          },
          summary: 'Endpoint Summary',
        } as OpenAPIV3.OperationObject,
      },
    });

    // WHEN compiling with the typescript generator
    const { requests } = compile(document);

    // THEN the output matches the snapshot
    expect(requests).toMatchInlineSnapshot(`
      "/* eslint-disable */
      /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
      import type { AxiosRequestConfig } from 'axios';
      import axios from 'axios';
      import type { SampleDto } from './schemas';
      /**
       * Endpoint Summary
       * @param requestBody The HTTP request content sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const postSample = async (
        requestBody: SampleDto,
        config?: AxiosRequestConfig,
      ) => axios.post<void>('/api/sample', requestBody, config);
      /**
       * Endpoint Summary
       * @param requestBody The HTTP request content sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const putSample = async (
        requestBody: SampleDto,
        config?: AxiosRequestConfig,
      ) => axios.put<void>('/api/sample', requestBody, config);
      "
    `);
  });

  it('compiles operations with inline request body content', () => {
    // GIVEN an OpenAPI schema that contains operations with inline request
    // body content
    const document = createTestDocumentWithPaths({
      '/api/sample': {
        post: {
          operationId: 'postSample',
          requestBody: {
            content: {
              'application/json': {
                schema: {},
              },
            },
          },
          responses: {
            204: {
              description: 'No content',
            },
          },
          summary: 'Endpoint Summary',
        } as OpenAPIV3.OperationObject,
        put: {
          operationId: 'putSample',
          requestBody: {
            content: {
              'application/json': {
                schema: {},
              },
            },
          },
          responses: {
            204: {
              description: 'No content',
            },
          },
          summary: 'Endpoint Summary',
        } as OpenAPIV3.OperationObject,
      },
    });

    // WHEN compiling with the typescript generator
    const { requests } = compile(document);

    // THEN the output matches the snapshot
    expect(requests).toMatchInlineSnapshot(`
      "/* eslint-disable */
      /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
      import type { AxiosRequestConfig } from 'axios';
      import axios from 'axios';
      /**
       * Endpoint Summary
       * @param requestBody The HTTP request content sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const postSample = async (
        requestBody: unknown,
        config?: AxiosRequestConfig,
      ) => axios.post<void>('/api/sample', requestBody, config);
      /**
       * Endpoint Summary
       * @param requestBody The HTTP request content sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const putSample = async (
        requestBody: unknown,
        config?: AxiosRequestConfig,
      ) => axios.put<void>('/api/sample', requestBody, config);
      "
    `);
  });
});
