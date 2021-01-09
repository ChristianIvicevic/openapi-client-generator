import { compileDocument } from 'generator';
import { parseYaml } from 'parser';
import { compose } from 'ramda';
import { createTestDocument, createTestDocumentWithPaths } from 'utils/testing';

// TESTEE function
const compile = compose(compileDocument, parseYaml);

describe('Parameters', () => {
  it('compiles operations with path parameter $refs at path level', () => {
    // GIVEN an OpenAPI schema that contains operations with path parameter
    // $refs at path level
    const document = createTestDocument({
      components: {
        parameters: {
          parameter: {
            in: 'path',
            description: 'Parameter under test.',
            name: 'parameter',
            schema: {},
          },
        },
      },
      paths: {
        '/api/test/{parameter}': {
          parameters: [
            {
              $ref: '#/components/parameters/parameter',
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
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const deleteOperation = async (
        parameters: {
          readonly parameter?: unknown;
        },
        config?: AxiosRequestConfig,
      ) => axios.delete<void>(\`/api/test/\${parameters.parameter}\`, config);
      /**
       * Endpoint under test.
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const getOperation = async (
        parameters: {
          readonly parameter?: unknown;
        },
        config?: AxiosRequestConfig,
      ) => axios.get<void>(\`/api/test/\${parameters.parameter}\`, config);
      /**
       * Endpoint under test.
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const postOperation = async (
        parameters: {
          readonly parameter?: unknown;
        },
        config?: AxiosRequestConfig,
      ) => axios.post<void>(\`/api/test/\${parameters.parameter}\`, undefined, config);
      /**
       * Endpoint under test.
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const putOperation = async (
        parameters: {
          readonly parameter?: unknown;
        },
        config?: AxiosRequestConfig,
      ) => axios.put<void>(\`/api/test/\${parameters.parameter}\`, undefined, config);
      "
    `);
  });

  it('compiles operations with path parameter $refs at operation level', () => {
    // GIVEN an OpenAPI schema that contains operations with path parameter
    // $refs at operation level
    const document = createTestDocument({
      components: {
        parameters: {
          parameter: {
            in: 'path',
            description: 'Parameter under test.',
            name: 'parameter',
            schema: {},
          },
        },
      },
      paths: {
        '/api/test/{parameter}': {
          get: {
            parameters: [
              {
                $ref: '#/components/parameters/parameter',
              },
            ],
            operationId: 'getOperation',
            responses: {
              204: {
                description: 'No content.',
              },
            },
            summary: 'Endpoint under test.',
          },
          post: {
            parameters: [
              {
                $ref: '#/components/parameters/parameter',
              },
            ],
            operationId: 'postOperation',
            responses: {
              204: {
                description: 'No content.',
              },
            },
            summary: 'Endpoint under test.',
          },
          put: {
            parameters: [
              {
                $ref: '#/components/parameters/parameter',
              },
            ],
            operationId: 'putOperation',
            responses: {
              204: {
                description: 'No content.',
              },
            },
            summary: 'Endpoint under test.',
          },
          delete: {
            parameters: [
              {
                $ref: '#/components/parameters/parameter',
              },
            ],
            operationId: 'deleteOperation',
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
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const deleteOperation = async (
        parameters: {
          readonly parameter?: unknown;
        },
        config?: AxiosRequestConfig,
      ) => axios.delete<void>(\`/api/test/\${parameters.parameter}\`, config);
      /**
       * Endpoint under test.
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const getOperation = async (
        parameters: {
          readonly parameter?: unknown;
        },
        config?: AxiosRequestConfig,
      ) => axios.get<void>(\`/api/test/\${parameters.parameter}\`, config);
      /**
       * Endpoint under test.
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const postOperation = async (
        parameters: {
          readonly parameter?: unknown;
        },
        config?: AxiosRequestConfig,
      ) => axios.post<void>(\`/api/test/\${parameters.parameter}\`, undefined, config);
      /**
       * Endpoint under test.
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const putOperation = async (
        parameters: {
          readonly parameter?: unknown;
        },
        config?: AxiosRequestConfig,
      ) => axios.put<void>(\`/api/test/\${parameters.parameter}\`, undefined, config);
      "
    `);
  });

  it('compiles operations with inline path parameters at path level', () => {
    // GIVEN an OpenAPI schema that contains operations with inline path
    // parameters at path level
    const document = createTestDocumentWithPaths({
      '/api/test/{parameter}': {
        parameters: [
          {
            in: 'path',
            description: 'Parameter under test.',
            name: 'parameter',
            schema: {},
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
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const deleteOperation = async (
        parameters: {
          readonly parameter?: unknown;
        },
        config?: AxiosRequestConfig,
      ) => axios.delete<void>(\`/api/test/\${parameters.parameter}\`, config);
      /**
       * Endpoint under test.
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const getOperation = async (
        parameters: {
          readonly parameter?: unknown;
        },
        config?: AxiosRequestConfig,
      ) => axios.get<void>(\`/api/test/\${parameters.parameter}\`, config);
      /**
       * Endpoint under test.
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const postOperation = async (
        parameters: {
          readonly parameter?: unknown;
        },
        config?: AxiosRequestConfig,
      ) => axios.post<void>(\`/api/test/\${parameters.parameter}\`, undefined, config);
      /**
       * Endpoint under test.
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const putOperation = async (
        parameters: {
          readonly parameter?: unknown;
        },
        config?: AxiosRequestConfig,
      ) => axios.put<void>(\`/api/test/\${parameters.parameter}\`, undefined, config);
      "
    `);
  });

  it('compiles operations with inline path parameters at operation level', () => {
    // GIVEN an OpenAPI schema that contains operations with inline path
    // parameters at operation level
    const document = createTestDocumentWithPaths({
      '/api/test/{parameter}': {
        get: {
          parameters: [
            {
              in: 'path',
              description: 'Parameter under test.',
              name: 'parameter',
              schema: {},
            },
          ],
          operationId: 'getOperation',
          responses: {
            204: {
              description: 'No content.',
            },
          },
          summary: 'Endpoint under test.',
        },
        post: {
          parameters: [
            {
              in: 'path',
              description: 'Parameter under test.',
              name: 'parameter',
              schema: {},
            },
          ],
          operationId: 'postOperation',
          responses: {
            204: {
              description: 'No content.',
            },
          },
          summary: 'Endpoint under test.',
        },
        put: {
          parameters: [
            {
              in: 'path',
              description: 'Parameter under test.',
              name: 'parameter',
              schema: {},
            },
          ],
          operationId: 'putOperation',
          responses: {
            204: {
              description: 'No content.',
            },
          },
          summary: 'Endpoint under test.',
        },
        delete: {
          parameters: [
            {
              in: 'path',
              description: 'Parameter under test.',
              name: 'parameter',
              schema: {},
            },
          ],
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
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const deleteOperation = async (
        parameters: {
          readonly parameter?: unknown;
        },
        config?: AxiosRequestConfig,
      ) => axios.delete<void>(\`/api/test/\${parameters.parameter}\`, config);
      /**
       * Endpoint under test.
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const getOperation = async (
        parameters: {
          readonly parameter?: unknown;
        },
        config?: AxiosRequestConfig,
      ) => axios.get<void>(\`/api/test/\${parameters.parameter}\`, config);
      /**
       * Endpoint under test.
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const postOperation = async (
        parameters: {
          readonly parameter?: unknown;
        },
        config?: AxiosRequestConfig,
      ) => axios.post<void>(\`/api/test/\${parameters.parameter}\`, undefined, config);
      /**
       * Endpoint under test.
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const putOperation = async (
        parameters: {
          readonly parameter?: unknown;
        },
        config?: AxiosRequestConfig,
      ) => axios.put<void>(\`/api/test/\${parameters.parameter}\`, undefined, config);
      "
    `);
  });

  it('compiles operations with path and query parameters at path level', () => {
    // GIVEN an OpenAPI schema that contains operations with path and query
    // parameters at path level
    const document = createTestDocumentWithPaths({
      '/api/test/{parameter}': {
        parameters: [
          {
            in: 'path',
            description: 'Parameter under test.',
            name: 'parameter',
            schema: {},
          },
          {
            in: 'query',
            description: 'Parameter under test.',
            name: 'query',
            schema: {},
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
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const deleteOperation = async (
        parameters: {
          readonly parameter?: unknown;
          readonly query?: unknown;
        },
        config?: AxiosRequestConfig,
      ) =>
        axios.delete<void>(\`/api/test/\${parameters.parameter}\`, {
          ...config,
          params: {
            query: parameters.query,
          },
        });
      /**
       * Endpoint under test.
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const getOperation = async (
        parameters: {
          readonly parameter?: unknown;
          readonly query?: unknown;
        },
        config?: AxiosRequestConfig,
      ) =>
        axios.get<void>(\`/api/test/\${parameters.parameter}\`, {
          ...config,
          params: {
            query: parameters.query,
          },
        });
      /**
       * Endpoint under test.
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const postOperation = async (
        parameters: {
          readonly parameter?: unknown;
          readonly query?: unknown;
        },
        config?: AxiosRequestConfig,
      ) =>
        axios.post<void>(\`/api/test/\${parameters.parameter}\`, undefined, {
          ...config,
          params: {
            query: parameters.query,
          },
        });
      /**
       * Endpoint under test.
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const putOperation = async (
        parameters: {
          readonly parameter?: unknown;
          readonly query?: unknown;
        },
        config?: AxiosRequestConfig,
      ) =>
        axios.put<void>(\`/api/test/\${parameters.parameter}\`, undefined, {
          ...config,
          params: {
            query: parameters.query,
          },
        });
      "
    `);
  });

  it('compiles operations with path and query parameters at operation level', () => {
    // GIVEN an OpenAPI schema that contains operations with path and query
    // parameters at operation level
    const document = createTestDocumentWithPaths({
      '/api/test/{parameter}': {
        get: {
          parameters: [
            {
              in: 'path',
              description: 'Parameter under test.',
              name: 'parameter',
              schema: {},
            },
            {
              in: 'query',
              description: 'Parameter under test.',
              name: 'query',
              schema: {},
            },
          ],
          operationId: 'getOperation',
          responses: {
            204: {
              description: 'No content.',
            },
          },
          summary: 'Endpoint under test.',
        },
        post: {
          parameters: [
            {
              in: 'path',
              description: 'Parameter under test.',
              name: 'parameter',
              schema: {},
            },
            {
              in: 'query',
              description: 'Parameter under test.',
              name: 'query',
              schema: {},
            },
          ],
          operationId: 'postOperation',
          responses: {
            204: {
              description: 'No content.',
            },
          },
          summary: 'Endpoint under test.',
        },
        put: {
          parameters: [
            {
              in: 'path',
              description: 'Parameter under test.',
              name: 'parameter',
              schema: {},
            },
            {
              in: 'query',
              description: 'Parameter under test.',
              name: 'query',
              schema: {},
            },
          ],
          operationId: 'putOperation',
          responses: {
            204: {
              description: 'No content.',
            },
          },
          summary: 'Endpoint under test.',
        },
        delete: {
          parameters: [
            {
              in: 'path',
              description: 'Parameter under test.',
              name: 'parameter',
              schema: {},
            },
            {
              in: 'query',
              description: 'Parameter under test.',
              name: 'query',
              schema: {},
            },
          ],
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
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const deleteOperation = async (
        parameters: {
          readonly parameter?: unknown;
          readonly query?: unknown;
        },
        config?: AxiosRequestConfig,
      ) =>
        axios.delete<void>(\`/api/test/\${parameters.parameter}\`, {
          ...config,
          params: {
            query: parameters.query,
          },
        });
      /**
       * Endpoint under test.
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const getOperation = async (
        parameters: {
          readonly parameter?: unknown;
          readonly query?: unknown;
        },
        config?: AxiosRequestConfig,
      ) =>
        axios.get<void>(\`/api/test/\${parameters.parameter}\`, {
          ...config,
          params: {
            query: parameters.query,
          },
        });
      /**
       * Endpoint under test.
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const postOperation = async (
        parameters: {
          readonly parameter?: unknown;
          readonly query?: unknown;
        },
        config?: AxiosRequestConfig,
      ) =>
        axios.post<void>(\`/api/test/\${parameters.parameter}\`, undefined, {
          ...config,
          params: {
            query: parameters.query,
          },
        });
      /**
       * Endpoint under test.
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const putOperation = async (
        parameters: {
          readonly parameter?: unknown;
          readonly query?: unknown;
        },
        config?: AxiosRequestConfig,
      ) =>
        axios.put<void>(\`/api/test/\${parameters.parameter}\`, undefined, {
          ...config,
          params: {
            query: parameters.query,
          },
        });
      "
    `);
  });

  // TODO: Tests for handling default values
  it('compiles operations with required flags', () => {
    // GIVEN an OpenAPI schema that contains operations with path parameters
    // that have either required or nullable flags
    const document = createTestDocument({
      components: {
        parameters: {
          optional: {
            in: 'path',
            description: 'Parameter under test.',
            name: 'optional',
            schema: {},
          },
          required: {
            in: 'path',
            description: 'Parameter under test.',
            name: 'required',
            required: true,
            schema: {},
          },
        },
      },
      paths: {
        '/api/test/{required}/{optional}': {
          parameters: [
            {
              $ref: '#/components/parameters/optional',
            },
            {
              $ref: '#/components/parameters/required',
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
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const deleteOperation = async (
        parameters: {
          readonly optional?: unknown;
          readonly required: unknown;
        },
        config?: AxiosRequestConfig,
      ) =>
        axios.delete<void>(
          \`/api/test/\${parameters.required}/\${parameters.optional}\`,
          config,
        );
      /**
       * Endpoint under test.
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const getOperation = async (
        parameters: {
          readonly optional?: unknown;
          readonly required: unknown;
        },
        config?: AxiosRequestConfig,
      ) =>
        axios.get<void>(
          \`/api/test/\${parameters.required}/\${parameters.optional}\`,
          config,
        );
      /**
       * Endpoint under test.
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const postOperation = async (
        parameters: {
          readonly optional?: unknown;
          readonly required: unknown;
        },
        config?: AxiosRequestConfig,
      ) =>
        axios.post<void>(
          \`/api/test/\${parameters.required}/\${parameters.optional}\`,
          undefined,
          config,
        );
      /**
       * Endpoint under test.
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const putOperation = async (
        parameters: {
          readonly optional?: unknown;
          readonly required: unknown;
        },
        config?: AxiosRequestConfig,
      ) =>
        axios.put<void>(
          \`/api/test/\${parameters.required}/\${parameters.optional}\`,
          undefined,
          config,
        );
      "
    `);
  });

  it('compiles operations with path parameter without schema', () => {
    // GIVEN an OpenAPI schema that contains operations with a path parameter
    // that has no schema
    const document = createTestDocument({
      components: {
        parameters: {
          parameter: {
            in: 'path',
            description: 'Parameter under test.',
            name: 'parameter',
          },
        },
      },
      paths: {
        '/api/test/{parameter}': {
          parameters: [
            {
              $ref: '#/components/parameters/parameter',
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
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const deleteOperation = async (
        parameters: {
          readonly parameter?: never;
        },
        config?: AxiosRequestConfig,
      ) => axios.delete<void>(\`/api/test/\${parameters.parameter}\`, config);
      /**
       * Endpoint under test.
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const getOperation = async (
        parameters: {
          readonly parameter?: never;
        },
        config?: AxiosRequestConfig,
      ) => axios.get<void>(\`/api/test/\${parameters.parameter}\`, config);
      /**
       * Endpoint under test.
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const postOperation = async (
        parameters: {
          readonly parameter?: never;
        },
        config?: AxiosRequestConfig,
      ) => axios.post<void>(\`/api/test/\${parameters.parameter}\`, undefined, config);
      /**
       * Endpoint under test.
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const putOperation = async (
        parameters: {
          readonly parameter?: never;
        },
        config?: AxiosRequestConfig,
      ) => axios.put<void>(\`/api/test/\${parameters.parameter}\`, undefined, config);
      "
    `);
  });
});
