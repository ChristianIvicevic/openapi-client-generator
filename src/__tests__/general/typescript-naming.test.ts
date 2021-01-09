import { compileDocument } from 'generator';
import { parseYaml } from 'parser';
import { compose } from 'ramda';
import { createTestDocument } from 'utils/testing';

// TESTEE function
const compile = compose(compileDocument, parseYaml);

describe('Typescript Naming', () => {
  it('compiles invalid Typescript names with changed casing', () => {
    // GIVEN an OpenAPI schema that contains invalid Typescript names
    const document = createTestDocument({
      components: {
        schemas: {
          'unknown-schema': {
            description: 'Schema under test.',
          },
        },
        parameters: {
          'path-parameter': {
            in: 'path',
            description: 'Parameter under test.',
            name: 'path-parameter',
            schema: {},
          },
        },
      },
      paths: {
        '/api/test/{path-parameter}': {
          parameters: [
            {
              $ref: '#/components/parameters/path-parameter',
            },
          ],
          get: {
            operationId: 'getOperation',
            responses: {
              204: {
                description: 'No content.',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/unknown-schema',
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
              204: {
                description: 'No content.',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/unknown-schema',
                    },
                  },
                },
              },
            },
            summary: 'Endpoint under test.',
          },
          put: {
            operationId: 'putOperation',
            responses: {
              204: {
                description: 'No content.',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/unknown-schema',
                    },
                  },
                },
              },
            },
            summary: 'Endpoint under test.',
          },
          delete: {
            operationId: 'deleteOperation',
            responses: {
              204: {
                description: 'No content.',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/unknown-schema',
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

    // WHEN compiling
    const { requests } = compile(document);

    // THEN the output matches the snapshot
    expect(requests).toMatchInlineSnapshot(`
      "/* eslint-disable */
      /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
      import type { AxiosRequestConfig } from 'axios';
      import axios from 'axios';
      import type { UnknownSchema } from './schemas';
      /**
       * Endpoint under test.
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const deleteOperation = async (
        parameters: {
          readonly pathParameter?: unknown;
        },
        config?: AxiosRequestConfig,
      ) =>
        axios.delete<UnknownSchema>(\`/api/test/\${parameters.pathParameter}\`, config);
      /**
       * Endpoint under test.
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const getOperation = async (
        parameters: {
          readonly pathParameter?: unknown;
        },
        config?: AxiosRequestConfig,
      ) => axios.get<UnknownSchema>(\`/api/test/\${parameters.pathParameter}\`, config);
      /**
       * Endpoint under test.
       * @param parameters The HTTP request (path, query, header and cookie) parameters sent to the server.
       * @param config A custom config object that is used to override the global configuration for this request. This value is optional.
       */
      export const postOperation = async (
        parameters: {
          readonly pathParameter?: unknown;
        },
        config?: AxiosRequestConfig,
      ) =>
        axios.post<UnknownSchema>(
          \`/api/test/\${parameters.pathParameter}\`,
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
          readonly pathParameter?: unknown;
        },
        config?: AxiosRequestConfig,
      ) =>
        axios.put<UnknownSchema>(
          \`/api/test/\${parameters.pathParameter}\`,
          undefined,
          config,
        );
      "
    `);
  });
});
