import { compileUsingHandlebars } from 'generators/handlebars/generator';
import type { OpenAPIV3 } from 'openapi-types';
import { parseYaml } from 'parser/parser';
import { compose } from 'ramda';
import { createTestDocumentWithPaths } from 'utils/testing';

// TESTEE function
const compile = compose(compileUsingHandlebars, parseYaml);

// TODO: Responses with mediaType application/x-yaml

describe('Handlebars Generator Response Bodies', () => {
  describe('Operations with a request body content $ref', () => {
    it('compiles a POST operation', async () => {
      // GIVEN an OpenAPI schema that contains a single POST endpoint with a
      // request body content $ref
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
        },
      });

      // WHEN compiling with the handlebars generator
      const actualCompiledOutput = await compile(document);

      // THEN the output matches the snapshot
      expect(actualCompiledOutput).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */

        import axios, { AxiosRequestConfig } from 'axios';

        /**
         * Endpoint Summary
         * @param requestBody The payload to send with this request
         * @param config Overrides of the axios configuration for this request
         */
        export const postSample = async (
          requestBody: SampleDto,
          config?: AxiosRequestConfig,
        ) => axios.post<void>(\`/api/sample\`, requestBody, config);
        "
      `);
    });

    it('compiles a PUT operation', async () => {
      // GIVEN an OpenAPI schema that contains a single PUT endpoint with a
      // request body content $ref
      const document = createTestDocumentWithPaths({
        '/api/sample': {
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
      const actualCompiledOutput = await compile(document);

      // THEN the output matches the snapshot
      expect(actualCompiledOutput).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */

        import axios, { AxiosRequestConfig } from 'axios';

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
  });

  describe('Operations with inline request body content', () => {
    it('compiles a POST operation', async () => {
      // GIVEN an OpenAPI schema that contains a single POST endpoint with
      // inline request body content
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
        },
      });

      // WHEN compiling with the handlebars generator
      const actualCompiledOutput = await compile(document);

      // THEN the output matches the snapshot
      expect(actualCompiledOutput).toMatchInlineSnapshot(`
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
        "
      `);
    });

    it('compiles a PUT operation', async () => {
      // GIVEN an OpenAPI schema that contains a single PUT endpoint with
      // inline request body content
      const document = createTestDocumentWithPaths({
        '/api/sample': {
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
      const actualCompiledOutput = await compile(document);

      // THEN the output matches the snapshot
      expect(actualCompiledOutput).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */

        import axios, { AxiosRequestConfig } from 'axios';

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
});
