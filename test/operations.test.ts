import { generateSourceFilesOrThrow } from 'index';
import type { OpenAPIV3_1 } from 'openapi-types';
import { createDocument } from 'utils/testing';

describe('Operations', () => {
  describe('Responses', () => {
    it('compiles operations with empty responses', () => {
      const document = createDocument({
        paths: {
          '/api/test': {
            get: {
              operationId: 'getOperation',
              responses: {
                200: {
                  description: 'OK',
                },
              },
              summary: 'Endpoint under test.',
            },
            post: {
              operationId: 'postOperation',
              responses: {
                200: {
                  description: 'OK',
                },
              },
              summary: 'Endpoint under test.',
            },
            put: {
              operationId: 'putOperation',
              responses: {
                200: {
                  description: 'OK',
                },
              },
              summary: 'Endpoint under test.',
            },
            delete: {
              operationId: 'deleteOperation',
              responses: {
                200: {
                  description: 'OK',
                },
              },
              summary: 'Endpoint under test.',
            },
          },
        },
      });

      const { operationsFileContent } = generateSourceFilesOrThrow(
        JSON.stringify(document),
      );

      expect(operationsFileContent).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
        import type { AxiosRequestConfig } from 'axios';
        import axios from 'axios';
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
        /**
         * Endpoint under test.
         * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
         */
        export const deleteOperation = async (config?: AxiosRequestConfig) =>
          axios.delete<void>('/api/test', config);
        "
      `);
    });

    it('compiles operations with a response content schema $ref', () => {
      const document = createDocument({
        paths: {
          '/api/test': {
            get: {
              operationId: 'getOperation',
              responses: {
                200: {
                  description: 'OK',
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/TestDto',
                      } as OpenAPIV3_1.ReferenceObject,
                    },
                  },
                },
              },
              summary: 'Endpoint under test.',
            },
            post: {
              operationId: 'postOperation',
              responses: {
                200: {
                  description: 'OK',
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/TestDto',
                      } as OpenAPIV3_1.ReferenceObject,
                    },
                  },
                },
              },
              summary: 'Endpoint under test.',
            },
          },
        },
        schemas: {
          TestDto: {},
        },
      });

      const { operationsFileContent } = generateSourceFilesOrThrow(
        JSON.stringify(document),
      );

      expect(operationsFileContent).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
        import type { AxiosRequestConfig } from 'axios';
        import axios from 'axios';
        import type { TestDto } from './schemas';
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
        "
      `);
    });

    it('compiles operations with a response $ref array', () => {
      const document = createDocument({
        paths: {
          '/api/test': {
            get: {
              operationId: 'getOperation',
              responses: {
                200: {
                  description: 'OK',
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
                200: {
                  description: 'OK',
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
        },
        schemas: {
          TestDto: {},
        },
      });

      const { operationsFileContent } = generateSourceFilesOrThrow(
        JSON.stringify(document),
      );

      expect(operationsFileContent).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
        import type { AxiosRequestConfig } from 'axios';
        import axios from 'axios';
        import type { TestDto } from './schemas';
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
        "
      `);
    });

    it('compiles operations with an inline response array', () => {
      const document = createDocument({
        paths: {
          '/api/test': {
            get: {
              operationId: 'getOperation',
              responses: {
                200: {
                  description: 'OK',
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
                200: {
                  description: 'OK',
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
        },
      });

      const { operationsFileContent } = generateSourceFilesOrThrow(
        JSON.stringify(document),
      );

      expect(operationsFileContent).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
        import type { AxiosRequestConfig } from 'axios';
        import axios from 'axios';
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
        "
      `);
    });

    it('compiles operations with a response object that is a $ref', () => {
      const document = createDocument({
        responses: {
          TestResponse: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {},
              },
            },
          },
        },
        paths: {
          '/api/test': {
            get: {
              operationId: 'getOperation',
              responses: {
                200: {
                  $ref: '#/components/responses/TestResponse',
                },
              },
              summary: 'Endpoint under test.',
            },
            post: {
              operationId: 'postOperation',
              responses: {
                200: {
                  $ref: '#/components/responses/TestResponse',
                },
              },
              summary: 'Endpoint under test.',
            },
          },
        },
      });

      const { operationsFileContent } = generateSourceFilesOrThrow(
        JSON.stringify(document),
      );

      expect(operationsFileContent).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
        import type { AxiosRequestConfig } from 'axios';
        import axios from 'axios';
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
        "
      `);
    });
  });

  describe('Request Bodies', () => {
    it('compiles operations with a request body content $ref', () => {
      const document = createDocument({
        paths: {
          '/api/test': {
            post: {
              operationId: 'postOperation',
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/TestDto',
                    } as OpenAPIV3_1.ReferenceObject,
                  },
                },
              },
              responses: {
                200: {
                  description: 'OK',
                },
              },
              summary: 'Endpoint under test.',
            },
          },
        },
        schemas: {
          TestDto: {},
        },
      });

      const { operationsFileContent } = generateSourceFilesOrThrow(
        JSON.stringify(document),
      );

      expect(operationsFileContent).toMatchInlineSnapshot(`
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
          requestBody?: TestDto,
          config?: AxiosRequestConfig,
        ) => axios.post<void>('/api/test', requestBody, config);
        "
      `);
    });

    it('compiles operations with inline request body content', () => {
      const document = createDocument({
        paths: {
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
                200: {
                  description: 'OK',
                },
              },
              summary: 'Endpoint under test.',
            },
          },
        },
      });

      const { operationsFileContent } = generateSourceFilesOrThrow(
        JSON.stringify(document),
      );

      expect(operationsFileContent).toMatchInlineSnapshot(`
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
          requestBody?: unknown,
          config?: AxiosRequestConfig,
        ) => axios.post<void>('/api/test', requestBody, config);
        "
      `);
    });

    it('compiles operations with request bodies that are $refs', () => {
      const document = createDocument({
        requestBodies: {
          TestRequestBody: {
            content: {
              'application/json': {
                schema: {},
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
                200: {
                  description: 'OK',
                },
              },
              summary: 'Endpoint under test.',
            },
          },
        },
      });

      const { operationsFileContent } = generateSourceFilesOrThrow(
        JSON.stringify(document),
      );

      expect(operationsFileContent).toMatchInlineSnapshot(`
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
          requestBody?: unknown,
          config?: AxiosRequestConfig,
        ) => axios.post<void>('/api/test', requestBody, config);
        "
      `);
    });

    it('compiles operations with required request bodies', () => {
      const document = createDocument({
        paths: {
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
                200: {
                  description: 'OK',
                },
              },
              summary: 'Endpoint under test.',
            },
          },
        },
      });

      const { operationsFileContent } = generateSourceFilesOrThrow(
        JSON.stringify(document),
      );

      expect(operationsFileContent).toMatchInlineSnapshot(`
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
        "
      `);
    });
  });

  describe('Path Parameters', () => {
    it('compiles operations with inline path parameters at path level', () => {
      const document = createDocument({
        paths: {
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
                200: {
                  description: 'OK',
                },
              },
              summary: 'Endpoint under test.',
            },
            post: {
              operationId: 'postOperation',
              responses: {
                200: {
                  description: 'OK',
                },
              },
              summary: 'Endpoint under test.',
            },
          },
        },
      });

      const { operationsFileContent } = generateSourceFilesOrThrow(
        JSON.stringify(document),
      );

      expect(operationsFileContent).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
        import type { AxiosRequestConfig } from 'axios';
        import axios from 'axios';
        /**
         * Endpoint under test.
         * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
         * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
         */
        export const getOperation = async (
          parameters: {
            /**
             * Parameter under test.
             */
            readonly parameter?: unknown;
          },
          config?: AxiosRequestConfig,
        ) => axios.get<void>(\`/api/test/\${parameters.parameter}\`, config);
        /**
         * Endpoint under test.
         * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
         * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
         */
        export const postOperation = async (
          parameters: {
            /**
             * Parameter under test.
             */
            readonly parameter?: unknown;
          },
          config?: AxiosRequestConfig,
        ) => axios.post<void>(\`/api/test/\${parameters.parameter}\`, undefined, config);
        "
      `);
    });

    it('compiles operations with inline path parameters at operation level', () => {
      const document = createDocument({
        paths: {
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
                200: {
                  description: 'OK',
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
                200: {
                  description: 'OK',
                },
              },
              summary: 'Endpoint under test.',
            },
          },
        },
      });

      const { operationsFileContent } = generateSourceFilesOrThrow(
        JSON.stringify(document),
      );

      expect(operationsFileContent).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
        import type { AxiosRequestConfig } from 'axios';
        import axios from 'axios';
        /**
         * Endpoint under test.
         * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
         * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
         */
        export const getOperation = async (
          parameters: {
            /**
             * Parameter under test.
             */
            readonly parameter?: unknown;
          },
          config?: AxiosRequestConfig,
        ) => axios.get<void>(\`/api/test/\${parameters.parameter}\`, config);
        /**
         * Endpoint under test.
         * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
         * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
         */
        export const postOperation = async (
          parameters: {
            /**
             * Parameter under test.
             */
            readonly parameter?: unknown;
          },
          config?: AxiosRequestConfig,
        ) => axios.post<void>(\`/api/test/\${parameters.parameter}\`, undefined, config);
        "
      `);
    });

    it('compiles operations with path parameter $refs at path level', () => {
      const document = createDocument({
        parameters: {
          parameter: {
            in: 'path',
            description: 'Parameter under test.',
            name: 'parameter',
            schema: {},
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
                200: {
                  description: 'OK',
                },
              },
              summary: 'Endpoint under test.',
            },
            post: {
              operationId: 'postOperation',
              responses: {
                200: {
                  description: 'OK',
                },
              },
              summary: 'Endpoint under test.',
            },
          },
        },
      });

      const { operationsFileContent } = generateSourceFilesOrThrow(
        JSON.stringify(document),
      );

      expect(operationsFileContent).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
        import type { AxiosRequestConfig } from 'axios';
        import axios from 'axios';
        /**
         * Endpoint under test.
         * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
         * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
         */
        export const getOperation = async (
          parameters: {
            /**
             * Parameter under test.
             */
            readonly parameter?: unknown;
          },
          config?: AxiosRequestConfig,
        ) => axios.get<void>(\`/api/test/\${parameters.parameter}\`, config);
        /**
         * Endpoint under test.
         * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
         * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
         */
        export const postOperation = async (
          parameters: {
            /**
             * Parameter under test.
             */
            readonly parameter?: unknown;
          },
          config?: AxiosRequestConfig,
        ) => axios.post<void>(\`/api/test/\${parameters.parameter}\`, undefined, config);
        "
      `);
    });

    it('compiles operations with path parameter $refs at operation level', () => {
      const document = createDocument({
        parameters: {
          parameter: {
            in: 'path',
            description: 'Parameter under test.',
            name: 'parameter',
            schema: {},
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
                200: {
                  description: 'OK',
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
                200: {
                  description: 'OK',
                },
              },
              summary: 'Endpoint under test.',
            },
          },
        },
      });

      const { operationsFileContent } = generateSourceFilesOrThrow(
        JSON.stringify(document),
      );

      expect(operationsFileContent).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
        import type { AxiosRequestConfig } from 'axios';
        import axios from 'axios';
        /**
         * Endpoint under test.
         * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
         * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
         */
        export const getOperation = async (
          parameters: {
            /**
             * Parameter under test.
             */
            readonly parameter?: unknown;
          },
          config?: AxiosRequestConfig,
        ) => axios.get<void>(\`/api/test/\${parameters.parameter}\`, config);
        /**
         * Endpoint under test.
         * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
         * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
         */
        export const postOperation = async (
          parameters: {
            /**
             * Parameter under test.
             */
            readonly parameter?: unknown;
          },
          config?: AxiosRequestConfig,
        ) => axios.post<void>(\`/api/test/\${parameters.parameter}\`, undefined, config);
        "
      `);
    });

    it('compiles operations with required path parameters', () => {
      const document = createDocument({
        paths: {
          '/api/test/{parameter}': {
            parameters: [
              {
                in: 'path',
                description: 'Parameter under test.',
                name: 'parameter',
                required: true,
                schema: {},
              },
            ],
            get: {
              operationId: 'getOperation',
              responses: {
                200: {
                  description: 'OK',
                },
              },
              summary: 'Endpoint under test.',
            },
            post: {
              operationId: 'postOperation',
              responses: {
                200: {
                  description: 'OK',
                },
              },
              summary: 'Endpoint under test.',
            },
          },
        },
      });

      const { operationsFileContent } = generateSourceFilesOrThrow(
        JSON.stringify(document),
      );

      expect(operationsFileContent).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
        import type { AxiosRequestConfig } from 'axios';
        import axios from 'axios';
        /**
         * Endpoint under test.
         * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
         * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
         */
        export const getOperation = async (
          parameters: {
            /**
             * Parameter under test.
             */
            readonly parameter: unknown;
          },
          config?: AxiosRequestConfig,
        ) => axios.get<void>(\`/api/test/\${parameters.parameter}\`, config);
        /**
         * Endpoint under test.
         * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
         * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
         */
        export const postOperation = async (
          parameters: {
            /**
             * Parameter under test.
             */
            readonly parameter: unknown;
          },
          config?: AxiosRequestConfig,
        ) => axios.post<void>(\`/api/test/\${parameters.parameter}\`, undefined, config);
        "
      `);
    });
  });

  describe('Query Parameters', () => {
    it('compiles operations with query parameters at path level', () => {
      const document = createDocument({
        paths: {
          '/api/test': {
            parameters: [
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
                200: {
                  description: 'OK',
                },
              },
              summary: 'Endpoint under test.',
            },
            post: {
              operationId: 'postOperation',
              responses: {
                200: {
                  description: 'OK',
                },
              },
              summary: 'Endpoint under test.',
            },
          },
        },
      });

      const { operationsFileContent } = generateSourceFilesOrThrow(
        JSON.stringify(document),
      );

      expect(operationsFileContent).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
        import type { AxiosRequestConfig } from 'axios';
        import axios from 'axios';
        /**
         * Endpoint under test.
         * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
         * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
         */
        export const getOperation = async (
          parameters: {
            /**
             * Parameter under test.
             */
            readonly query?: unknown;
          },
          config?: AxiosRequestConfig,
        ) =>
          axios.get<void>('/api/test', {
            ...config,
            params: {
              query: parameters.query,
            },
          });
        /**
         * Endpoint under test.
         * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
         * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
         */
        export const postOperation = async (
          parameters: {
            /**
             * Parameter under test.
             */
            readonly query?: unknown;
          },
          config?: AxiosRequestConfig,
        ) =>
          axios.post<void>('/api/test', undefined, {
            ...config,
            params: {
              query: parameters.query,
            },
          });
        "
      `);
    });

    it('compiles operations with query parameters at operation level', () => {
      const document = createDocument({
        paths: {
          '/api/test': {
            get: {
              parameters: [
                {
                  in: 'query',
                  description: 'Parameter under test.',
                  name: 'query',
                  schema: {},
                },
              ],
              operationId: 'getOperation',
              responses: {
                200: {
                  description: 'OK',
                },
              },
              summary: 'Endpoint under test.',
            },
            post: {
              parameters: [
                {
                  in: 'query',
                  description: 'Parameter under test.',
                  name: 'query',
                  schema: {},
                },
              ],
              operationId: 'postOperation',
              responses: {
                200: {
                  description: 'OK',
                },
              },
              summary: 'Endpoint under test.',
            },
          },
        },
      });

      const { operationsFileContent } = generateSourceFilesOrThrow(
        JSON.stringify(document),
      );

      expect(operationsFileContent).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
        import type { AxiosRequestConfig } from 'axios';
        import axios from 'axios';
        /**
         * Endpoint under test.
         * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
         * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
         */
        export const getOperation = async (
          parameters: {
            /**
             * Parameter under test.
             */
            readonly query?: unknown;
          },
          config?: AxiosRequestConfig,
        ) =>
          axios.get<void>('/api/test', {
            ...config,
            params: {
              query: parameters.query,
            },
          });
        /**
         * Endpoint under test.
         * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
         * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
         */
        export const postOperation = async (
          parameters: {
            /**
             * Parameter under test.
             */
            readonly query?: unknown;
          },
          config?: AxiosRequestConfig,
        ) =>
          axios.post<void>('/api/test', undefined, {
            ...config,
            params: {
              query: parameters.query,
            },
          });
        "
      `);
    });

    it('compiles operations with required query parameters', () => {
      const document = createDocument({
        paths: {
          '/api/test': {
            parameters: [
              {
                in: 'query',
                description: 'Parameter under test.',
                name: 'query',
                required: true,
                schema: {},
              },
            ],
            get: {
              operationId: 'getOperation',
              responses: {
                200: {
                  description: 'OK',
                },
              },
              summary: 'Endpoint under test.',
            },
            post: {
              operationId: 'postOperation',
              responses: {
                200: {
                  description: 'OK',
                },
              },
              summary: 'Endpoint under test.',
            },
          },
        },
      });

      const { operationsFileContent } = generateSourceFilesOrThrow(
        JSON.stringify(document),
      );

      expect(operationsFileContent).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
        import type { AxiosRequestConfig } from 'axios';
        import axios from 'axios';
        /**
         * Endpoint under test.
         * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
         * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
         */
        export const getOperation = async (
          parameters: {
            /**
             * Parameter under test.
             */
            readonly query: unknown;
          },
          config?: AxiosRequestConfig,
        ) =>
          axios.get<void>('/api/test', {
            ...config,
            params: {
              query: parameters.query,
            },
          });
        /**
         * Endpoint under test.
         * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
         * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
         */
        export const postOperation = async (
          parameters: {
            /**
             * Parameter under test.
             */
            readonly query: unknown;
          },
          config?: AxiosRequestConfig,
        ) =>
          axios.post<void>('/api/test', undefined, {
            ...config,
            params: {
              query: parameters.query,
            },
          });
        "
      `);
    });
  });
});
