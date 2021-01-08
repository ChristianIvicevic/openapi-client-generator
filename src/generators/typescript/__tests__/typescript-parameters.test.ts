import { compileUsingTypescript } from 'generators/typescript/generator';
import type { OpenAPIV3 } from 'openapi-types';
import { parseYaml } from 'parser/parser';
import { compose } from 'ramda';
import { createTestDocument, createTestDocumentWithPaths } from 'utils/testing';

// TESTEE function
const compile = compose(compileUsingTypescript, parseYaml);

describe('Typescript Generator Parameters', () => {
  it('compiles operations with path parameter $refs at path level', () => {
    // GIVEN an OpenAPI schema that contains operations with path parameter
    // $refs at path level
    const document = createTestDocument({
      components: {
        parameters: {
          id: {
            in: 'path',
            description: 'ID of the sample to get',
            name: 'id',
            schema: {},
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

    // WHEN compiling with the typescript generator
    const { requests } = compile(document);

    // THEN the output matches the snapshot
    expect(requests).toMatchInlineSnapshot(`
      "/* eslint-disable */
      /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
      import type { AxiosRequestConfig } from 'axios';
      import axios from 'axios';
      /**
       * Endpoint under test
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const deleteSample = async (
        parameters: {
          readonly id?: unknown;
        },
        config?: AxiosRequestConfig,
      ) => axios.delete<void>(\`/api/sample/\${parameters.id}\`, config);
      /**
       * Endpoint under test
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const getSample = async (
        parameters: {
          readonly id?: unknown;
        },
        config?: AxiosRequestConfig,
      ) => axios.get<void>(\`/api/sample/\${parameters.id}\`, config);
      /**
       * Endpoint under test
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const postSample = async (
        parameters: {
          readonly id?: unknown;
        },
        config?: AxiosRequestConfig,
      ) => axios.post<void>(\`/api/sample/\${parameters.id}\`, undefined, config);
      /**
       * Endpoint under test
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const putSample = async (
        parameters: {
          readonly id?: unknown;
        },
        config?: AxiosRequestConfig,
      ) => axios.put<void>(\`/api/sample/\${parameters.id}\`, undefined, config);
      "
    `);
  });

  it('compiles operations with path parameter $refs at operation level', () => {
    // GIVEN an OpenAPI schema that contains operations with path parameter
    // $refs at operation level
    const document = createTestDocument({
      components: {
        parameters: {
          id: {
            in: 'path',
            description: 'ID of the sample to get',
            name: 'id',
            schema: {},
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

    // WHEN compiling with the typescript generator
    const { requests } = compile(document);

    // THEN the output matches the snapshot
    expect(requests).toMatchInlineSnapshot(`
      "/* eslint-disable */
      /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
      import type { AxiosRequestConfig } from 'axios';
      import axios from 'axios';
      /**
       * Endpoint under test
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const deleteSample = async (
        parameters: {
          readonly id?: unknown;
        },
        config?: AxiosRequestConfig,
      ) => axios.delete<void>(\`/api/sample/\${parameters.id}\`, config);
      /**
       * Endpoint under test
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const getSample = async (
        parameters: {
          readonly id?: unknown;
        },
        config?: AxiosRequestConfig,
      ) => axios.get<void>(\`/api/sample/\${parameters.id}\`, config);
      /**
       * Endpoint under test
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const postSample = async (
        parameters: {
          readonly id?: unknown;
        },
        config?: AxiosRequestConfig,
      ) => axios.post<void>(\`/api/sample/\${parameters.id}\`, undefined, config);
      /**
       * Endpoint under test
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const putSample = async (
        parameters: {
          readonly id?: unknown;
        },
        config?: AxiosRequestConfig,
      ) => axios.put<void>(\`/api/sample/\${parameters.id}\`, undefined, config);
      "
    `);
  });

  it('compiles operations with inline path parameters at path level', () => {
    // GIVEN an OpenAPI schema that contains operations with inline path
    // parameters at path level
    const document = createTestDocumentWithPaths({
      '/api/sample/{id}': {
        parameters: [
          {
            in: 'path',
            description: 'ID of the sample to get',
            name: 'id',
            schema: {},
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

    // WHEN compiling with the typescript generator
    const { requests } = compile(document);

    // THEN the output matches the snapshot
    expect(requests).toMatchInlineSnapshot(`
      "/* eslint-disable */
      /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
      import type { AxiosRequestConfig } from 'axios';
      import axios from 'axios';
      /**
       * Endpoint under test
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const deleteSample = async (
        parameters: {
          readonly id?: unknown;
        },
        config?: AxiosRequestConfig,
      ) => axios.delete<void>(\`/api/sample/\${parameters.id}\`, config);
      /**
       * Endpoint under test
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const getSample = async (
        parameters: {
          readonly id?: unknown;
        },
        config?: AxiosRequestConfig,
      ) => axios.get<void>(\`/api/sample/\${parameters.id}\`, config);
      /**
       * Endpoint under test
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const postSample = async (
        parameters: {
          readonly id?: unknown;
        },
        config?: AxiosRequestConfig,
      ) => axios.post<void>(\`/api/sample/\${parameters.id}\`, undefined, config);
      /**
       * Endpoint under test
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const putSample = async (
        parameters: {
          readonly id?: unknown;
        },
        config?: AxiosRequestConfig,
      ) => axios.put<void>(\`/api/sample/\${parameters.id}\`, undefined, config);
      "
    `);
  });

  it('compiles operations with inline path parameters at operation level', () => {
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
              schema: {},
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
              schema: {},
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
              schema: {},
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
              schema: {},
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

    // WHEN compiling with the typescript generator
    const { requests } = compile(document);

    // THEN the output matches the snapshot
    expect(requests).toMatchInlineSnapshot(`
      "/* eslint-disable */
      /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
      import type { AxiosRequestConfig } from 'axios';
      import axios from 'axios';
      /**
       * Endpoint under test
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const deleteSample = async (
        parameters: {
          readonly id?: unknown;
        },
        config?: AxiosRequestConfig,
      ) => axios.delete<void>(\`/api/sample/\${parameters.id}\`, config);
      /**
       * Endpoint under test
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const getSample = async (
        parameters: {
          readonly id?: unknown;
        },
        config?: AxiosRequestConfig,
      ) => axios.get<void>(\`/api/sample/\${parameters.id}\`, config);
      /**
       * Endpoint under test
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const postSample = async (
        parameters: {
          readonly id?: unknown;
        },
        config?: AxiosRequestConfig,
      ) => axios.post<void>(\`/api/sample/\${parameters.id}\`, undefined, config);
      /**
       * Endpoint under test
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const putSample = async (
        parameters: {
          readonly id?: unknown;
        },
        config?: AxiosRequestConfig,
      ) => axios.put<void>(\`/api/sample/\${parameters.id}\`, undefined, config);
      "
    `);
  });

  it('compiles operations with path and query parameters at path level', () => {
    // GIVEN an OpenAPI schema that contains operations with path and query
    // parameters at path level
    const document = createTestDocumentWithPaths({
      '/api/sample/{id}': {
        parameters: [
          {
            in: 'path',
            description: 'ID of the sample to get',
            name: 'id',
            schema: {},
          },
          {
            in: 'query',
            description: 'Name of the file',
            name: 'fileName',
            schema: {},
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

    // WHEN compiling with the typescript generator
    const { requests } = compile(document);

    // THEN the output matches the snapshot
    expect(requests).toMatchInlineSnapshot(`
      "/* eslint-disable */
      /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
      import type { AxiosRequestConfig } from 'axios';
      import axios from 'axios';
      /**
       * Endpoint under test
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const deleteSample = async (
        parameters: {
          readonly id?: unknown;
          readonly fileName?: unknown;
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
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const getSample = async (
        parameters: {
          readonly id?: unknown;
          readonly fileName?: unknown;
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
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const postSample = async (
        parameters: {
          readonly id?: unknown;
          readonly fileName?: unknown;
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
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const putSample = async (
        parameters: {
          readonly id?: unknown;
          readonly fileName?: unknown;
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

  it('compiles operations with path and query parameters at operation level', () => {
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
              schema: {},
            },
            {
              in: 'query',
              description: 'Name of the file',
              name: 'fileName',
              schema: {},
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
              schema: {},
            },
            {
              in: 'query',
              description: 'Name of the file',
              name: 'fileName',
              schema: {},
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
              schema: {},
            },
            {
              in: 'query',
              description: 'Name of the file',
              name: 'fileName',
              schema: {},
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
              schema: {},
            },
            {
              in: 'query',
              description: 'Name of the file',
              name: 'fileName',
              schema: {},
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

    // WHEN compiling with the typescript generator
    const { requests } = compile(document);

    // THEN the output matches the snapshot
    expect(requests).toMatchInlineSnapshot(`
      "/* eslint-disable */
      /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
      import type { AxiosRequestConfig } from 'axios';
      import axios from 'axios';
      /**
       * Endpoint under test
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const deleteSample = async (
        parameters: {
          readonly id?: unknown;
          readonly fileName?: unknown;
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
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const getSample = async (
        parameters: {
          readonly id?: unknown;
          readonly fileName?: unknown;
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
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const postSample = async (
        parameters: {
          readonly id?: unknown;
          readonly fileName?: unknown;
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
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const putSample = async (
        parameters: {
          readonly id?: unknown;
          readonly fileName?: unknown;
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

  // TODO: Tests for handling default values
  it('compiles operations with required flags', () => {
    // GIVEN an OpenAPI schema that contains operations with path parameters that have either required or nullable flags
    const document = createTestDocument({
      components: {
        parameters: {
          optional: {
            in: 'path',
            description: 'Parameter under test',
            name: 'optional',
            schema: {},
          },
          required: {
            in: 'path',
            description: 'Parameter under test',
            name: 'required',
            required: true,
            schema: {},
          },
        },
      },
      paths: {
        '/api/sample/{required}/{optional}': {
          parameters: [
            {
              $ref: '#/components/parameters/optional',
            },
            {
              $ref: '#/components/parameters/required',
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

    // WHEN compiling with the typescript generator
    const { requests } = compile(document);

    // THEN the output matches the snapshot
    expect(requests).toMatchInlineSnapshot(`
      "/* eslint-disable */
      /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
      import type { AxiosRequestConfig } from 'axios';
      import axios from 'axios';
      /**
       * Endpoint under test
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const deleteSample = async (
        parameters: {
          readonly optional?: unknown;
          readonly required: unknown;
        },
        config?: AxiosRequestConfig,
      ) =>
        axios.delete<void>(
          \`/api/sample/\${parameters.required}/\${parameters.optional}\`,
          config,
        );
      /**
       * Endpoint under test
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const getSample = async (
        parameters: {
          readonly optional?: unknown;
          readonly required: unknown;
        },
        config?: AxiosRequestConfig,
      ) =>
        axios.get<void>(
          \`/api/sample/\${parameters.required}/\${parameters.optional}\`,
          config,
        );
      /**
       * Endpoint under test
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const postSample = async (
        parameters: {
          readonly optional?: unknown;
          readonly required: unknown;
        },
        config?: AxiosRequestConfig,
      ) =>
        axios.post<void>(
          \`/api/sample/\${parameters.required}/\${parameters.optional}\`,
          undefined,
          config,
        );
      /**
       * Endpoint under test
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const putSample = async (
        parameters: {
          readonly optional?: unknown;
          readonly required: unknown;
        },
        config?: AxiosRequestConfig,
      ) =>
        axios.put<void>(
          \`/api/sample/\${parameters.required}/\${parameters.optional}\`,
          undefined,
          config,
        );
      "
    `);
  });
});
