import { generateSourceFiles } from 'index';
import { createDocument } from 'utils/testing';

describe('Error Handling', () => {
  it('throws for an operation without an operationId', () => {
    const document = createDocument({
      paths: {
        '/api/test': {
          get: {
            responses: {},
            summary: 'Endpoint under test.',
          },
        },
      },
    });

    const either = generateSourceFiles(JSON.stringify(document));

    expect(either).toMatchInlineSnapshot(`
      Object {
        "_tag": "Left",
        "left": Array [
          "The 'get' method for the path '/api/test' needs an operation id.",
        ],
      }
    `);
  });

  it('throws for an operation without any responses', () => {
    const document = createDocument({
      paths: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore This is intentionally not adhering to the schema.
        '/api/test': {
          get: {
            operationId: 'getOperation',
            summary: 'Endpoint under test.',
          },
        },
      },
    });

    const either = generateSourceFiles(JSON.stringify(document));

    expect(either).toMatchInlineSnapshot(`
      Object {
        "_tag": "Left",
        "left": Array [
          "The 'get' method for the path '/api/test' has no responses.",
        ],
      }
    `);
  });

  // TODO: The compiler is not yet able to handle this case so it has to be
  //  implemented first.
  it.skip('throws for an operation that references a parameter that does not exist', () => {
    const document = createDocument({
      paths: {
        '/api/test/{does-not-exist}': {
          parameters: [
            {
              $ref: '#/components/parameters/does-not-exist',
            },
          ],
          get: {
            operationId: 'getOperation',
            responses: {},
            summary: 'Endpoint under test.',
          },
        },
      },
    });

    const either = generateSourceFiles(JSON.stringify(document));

    expect(either).toMatchInlineSnapshot(`
      Object {
        "_tag": "Right",
        "right": Object {
          "operationsFileContent": "/* eslint-disable */
      /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
      import type { AxiosRequestConfig } from 'axios';
      import axios from 'axios';
      /**
       * Endpoint under test.
       * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
       */
      export const getOperation = async (config?: AxiosRequestConfig) =>
        axios.get<void>('/api/test/{does-not-exist}', config);
      ",
          "schemaFileContent": "/* eslint-disable */
      /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
      ",
        },
      }
    `);
  });
});
