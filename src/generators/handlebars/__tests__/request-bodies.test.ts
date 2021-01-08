import { compileUsingHandlebars } from 'generators/handlebars/generator';
import type { OpenAPIV3 } from 'openapi-types';
import { parseYamlToDocumentInfo } from 'parser/parser';
import { compose } from 'ramda';
import { createTestDocumentWithPaths } from 'utils/testing';

// TESTEE function
const compile = compose(compileUsingHandlebars, parseYamlToDocumentInfo);

// TODO: Responses with mediaType application/x-yaml

describe('Handlebars Generator Response Bodies', () => {
  it('compiles operations with a request body content $ref', async () => {
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

    // WHEN compiling with the handlebars generator
    const { requests } = await compile(document);

    // THEN the output matches the snapshot
    expect(requests).toMatchInlineSnapshot(`
      "/* eslint-disable */
      /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */

      import axios, { AxiosRequestConfig } from 'axios';
      import type { SampleDto } from './schemas';

      /**
       * Endpoint Summary
       * @param requestBody The payload to send with this request
       * @param config Overrides of the axios configuration for this request
       */
      export const postSample = async (
        requestBody: SampleDto,
        config?: AxiosRequestConfig,
      ) => axios.post<void>(\`/api/sample\`, requestBody, config);

      /**
       * Endpoint Summary
       * @param requestBody The payload to send with this request
       * @param config Overrides of the axios configuration for this request
       */
      export const putSample = async (
        requestBody: SampleDto,
        config?: AxiosRequestConfig,
      ) => axios.put<void>(\`/api/sample\`, requestBody, config);
      "
    `);
  });

  it('compiles operations with inline request body content', async () => {
    // GIVEN an OpenAPI schema that contains operations with inline request
    // body content
    const document = createTestDocumentWithPaths({
      '/api/sample': {
        post: {
          operationId: 'postSample',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'string',
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
                  type: 'string',
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

    // WHEN compiling with the handlebars generator
    const { requests } = await compile(document);

    // THEN the output matches the snapshot
    expect(requests).toMatchInlineSnapshot(`
      "/* eslint-disable */
      /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */

      import axios, { AxiosRequestConfig } from 'axios';

      /**
       * Endpoint Summary
       * @param requestBody The payload to send with this request
       * @param config Overrides of the axios configuration for this request
       */
      export const postSample = async (
        requestBody: string,
        config?: AxiosRequestConfig,
      ) => axios.post<void>(\`/api/sample\`, requestBody, config);

      /**
       * Endpoint Summary
       * @param requestBody The payload to send with this request
       * @param config Overrides of the axios configuration for this request
       */
      export const putSample = async (
        requestBody: string,
        config?: AxiosRequestConfig,
      ) => axios.put<void>(\`/api/sample\`, requestBody, config);
      "
    `);
  });
});
