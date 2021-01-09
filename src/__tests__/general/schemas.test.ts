import { compileDocument } from 'generator';
import { parseYaml } from 'parser';
import { compose } from 'ramda';
import { createTestDocumentWithSchemas } from 'utils/testing';

// TESTEE function
const compile = compose(compileDocument, parseYaml);

describe('Schemas', () => {
  it('compiles simple scalar types', () => {
    // GIVEN an OpenAPI schema that contains schemas for simple scalar types
    const document = createTestDocumentWithSchemas({
      BooleanSchema: {
        type: 'boolean',
        description: 'Schema under test.',
      },
      NullableBooleanSchema: {
        type: 'boolean',
        nullable: true,
        description: 'Schema under test.',
      },
      IntegerSchema: {
        type: 'integer',
        description: 'Schema under test.',
      },
      NullableIntegerSchema: {
        type: 'integer',
        nullable: true,
        description: 'Schema under test.',
      },
      NumberSchema: {
        type: 'number',
        description: 'Schema under test.',
      },
      NullableNumberSchema: {
        type: 'number',
        nullable: true,
        description: 'Schema under test.',
      },
      StringSchema: {
        type: 'string',
        description: 'Schema under test.',
      },
      NullableStringSchema: {
        type: 'string',
        nullable: true,
        description: 'Schema under test.',
      },
      StringEnumSchema: {
        type: 'string',
        enum: ['value1', 'value2'],
        description: 'Schema under test.',
      },
      NullableStringEnumSchema: {
        type: 'string',
        nullable: true,
        enum: ['value1', 'value2'],
        description: 'Schema under test.',
      },
      UnknownSchema: {
        description: 'Schema under test.',
      },
      NullableUnknownSchema: {
        description: 'Schema under test.',
        nullable: true,
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
      export type BooleanSchema = boolean;
      /**
       * Schema under test.
       */
      export type IntegerSchema = number;
      /**
       * Schema under test.
       */
      export type NullableBooleanSchema = boolean | null;
      /**
       * Schema under test.
       */
      export type NullableIntegerSchema = number | null;
      /**
       * Schema under test.
       */
      export type NullableNumberSchema = number | null;
      /**
       * Schema under test.
       */
      export type NullableStringEnumSchema = ('value1' | 'value2') | null;
      /**
       * Schema under test.
       */
      export type NullableStringSchema = string | null;
      /**
       * Schema under test.
       */
      export type NullableUnknownSchema = unknown | null;
      /**
       * Schema under test.
       */
      export type NumberSchema = number;
      /**
       * Schema under test.
       */
      export type StringEnumSchema = 'value1' | 'value2';
      /**
       * Schema under test.
       */
      export type StringSchema = string;
      /**
       * Schema under test.
       */
      export type UnknownSchema = unknown;
      "
    `);
  });

  it('compiles scalar array types', () => {
    // GIVEN an OpenAPI schema that contains schemas for scalar array types
    const document = createTestDocumentWithSchemas({
      UnknownArraySchema: {
        description: 'Schema under test.',
        type: 'array',
        items: {},
      },
      UnknownNullableArraySchema: {
        description: 'Schema under test.',
        type: 'array',
        nullable: true,
        items: {},
      },
      NullableUnknownArraySchema: {
        description: 'Schema under test.',
        type: 'array',
        items: {
          nullable: true,
        },
      },
      NullableUnknownNullableArraySchema: {
        description: 'Schema under test.',
        type: 'array',
        nullable: true,
        items: {
          nullable: true,
        },
      },
      NestedUnknownArraySchema: {
        description: 'Schema under test.',
        type: 'array',
        items: {
          type: 'array',
          items: {},
        },
      },
      NullableNestedUnknownArraySchema: {
        description: 'Schema under test.',
        type: 'array',
        nullable: true,
        items: {
          type: 'array',
          items: {},
        },
      },
      NestedUnknownNullableArraySchema: {
        description: 'Schema under test.',
        type: 'array',
        items: {
          type: 'array',
          nullable: true,
          items: {},
        },
      },
      NullableNestedUnknownNullableArraySchema: {
        description: 'Schema under test.',
        type: 'array',
        nullable: true,
        items: {
          type: 'array',
          nullable: true,
          items: {},
        },
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
      export type NestedUnknownArraySchema = readonly (readonly unknown[])[];
      /**
       * Schema under test.
       */
      export type NestedUnknownNullableArraySchema = readonly (
        | readonly unknown[]
        | null
      )[];
      /**
       * Schema under test.
       */
      export type NullableNestedUnknownArraySchema =
        | readonly (readonly unknown[])[]
        | null;
      /**
       * Schema under test.
       */
      export type NullableNestedUnknownNullableArraySchema =
        | readonly (readonly unknown[] | null)[]
        | null;
      /**
       * Schema under test.
       */
      export type NullableUnknownArraySchema = readonly (unknown | null)[];
      /**
       * Schema under test.
       */
      export type NullableUnknownNullableArraySchema =
        | readonly (unknown | null)[]
        | null;
      /**
       * Schema under test.
       */
      export type UnknownArraySchema = readonly unknown[];
      /**
       * Schema under test.
       */
      export type UnknownNullableArraySchema = readonly unknown[] | null;
      "
    `);
  });

  it('compiles $ref array types', () => {
    // GIVEN an OpenAPI schema that contains schemas for $ref array types
    const document = createTestDocumentWithSchemas({
      TestSchema: {
        description: 'Schema under test.',
      },
      ArraySchema: {
        description: 'Schema under test.',
        type: 'array',
        items: {
          $ref: '#/components/schemas/TestSchema',
        },
      },
      NullableArraySchema: {
        description: 'Schema under test.',
        type: 'array',
        nullable: true,
        items: {
          $ref: '#/components/schemas/TestSchema',
        },
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
      export type ArraySchema = readonly TestSchema[];
      /**
       * Schema under test.
       */
      export type NullableArraySchema = readonly TestSchema[] | null;
      /**
       * Schema under test.
       */
      export type TestSchema = unknown;
      "
    `);
  });

  it('compiles object types', () => {
    // GIVEN an OpenAPI schema that contains schemas for object types
    const document = createTestDocumentWithSchemas({
      TestSchema: {
        description: 'Schema under test.',
      },
      ObjectSchema: {
        description: 'Schema under test.',
        type: 'object',
        required: ['requiredProp'],
        properties: {
          requiredProp: {
            description: 'Property under test.',
          },
          optionalProp: {
            description: 'Property under test.',
          },
          refProp: {
            description: 'Property under test.',
            $ref: '#/components/schemas/TestSchema',
          },
          arrayProp: {
            description: 'Property under test.',
            type: 'array',
            items: {},
          },
          arrayRefProp: {
            description: 'Property under test.',
            type: 'array',
            items: {
              $ref: '#/components/schemas/TestSchema',
            },
          },
        },
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
      export type ObjectSchema = {
        readonly requiredProp: unknown;
        readonly optionalProp?: unknown;
        readonly refProp?: TestSchema;
        readonly arrayProp?: readonly unknown[];
        readonly arrayRefProp?: readonly TestSchema[];
      };
      /**
       * Schema under test.
       */
      export type TestSchema = unknown;
      "
    `);
  });

  it('compiles combined types', () => {
    // GIVEN an OpenAPI schema that contains schemas for combined types
    const document = createTestDocumentWithSchemas({
      TestSchema: {
        description: 'Schema under test.',
      },
      AllOfSchema: {
        description: 'Schema under test.',
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
      OneOfSchema: {
        description: 'Schema under test.',
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
      export type AllOfSchema = TestSchema & {
        readonly prop?: unknown;
      };
      /**
       * Schema under test.
       */
      export type OneOfSchema =
        | TestSchema
        | {
            readonly prop?: unknown;
          };
      /**
       * Schema under test.
       */
      export type TestSchema = unknown;
      "
    `);
  });

  it('compiles dictionary types', () => {
    // GIVEN an OpenAPI schema that contains schemas for dictionary types
    const document = createTestDocumentWithSchemas({
      TestSchema: {
        description: 'Schema under test.',
      },
      Dictionary: {
        description: 'Schema under test.',
        type: 'object',
        additionalProperties: {
          description: 'Schema under test.',
        },
      },
      ArrayDictionary: {
        description: 'Schema under test.',
        type: 'object',
        additionalProperties: {
          description: 'Schema under test.',
          type: 'array',
          items: {},
        },
      },
      TestSchemaDictionary: {
        description: 'Schema under test.',
        type: 'object',
        additionalProperties: {
          description: 'Schema under test.',
          $ref: '#/components/schemas/TestSchema',
        },
      },
      TestSchemaArrayDictionary: {
        description: 'Schema under test.',
        type: 'object',
        additionalProperties: {
          description: 'Schema under test.',
          type: 'array',
          items: {
            $ref: '#/components/schemas/TestSchema',
          },
        },
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
      export type ArrayDictionary = Record<string, readonly unknown[]>;
      /**
       * Schema under test.
       */
      export type Dictionary = Record<string, unknown>;
      /**
       * Schema under test.
       */
      export type TestSchema = unknown;
      /**
       * Schema under test.
       */
      export type TestSchemaArrayDictionary = Record<string, readonly TestSchema[]>;
      /**
       * Schema under test.
       */
      export type TestSchemaDictionary = Record<string, TestSchema>;
      "
    `);
  });

  // TODO: Extract into separate test file.
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
  });
});
