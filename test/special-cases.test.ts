import { compile } from 'index';
import {
  createTestDocument,
  createTestDocumentWithSchemas,
} from 'utils/testing';

describe('Special Cases', () => {
  it('compiles actual null types according to OpenAPI v3.1', () => {
    // GIVEN an OpenAPI schema that contains a schema with a null type
    const document = createTestDocumentWithSchemas({
      NullSchema1: {
        description: 'Schema under test.',
        // TODO: Remove with OpenAPI v3.1
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        type: 'null',
      },
      NullSchema2: {
        description: 'Schema under test.',
        // TODO: Remove with OpenAPI v3.1
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        type: "'null'",
      },
    });

    // WHEN compiling
    const { schemas } = compile(document);

    // THEN the output matches the snapshot
    expect(schemas).toMatchInlineSnapshot(`
      "/* eslint-disable */
      /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
      /**
       * Schema under test.
       */
      export type NullSchema1 = null;
      /**
       * Schema under test.
       */
      export type NullSchema2 = null;
      "
    `);
  });

  it('compiles unusual object type declarations', () => {
    // GIVEN an OpenAPI schema that contains a schema with unusual object
    // types
    const document = createTestDocumentWithSchemas({
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
    });

    // WHEN compiling
    const { schemas } = compile(document);

    // THEN the output matches the snapshot
    expect(schemas).toMatchInlineSnapshot(`
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

  it('should not import transitively referenced types', () => {
    // GIVEN an OpenAPI schema that contains a schema that transitively
    // references another schema
    const document = createTestDocument({
      components: {
        schemas: {
          TransitiveTestDto: {
            description: 'Schema under test.',
          },
          TestDto: {
            description: 'Schema under test.',
            type: 'object',
            properties: {
              propertyWithTransitiveSchema: {
                $ref: '#/components/schemas/TransitiveTestDto',
              },
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
                description: 'OK',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/TestDto',
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
      import type { TestDto } from './schemas';
      /**
       * Endpoint under test.
       * @param config A custom \`AxiosRequestConfig\` object that is used to override the global configuration for this request. This value is optional.
       */
      export const getOperation = async (config?: AxiosRequestConfig) =>
        axios.get<TestDto>('/api/test', config);
      "
    `);
  });
});
