import { compile } from 'index';
import { createTestDocument } from 'utils/testing';

describe('Compiler Options', () => {
  it('compiles with a custom schema file name', () => {
    // GIVEN an OpenAPI schema
    const document = createTestDocument({
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
                      $ref: '#/components/schemas/TestSchema',
                    },
                  },
                },
              },
            },
            summary: 'Endpoint under test.',
          },
        },
      },
      components: {
        schemas: {
          TestSchema: {},
        },
      },
    });

    // WHEN compiling with a custom schema file name
    const { requests } = compile(document, {
      schemasFileName: 'custom-schemas.ts',
    });

    // THEN the output matches the snapshot
    expect(requests).toMatchInlineSnapshot(`
      "/* eslint-disable */
      /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
      import type { AxiosRequestConfig } from 'axios';
      import axios from 'axios';
      import type { TestSchema } from './custom-schemas';
      /**
       * Endpoint under test.
       * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
       */
      export const getOperation = async (config?: AxiosRequestConfig) =>
        axios.get<TestSchema>('/api/test', config);
      "
    `);
  });
});
