import { compileUsingHandlebars } from 'generators/handlebars/generator';
import type { OpenAPIV3 } from 'openapi-types';
import { parseYaml } from 'parser/parser';
import { compose } from 'ramda';
import { createTestDocument, createTestDocumentWithPaths } from 'utils/testing';

// TESTEE function
const compile = compose(compileUsingHandlebars, parseYaml);

// TODO: Handle 'required' query parameters

describe('Handlebars Generator Parameters', () => {
  it('compiles operations with path parameter $refs at path level', async () => {
    // GIVEN an OpenAPI schema that contains operations with path parameter
    // $refs at path level
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
          post: {
            operationId: 'postSample',
            responses: {
              204: {
                description: 'No content',
              },
            },
            summary: 'Endpoint under test',
          } as OpenAPIV3.OperationObject,
          put: {
            operationId: 'putSample',
            responses: {
              204: {
                description: 'No content',
              },
            },
            summary: 'Endpoint under test',
          } as OpenAPIV3.OperationObject,
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

  it('compiles operations with path parameter $refs at operation level', async () => {
    // GIVEN an OpenAPI schema that contains operations with path parameter
    // $refs at operation level
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

  it('compiles operations with inline path parameters at path level', async () => {
    // GIVEN an OpenAPI schema that contains operations with inline path
    // parameters at path level
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
        post: {
          operationId: 'postSample',
          responses: {
            204: {
              description: 'No content',
            },
          },
          summary: 'Endpoint under test',
        } as OpenAPIV3.OperationObject,
        put: {
          operationId: 'putSample',
          responses: {
            204: {
              description: 'No content',
            },
          },
          summary: 'Endpoint under test',
        } as OpenAPIV3.OperationObject,
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

  it('compiles operations with inline path parameters at operation level', async () => {
    // GIVEN an OpenAPI schema that contains operations with inline path
    // parameters at operation level
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

  it('compiles operations with path and query parameters at path level', async () => {
    // GIVEN an OpenAPI schema that contains operations with path and query
    // parameters at path level
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
        post: {
          operationId: 'postSample',
          responses: {
            204: {
              description: 'No content',
            },
          },
          summary: 'Endpoint under test',
        } as OpenAPIV3.OperationObject,
        put: {
          operationId: 'putSample',
          responses: {
            204: {
              description: 'No content',
            },
          },
          summary: 'Endpoint under test',
        } as OpenAPIV3.OperationObject,
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

  it('compiles operations with path and query parameters at operation level', async () => {
    // GIVEN an OpenAPI schema that contains operations with path and query
    // parameters at operation level
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
});
