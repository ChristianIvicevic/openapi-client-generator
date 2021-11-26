import { generateSourceFilesOrThrow } from 'index';
import type { OpenAPIV3_1 } from 'openapi-types';
import { createDocument } from 'utils/testing';

describe('Special Cases', () => {
  it('compiles invalid Typescript names with changed casing', () => {
    // GIVEN an OpenAPI schema that contains invalid Typescript names
    const document = createDocument({
      schemas: {
        'unknown-schema': {
          description: 'Schema under test.',
        },
      },
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
                      $ref: '#/components/schemas/unknown-schema',
                    } as OpenAPIV3_1.ReferenceObject,
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
    const { operationsFileContent } = generateSourceFilesOrThrow(
      JSON.stringify(document),
    );

    // THEN the output matches the snapshot
    expect(operationsFileContent).toMatchInlineSnapshot(`
      "/* eslint-disable */
      /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
      import type { AxiosRequestConfig } from 'axios';
      import axios from 'axios';
      import type { UnknownSchema } from './schemas';
      /**
       * Endpoint under test.
       * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
       */
      export const getOperation = async (config?: AxiosRequestConfig) =>
        axios.get<UnknownSchema>('/api/test', config);
      "
    `);
  });

  it('compiles unusual object type declarations', () => {
    // GIVEN an OpenAPI schema that contains a schema with unusual object types
    const document = createDocument({
      schemas: {
        TestSchema: {
          description: 'Schema under test.',
        },
        ExcessObjectWithoutPropertiesSchema: {
          description: 'Schema under test.',
          type: 'object',
        },
        ObjectWithEmptyPropertiesSchema: {
          description: 'Schema under test.',
          type: 'object',
          properties: {},
        },
        ExcessAllOfSchema: {
          description: 'Schema under test.',
          type: 'object',
          allOf: [
            {
              $ref: '#/components/schemas/TestSchema',
            },
            {
              type: 'object',
              properties: {
                prop: {
                  description: 'Property under test.',
                },
              },
            },
          ],
        },
        ExcessOneOfSchema: {
          description: 'Schema under test.',
          type: 'object',
          oneOf: [
            {
              $ref: '#/components/schemas/TestSchema',
            },
            {
              type: 'object',
              properties: {
                prop: {
                  description: 'Property under test.',
                },
              },
            },
          ],
        },
      },
    });

    // WHEN compiling
    const { schemaFileContent } = generateSourceFilesOrThrow(
      JSON.stringify(document),
    );

    // THEN the output matches the snapshot
    expect(schemaFileContent).toMatchInlineSnapshot(`
      "/* eslint-disable */
      /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
      /**
       * Schema under test.
       */
      export type ExcessAllOfSchema = TestSchema & {
        readonly prop?: unknown;
      };
      /**
       * Schema under test.
       */
      export type ExcessObjectWithoutPropertiesSchema = unknown;
      /**
       * Schema under test.
       */
      export type ExcessOneOfSchema =
        | TestSchema
        | {
            readonly prop?: unknown;
          };
      /**
       * Schema under test.
       */
      export type ObjectWithEmptyPropertiesSchema = unknown;
      /**
       * Schema under test.
       */
      export type TestSchema = unknown;
      "
    `);
  });
});
