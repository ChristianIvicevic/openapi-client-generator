import { compileUsingHandlebars } from 'generators/handlebars/generator';
import type { OpenAPIV3 } from 'openapi-types';
import { parseYaml } from 'parser/parser';
import { compose } from 'ramda';
import { createTestDocument, createTestDocumentWithPaths } from 'utils/testing';

// TESTEE function
const compile = compose(compileUsingHandlebars, parseYaml);

// TODO: Handle 'required' query parameters

describe('Handlebars Generator Parameters', () => {
  describe('Operations with path parameter $refs at path level', () => {
    it('compiles a GET operation', async () => {
      // GIVEN an OpenAPI schema that contains a single GET endpoint with a
      // path parameter $ref at path level
      const document = createTestDocument({
        components: {
          parameters: {
            id: {
              in: 'path',
              description: 'ID of the sample to get',
              name: 'id',
              schema: {
                type: 'string',
              },
            },
          },
        },
        paths: {
          '/api/sample/{id}': {
            parameters: [
              {
                $ref: '#/components/parameters/id',
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

      // WHEN compiling with the handlebars generator
      const { requests } = await compile(document);

      // THEN the output matches the snapshot
      expect(requests).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */

        import axios, { AxiosRequestConfig } from 'axios';

        /**
         * Endpoint under test
         * @param parameters Parameters associated with this request
         * @param config Overrides of the axios configuration for this request
         */
        export const getSample = async (
          parameters: {
            /**
             * ID of the sample to get
             */
            id: string;
          },
          config?: AxiosRequestConfig,
        ) => axios.get<void>(\`/api/sample/\${parameters.id}\`, config);
        "
      `);
    });

    it('compiles a POST operation', async () => {
      // GIVEN an OpenAPI schema that contains a single POST endpoint with a
      // path parameter $ref at path level
      const document = createTestDocument({
        components: {
          parameters: {
            id: {
              in: 'path',
              description: 'ID of the sample to get',
              name: 'id',
              schema: {
                type: 'string',
              },
            },
          },
        },
        paths: {
          '/api/sample/{id}': {
            parameters: [
              {
                $ref: '#/components/parameters/id',
              },
            ],
            post: {
              operationId: 'postSample',
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

      // WHEN compiling with the handlebars generator
      const { requests } = await compile(document);

      // THEN the output matches the snapshot
      expect(requests).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */

        import axios, { AxiosRequestConfig } from 'axios';

        /**
         * Endpoint under test
         * @param parameters Parameters associated with this request
         * @param config Overrides of the axios configuration for this request
         */
        export const postSample = async (
          parameters: {
            /**
             * ID of the sample to get
             */
            id: string;
          },
          config?: AxiosRequestConfig,
        ) => axios.post<void>(\`/api/sample/\${parameters.id}\`, undefined, config);
        "
      `);
    });

    it('compiles a PUT operation', async () => {
      // GIVEN an OpenAPI schema that contains a single PUT endpoint with a
      // path parameter $ref at path level
      const document = createTestDocument({
        components: {
          parameters: {
            id: {
              in: 'path',
              description: 'ID of the sample to get',
              name: 'id',
              schema: {
                type: 'string',
              },
            },
          },
        },
        paths: {
          '/api/sample/{id}': {
            parameters: [
              {
                $ref: '#/components/parameters/id',
              },
            ],
            put: {
              operationId: 'putSample',
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

      // WHEN compiling with the handlebars generator
      const { requests } = await compile(document);

      // THEN the output matches the snapshot
      expect(requests).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */

        import axios, { AxiosRequestConfig } from 'axios';

        /**
         * Endpoint under test
         * @param parameters Parameters associated with this request
         * @param config Overrides of the axios configuration for this request
         */
        export const putSample = async (
          parameters: {
            /**
             * ID of the sample to get
             */
            id: string;
          },
          config?: AxiosRequestConfig,
        ) => axios.put<void>(\`/api/sample/\${parameters.id}\`, undefined, config);
        "
      `);
    });

    it('compiles a DELETE operation', async () => {
      // GIVEN an OpenAPI schema that contains a single DELETE endpoint with a
      // path parameter $ref at path level
      const document = createTestDocument({
        components: {
          parameters: {
            id: {
              in: 'path',
              description: 'ID of the sample to get',
              name: 'id',
              schema: {
                type: 'string',
              },
            },
          },
        },
        paths: {
          '/api/sample/{id}': {
            parameters: [
              {
                $ref: '#/components/parameters/id',
              },
            ],
            delete: {
              operationId: 'deleteSample',
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

      // WHEN compiling with the handlebars generator
      const { requests } = await compile(document);

      // THEN the output matches the snapshot
      expect(requests).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */

        import axios, { AxiosRequestConfig } from 'axios';

        /**
         * Endpoint under test
         * @param parameters Parameters associated with this request
         * @param config Overrides of the axios configuration for this request
         */
        export const deleteSample = async (
          parameters: {
            /**
             * ID of the sample to get
             */
            id: string;
          },
          config?: AxiosRequestConfig,
        ) => axios.delete<void>(\`/api/sample/\${parameters.id}\`, config);
        "
      `);
    });
  });

  describe('Operations with path parameter $refs at operation level', () => {
    it('compiles a GET operation', async () => {
      // GIVEN an OpenAPI schema that contains a single GET endpoint with a
      // path parameter $ref at operation level
      const document = createTestDocument({
        components: {
          parameters: {
            id: {
              in: 'path',
              description: 'ID of the sample to get',
              name: 'id',
              schema: {
                type: 'string',
              },
            },
          },
        },
        paths: {
          '/api/sample/{id}': {
            get: {
              parameters: [
                {
                  $ref: '#/components/parameters/id',
                },
              ],
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

      // WHEN compiling with the handlebars generator
      const { requests } = await compile(document);

      // THEN the output matches the snapshot
      expect(requests).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */

        import axios, { AxiosRequestConfig } from 'axios';

        /**
         * Endpoint under test
         * @param parameters Parameters associated with this request
         * @param config Overrides of the axios configuration for this request
         */
        export const getSample = async (
          parameters: {
            /**
             * ID of the sample to get
             */
            id: string;
          },
          config?: AxiosRequestConfig,
        ) => axios.get<void>(\`/api/sample/\${parameters.id}\`, config);
        "
      `);
    });

    it('compiles a POST operation', async () => {
      // GIVEN an OpenAPI schema that contains a single POST endpoint with a
      // path parameter $ref at operation level
      const document = createTestDocument({
        components: {
          parameters: {
            id: {
              in: 'path',
              description: 'ID of the sample to get',
              name: 'id',
              schema: {
                type: 'string',
              },
            },
          },
        },
        paths: {
          '/api/sample/{id}': {
            post: {
              parameters: [
                {
                  $ref: '#/components/parameters/id',
                },
              ],
              operationId: 'postSample',
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

      // WHEN compiling with the handlebars generator
      const { requests } = await compile(document);

      // THEN the output matches the snapshot
      expect(requests).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */

        import axios, { AxiosRequestConfig } from 'axios';

        /**
         * Endpoint under test
         * @param parameters Parameters associated with this request
         * @param config Overrides of the axios configuration for this request
         */
        export const postSample = async (
          parameters: {
            /**
             * ID of the sample to get
             */
            id: string;
          },
          config?: AxiosRequestConfig,
        ) => axios.post<void>(\`/api/sample/\${parameters.id}\`, undefined, config);
        "
      `);
    });

    it('compiles a PUT operation', async () => {
      // GIVEN an OpenAPI schema that contains a single PUT endpoint with a
      // path parameter $ref at operation level
      const document = createTestDocument({
        components: {
          parameters: {
            id: {
              in: 'path',
              description: 'ID of the sample to get',
              name: 'id',
              schema: {
                type: 'string',
              },
            },
          },
        },
        paths: {
          '/api/sample/{id}': {
            put: {
              parameters: [
                {
                  $ref: '#/components/parameters/id',
                },
              ],
              operationId: 'putSample',
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

      // WHEN compiling with the handlebars generator
      const { requests } = await compile(document);

      // THEN the output matches the snapshot
      expect(requests).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */

        import axios, { AxiosRequestConfig } from 'axios';

        /**
         * Endpoint under test
         * @param parameters Parameters associated with this request
         * @param config Overrides of the axios configuration for this request
         */
        export const putSample = async (
          parameters: {
            /**
             * ID of the sample to get
             */
            id: string;
          },
          config?: AxiosRequestConfig,
        ) => axios.put<void>(\`/api/sample/\${parameters.id}\`, undefined, config);
        "
      `);
    });

    it('compiles a DELETE operation', async () => {
      // GIVEN an OpenAPI schema that contains a single DELETE endpoint with a
      // path parameter $ref at operation level
      const document = createTestDocument({
        components: {
          parameters: {
            id: {
              in: 'path',
              description: 'ID of the sample to get',
              name: 'id',
              schema: {
                type: 'string',
              },
            },
          },
        },
        paths: {
          '/api/sample/{id}': {
            delete: {
              parameters: [
                {
                  $ref: '#/components/parameters/id',
                },
              ],
              operationId: 'deleteSample',
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

      // WHEN compiling with the handlebars generator
      const { requests } = await compile(document);

      // THEN the output matches the snapshot
      expect(requests).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */

        import axios, { AxiosRequestConfig } from 'axios';

        /**
         * Endpoint under test
         * @param parameters Parameters associated with this request
         * @param config Overrides of the axios configuration for this request
         */
        export const deleteSample = async (
          parameters: {
            /**
             * ID of the sample to get
             */
            id: string;
          },
          config?: AxiosRequestConfig,
        ) => axios.delete<void>(\`/api/sample/\${parameters.id}\`, config);
        "
      `);
    });
  });

  describe('Operations with inline path parameters at path level', () => {
    it('compiles a GET operation', async () => {
      // GIVEN an OpenAPI schema that contains a single GET endpoint with an
      // inline path parameter at path level
      const document = createTestDocumentWithPaths({
        '/api/sample/{id}': {
          parameters: [
            {
              in: 'path',
              description: 'ID of the sample to get',
              name: 'id',
              schema: {
                type: 'string',
              },
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

      // WHEN compiling with the handlebars generator
      const { requests } = await compile(document);

      // THEN the output matches the snapshot
      expect(requests).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */

        import axios, { AxiosRequestConfig } from 'axios';

        /**
         * Endpoint under test
         * @param parameters Parameters associated with this request
         * @param config Overrides of the axios configuration for this request
         */
        export const getSample = async (
          parameters: {
            /**
             * ID of the sample to get
             */
            id: string;
          },
          config?: AxiosRequestConfig,
        ) => axios.get<void>(\`/api/sample/\${parameters.id}\`, config);
        "
      `);
    });

    it('compiles a POST operation', async () => {
      // GIVEN an OpenAPI schema that contains a single POST endpoint with an
      // inline path parameter at path level
      const document = createTestDocumentWithPaths({
        '/api/sample/{id}': {
          parameters: [
            {
              in: 'path',
              description: 'ID of the sample to get',
              name: 'id',
              schema: {
                type: 'string',
              },
            },
          ],
          post: {
            operationId: 'postSample',
            responses: {
              204: {
                description: 'No content',
              },
            },
            summary: 'Endpoint under test',
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
         * Endpoint under test
         * @param parameters Parameters associated with this request
         * @param config Overrides of the axios configuration for this request
         */
        export const postSample = async (
          parameters: {
            /**
             * ID of the sample to get
             */
            id: string;
          },
          config?: AxiosRequestConfig,
        ) => axios.post<void>(\`/api/sample/\${parameters.id}\`, undefined, config);
        "
      `);
    });

    it('compiles a PUT operation', async () => {
      // GIVEN an OpenAPI schema that contains a single PUT endpoint with an
      // inline path parameter at path level
      const document = createTestDocumentWithPaths({
        '/api/sample/{id}': {
          parameters: [
            {
              in: 'path',
              description: 'ID of the sample to get',
              name: 'id',
              schema: {
                type: 'string',
              },
            },
          ],
          put: {
            operationId: 'putSample',
            responses: {
              204: {
                description: 'No content',
              },
            },
            summary: 'Endpoint under test',
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
         * Endpoint under test
         * @param parameters Parameters associated with this request
         * @param config Overrides of the axios configuration for this request
         */
        export const putSample = async (
          parameters: {
            /**
             * ID of the sample to get
             */
            id: string;
          },
          config?: AxiosRequestConfig,
        ) => axios.put<void>(\`/api/sample/\${parameters.id}\`, undefined, config);
        "
      `);
    });

    it('compiles a DELETE operation', async () => {
      // GIVEN an OpenAPI schema that contains a single DELETE endpoint with an
      // inline path parameter at path level
      const document = createTestDocumentWithPaths({
        '/api/sample/{id}': {
          parameters: [
            {
              in: 'path',
              description: 'ID of the sample to get',
              name: 'id',
              schema: {
                type: 'string',
              },
            },
          ],
          delete: {
            operationId: 'deleteSample',
            responses: {
              204: {
                description: 'No content',
              },
            },
            summary: 'Endpoint under test',
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
         * Endpoint under test
         * @param parameters Parameters associated with this request
         * @param config Overrides of the axios configuration for this request
         */
        export const deleteSample = async (
          parameters: {
            /**
             * ID of the sample to get
             */
            id: string;
          },
          config?: AxiosRequestConfig,
        ) => axios.delete<void>(\`/api/sample/\${parameters.id}\`, config);
        "
      `);
    });
  });

  describe('Operations with inline path parameters at operation level', () => {
    it('compiles a GET operation', async () => {
      // GIVEN an OpenAPI schema that contains a single GET endpoint with an
      // inline path parameter at operation level
      const document = createTestDocumentWithPaths({
        '/api/sample/{id}': {
          get: {
            parameters: [
              {
                in: 'path',
                description: 'ID of the sample to get',
                name: 'id',
                schema: {
                  type: 'string',
                },
              },
            ],
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

      // WHEN compiling with the handlebars generator
      const { requests } = await compile(document);

      // THEN the output matches the snapshot
      expect(requests).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */

        import axios, { AxiosRequestConfig } from 'axios';

        /**
         * Endpoint under test
         * @param parameters Parameters associated with this request
         * @param config Overrides of the axios configuration for this request
         */
        export const getSample = async (
          parameters: {
            /**
             * ID of the sample to get
             */
            id: string;
          },
          config?: AxiosRequestConfig,
        ) => axios.get<void>(\`/api/sample/\${parameters.id}\`, config);
        "
      `);
    });

    it('compiles a POST operation', async () => {
      // GIVEN an OpenAPI schema that contains a single POST endpoint with an
      // inline path parameter at operation level
      const document = createTestDocumentWithPaths({
        '/api/sample/{id}': {
          post: {
            parameters: [
              {
                in: 'path',
                description: 'ID of the sample to get',
                name: 'id',
                schema: {
                  type: 'string',
                },
              },
            ],
            operationId: 'postSample',
            responses: {
              204: {
                description: 'No content',
              },
            },
            summary: 'Endpoint under test',
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
         * Endpoint under test
         * @param parameters Parameters associated with this request
         * @param config Overrides of the axios configuration for this request
         */
        export const postSample = async (
          parameters: {
            /**
             * ID of the sample to get
             */
            id: string;
          },
          config?: AxiosRequestConfig,
        ) => axios.post<void>(\`/api/sample/\${parameters.id}\`, undefined, config);
        "
      `);
    });

    it('compiles a PUT operation', async () => {
      // GIVEN an OpenAPI schema that contains a single PUT endpoint with an
      // inline path parameter at operation level
      const document = createTestDocumentWithPaths({
        '/api/sample/{id}': {
          put: {
            parameters: [
              {
                in: 'path',
                description: 'ID of the sample to get',
                name: 'id',
                schema: {
                  type: 'string',
                },
              },
            ],
            operationId: 'putSample',
            responses: {
              204: {
                description: 'No content',
              },
            },
            summary: 'Endpoint under test',
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
         * Endpoint under test
         * @param parameters Parameters associated with this request
         * @param config Overrides of the axios configuration for this request
         */
        export const putSample = async (
          parameters: {
            /**
             * ID of the sample to get
             */
            id: string;
          },
          config?: AxiosRequestConfig,
        ) => axios.put<void>(\`/api/sample/\${parameters.id}\`, undefined, config);
        "
      `);
    });

    it('compiles a DELETE operation', async () => {
      // GIVEN an OpenAPI schema that contains a single DELETE endpoint with an
      // inline path parameter at operation level
      const document = createTestDocumentWithPaths({
        '/api/sample/{id}': {
          delete: {
            parameters: [
              {
                in: 'path',
                description: 'ID of the sample to get',
                name: 'id',
                schema: {
                  type: 'string',
                },
              },
            ],
            operationId: 'deleteSample',
            responses: {
              204: {
                description: 'No content',
              },
            },
            summary: 'Endpoint under test',
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
         * Endpoint under test
         * @param parameters Parameters associated with this request
         * @param config Overrides of the axios configuration for this request
         */
        export const deleteSample = async (
          parameters: {
            /**
             * ID of the sample to get
             */
            id: string;
          },
          config?: AxiosRequestConfig,
        ) => axios.delete<void>(\`/api/sample/\${parameters.id}\`, config);
        "
      `);
    });
  });

  describe('Operations with path and query parameters at path level', () => {
    it('compiles a GET operation', async () => {
      // GIVEN an OpenAPI schema that contains a single GET endpoint with a
      // path and query parameter at path level
      const document = createTestDocumentWithPaths({
        '/api/sample/{id}': {
          parameters: [
            {
              in: 'path',
              description: 'ID of the sample to get',
              name: 'id',
              schema: {
                type: 'string',
              },
            },
            {
              in: 'query',
              description: 'Name of the file',
              name: 'fileName',
              schema: {
                type: 'string',
              },
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

      // WHEN compiling with the handlebars generator
      const { requests } = await compile(document);

      // THEN the output matches the snapshot
      expect(requests).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */

        import axios, { AxiosRequestConfig } from 'axios';

        /**
         * Endpoint under test
         * @param parameters Parameters associated with this request
         * @param config Overrides of the axios configuration for this request
         */
        export const getSample = async (
          parameters: {
            /**
             * ID of the sample to get
             */
            id: string;
            /**
             * Name of the file
             */
            fileName: string;
          },
          config?: AxiosRequestConfig,
        ) =>
          axios.get<void>(\`/api/sample/\${parameters.id}\`, {
            ...config,
            params: {
              fileName: parameters.fileName,
            },
          });
        "
      `);
    });

    it('compiles a POST operation', async () => {
      // GIVEN an OpenAPI schema that contains a single POST endpoint with a
      // path and query parameter at path level
      const document = createTestDocumentWithPaths({
        '/api/sample/{id}': {
          parameters: [
            {
              in: 'path',
              description: 'ID of the sample to get',
              name: 'id',
              schema: {
                type: 'string',
              },
            },
            {
              in: 'query',
              description: 'Name of the file',
              name: 'fileName',
              schema: {
                type: 'string',
              },
            },
          ],
          post: {
            operationId: 'postSample',
            responses: {
              204: {
                description: 'No content',
              },
            },
            summary: 'Endpoint under test',
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
         * Endpoint under test
         * @param parameters Parameters associated with this request
         * @param config Overrides of the axios configuration for this request
         */
        export const postSample = async (
          parameters: {
            /**
             * ID of the sample to get
             */
            id: string;
            /**
             * Name of the file
             */
            fileName: string;
          },
          config?: AxiosRequestConfig,
        ) =>
          axios.post<void>(\`/api/sample/\${parameters.id}\`, undefined, {
            ...config,
            params: {
              fileName: parameters.fileName,
            },
          });
        "
      `);
    });

    it('compiles a PUT operation', async () => {
      // GIVEN an OpenAPI schema that contains a single PUT endpoint with a
      // path and query parameter at path level
      const document = createTestDocumentWithPaths({
        '/api/sample/{id}': {
          parameters: [
            {
              in: 'path',
              description: 'ID of the sample to get',
              name: 'id',
              schema: {
                type: 'string',
              },
            },
            {
              in: 'query',
              description: 'Name of the file',
              name: 'fileName',
              schema: {
                type: 'string',
              },
            },
          ],
          put: {
            operationId: 'putSample',
            responses: {
              204: {
                description: 'No content',
              },
            },
            summary: 'Endpoint under test',
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
         * Endpoint under test
         * @param parameters Parameters associated with this request
         * @param config Overrides of the axios configuration for this request
         */
        export const putSample = async (
          parameters: {
            /**
             * ID of the sample to get
             */
            id: string;
            /**
             * Name of the file
             */
            fileName: string;
          },
          config?: AxiosRequestConfig,
        ) =>
          axios.put<void>(\`/api/sample/\${parameters.id}\`, undefined, {
            ...config,
            params: {
              fileName: parameters.fileName,
            },
          });
        "
      `);
    });

    it('compiles a DELETE operation', async () => {
      // GIVEN an OpenAPI schema that contains a single DELETE endpoint with a
      // path and query parameter at path level
      const document = createTestDocumentWithPaths({
        '/api/sample/{id}': {
          parameters: [
            {
              in: 'path',
              description: 'ID of the sample to get',
              name: 'id',
              schema: {
                type: 'string',
              },
            },
            {
              in: 'query',
              description: 'Name of the file',
              name: 'fileName',
              schema: {
                type: 'string',
              },
            },
          ],
          delete: {
            operationId: 'deleteSample',
            responses: {
              204: {
                description: 'No content',
              },
            },
            summary: 'Endpoint under test',
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
         * Endpoint under test
         * @param parameters Parameters associated with this request
         * @param config Overrides of the axios configuration for this request
         */
        export const deleteSample = async (
          parameters: {
            /**
             * ID of the sample to get
             */
            id: string;
            /**
             * Name of the file
             */
            fileName: string;
          },
          config?: AxiosRequestConfig,
        ) =>
          axios.delete<void>(\`/api/sample/\${parameters.id}\`, {
            ...config,
            params: {
              fileName: parameters.fileName,
            },
          });
        "
      `);
    });
  });

  describe('Operations with path and query parameters at operation level', () => {
    it('compiles a GET operation', async () => {
      // GIVEN an OpenAPI schema that contains a single GET endpoint with a
      // path and query parameter at operation level
      const document = createTestDocumentWithPaths({
        '/api/sample/{id}': {
          get: {
            parameters: [
              {
                in: 'path',
                description: 'ID of the sample to get',
                name: 'id',
                schema: {
                  type: 'string',
                },
              },
              {
                in: 'query',
                description: 'Name of the file',
                name: 'fileName',
                schema: {
                  type: 'string',
                },
              },
            ],
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

      // WHEN compiling with the handlebars generator
      const { requests } = await compile(document);

      // THEN the output matches the snapshot
      expect(requests).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */

        import axios, { AxiosRequestConfig } from 'axios';

        /**
         * Endpoint under test
         * @param parameters Parameters associated with this request
         * @param config Overrides of the axios configuration for this request
         */
        export const getSample = async (
          parameters: {
            /**
             * ID of the sample to get
             */
            id: string;
            /**
             * Name of the file
             */
            fileName: string;
          },
          config?: AxiosRequestConfig,
        ) =>
          axios.get<void>(\`/api/sample/\${parameters.id}\`, {
            ...config,
            params: {
              fileName: parameters.fileName,
            },
          });
        "
      `);
    });

    it('compiles a POST operation', async () => {
      // GIVEN an OpenAPI schema that contains a single POST endpoint with a
      // path and query parameter at operation level
      const document = createTestDocumentWithPaths({
        '/api/sample/{id}': {
          post: {
            parameters: [
              {
                in: 'path',
                description: 'ID of the sample to get',
                name: 'id',
                schema: {
                  type: 'string',
                },
              },
              {
                in: 'query',
                description: 'Name of the file',
                name: 'fileName',
                schema: {
                  type: 'string',
                },
              },
            ],
            operationId: 'postSample',
            responses: {
              204: {
                description: 'No content',
              },
            },
            summary: 'Endpoint under test',
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
         * Endpoint under test
         * @param parameters Parameters associated with this request
         * @param config Overrides of the axios configuration for this request
         */
        export const postSample = async (
          parameters: {
            /**
             * ID of the sample to get
             */
            id: string;
            /**
             * Name of the file
             */
            fileName: string;
          },
          config?: AxiosRequestConfig,
        ) =>
          axios.post<void>(\`/api/sample/\${parameters.id}\`, undefined, {
            ...config,
            params: {
              fileName: parameters.fileName,
            },
          });
        "
      `);
    });

    it('compiles a PUT operation', async () => {
      // GIVEN an OpenAPI schema that contains a single PUT endpoint with a
      // path and query parameter at operation level
      const document = createTestDocumentWithPaths({
        '/api/sample/{id}': {
          put: {
            parameters: [
              {
                in: 'path',
                description: 'ID of the sample to get',
                name: 'id',
                schema: {
                  type: 'string',
                },
              },
              {
                in: 'query',
                description: 'Name of the file',
                name: 'fileName',
                schema: {
                  type: 'string',
                },
              },
            ],
            operationId: 'putSample',
            responses: {
              204: {
                description: 'No content',
              },
            },
            summary: 'Endpoint under test',
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
         * Endpoint under test
         * @param parameters Parameters associated with this request
         * @param config Overrides of the axios configuration for this request
         */
        export const putSample = async (
          parameters: {
            /**
             * ID of the sample to get
             */
            id: string;
            /**
             * Name of the file
             */
            fileName: string;
          },
          config?: AxiosRequestConfig,
        ) =>
          axios.put<void>(\`/api/sample/\${parameters.id}\`, undefined, {
            ...config,
            params: {
              fileName: parameters.fileName,
            },
          });
        "
      `);
    });

    it('compiles a DELETE operation', async () => {
      // GIVEN an OpenAPI schema that contains a single DELETE endpoint with a
      // path and query parameter at operation level
      const document = createTestDocumentWithPaths({
        '/api/sample/{id}': {
          delete: {
            parameters: [
              {
                in: 'path',
                description: 'ID of the sample to get',
                name: 'id',
                schema: {
                  type: 'string',
                },
              },
              {
                in: 'query',
                description: 'Name of the file',
                name: 'fileName',
                schema: {
                  type: 'string',
                },
              },
            ],
            operationId: 'deleteSample',
            responses: {
              204: {
                description: 'No content',
              },
            },
            summary: 'Endpoint under test',
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
         * Endpoint under test
         * @param parameters Parameters associated with this request
         * @param config Overrides of the axios configuration for this request
         */
        export const deleteSample = async (
          parameters: {
            /**
             * ID of the sample to get
             */
            id: string;
            /**
             * Name of the file
             */
            fileName: string;
          },
          config?: AxiosRequestConfig,
        ) =>
          axios.delete<void>(\`/api/sample/\${parameters.id}\`, {
            ...config,
            params: {
              fileName: parameters.fileName,
            },
          });
        "
      `);
    });
  });
});
