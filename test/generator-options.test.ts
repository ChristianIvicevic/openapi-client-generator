import { generateSourceFilesOrThrow } from 'index';
import type { OpenAPIV3_1 } from 'openapi-types';
import { createDocument } from 'utils/testing';

describe('Generator Options', () => {
  it('compiles with a custom schema file name', () => {
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
                      $ref: '#/components/schemas/TestSchema',
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
        TestSchema: {},
      },
    });

    const { operationsFileContent } = generateSourceFilesOrThrow(
      JSON.stringify(document),
      {
        schemasFileName: 'custom-schemas.ts',
      },
    );

    expect(operationsFileContent).toMatchInlineSnapshot(`
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
