import { generateSourceFilesOrThrow } from 'index';
import { createDocument } from 'utils/testing';

describe('Schemas', () => {
  it('compiles simple scalar types', () => {
    const document = createDocument({
      schemas: {
        BooleanSchema: {
          type: 'boolean',
          description: 'Schema under test.',
        },
        NullableBooleanSchema: {
          oneOf: [{ type: 'boolean' }, { type: 'null' }],
          description: 'Schema under test.',
        },
        IntegerSchema: {
          type: 'integer',
          description: 'Schema under test.',
        },
        NullableIntegerSchema: {
          oneOf: [{ type: 'integer' }, { type: 'null' }],
          description: 'Schema under test.',
        },
        NumberSchema: {
          type: 'number',
          description: 'Schema under test.',
        },
        NullableNumberSchema: {
          oneOf: [{ type: 'number' }, { type: 'null' }],
          description: 'Schema under test.',
        },
        StringSchema: {
          type: 'string',
          description: 'Schema under test.',
        },
        NullableStringSchema: {
          oneOf: [{ type: 'string' }, { type: 'null' }],
          description: 'Schema under test.',
        },
        StringEnumSchema: {
          type: 'string',
          enum: ['value1', 'value2'],
          description: 'Schema under test.',
        },
        NullableStringEnumSchema: {
          oneOf: [
            { type: 'string', enum: ['value1', 'value2'] },
            { type: 'null' },
          ],
          description: 'Schema under test.',
        },
        UnknownSchema: {
          description: 'Schema under test.',
        },
        NullableUnknownSchema: {
          description: 'Schema under test.',
          oneOf: [{}, { type: 'null' }],
        },
      },
    });

    const { schemaFileContent } = generateSourceFilesOrThrow(
      JSON.stringify(document),
    );

    expect(schemaFileContent).toMatchInlineSnapshot(`
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
    const document = createDocument({
      schemas: {
        UnknownArraySchema: {
          description: 'Schema under test.',
          type: 'array',
          items: {},
        },
        UnknownNullableArraySchema: {
          description: 'Schema under test.',
          oneOf: [{ type: 'array', items: {} }, { type: 'null' }],
        },
        NullableUnknownArraySchema: {
          description: 'Schema under test.',
          type: 'array',
          items: {
            oneOf: [{}, { type: 'null' }],
          },
        },
        NullableUnknownNullableArraySchema: {
          description: 'Schema under test.',
          oneOf: [
            {
              type: 'array',
              items: {
                oneOf: [{}, { type: 'null' }],
              },
            },
            { type: 'null' },
          ],
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
          oneOf: [
            {
              type: 'array',
              items: {
                type: 'array',
                items: {},
              },
            },
            { type: 'null' },
          ],
        },
        NestedUnknownNullableArraySchema: {
          description: 'Schema under test.',
          type: 'array',
          items: {
            oneOf: [{ type: 'array', items: {} }, { type: 'null' }],
          },
        },
        NullableNestedUnknownNullableArraySchema: {
          description: 'Schema under test.',
          oneOf: [
            {
              type: 'array',
              items: {
                oneOf: [{ type: 'array', items: {} }, { type: 'null' }],
              },
            },
            { type: 'null' },
          ],
        },
        ArraySchemaWithoutExplicitType: {
          description: 'Schema under test.',
          items: {},
        },
      },
    });

    const { schemaFileContent } = generateSourceFilesOrThrow(
      JSON.stringify(document),
    );

    expect(schemaFileContent).toMatchInlineSnapshot(`
      "/* eslint-disable */
      /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
      /**
       * Schema under test.
       */
      export type ArraySchemaWithoutExplicitType = readonly unknown[];
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
    const document = createDocument({
      schemas: {
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
          oneOf: [
            {
              type: 'array',
              items: {
                $ref: '#/components/schemas/TestSchema',
              },
            },
            { type: 'null' },
          ],
        },
      },
    });

    const { schemaFileContent } = generateSourceFilesOrThrow(
      JSON.stringify(document),
    );

    expect(schemaFileContent).toMatchInlineSnapshot(`
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

  it('compiles complex array types', () => {
    const document = createDocument({
      schemas: {
        TestSchema: {
          description: 'Schema under test.',
        },
        AllOfArraySchema: {
          description: 'Schema under test.',
          type: 'array',
          items: {
            allOf: [
              {
                $ref: '#/components/schemas/TestSchema',
              },
              {},
            ],
          },
        },
        OneOfArraySchema: {
          description: 'Schema under test.',
          type: 'array',
          items: {
            oneOf: [
              {
                $ref: '#/components/schemas/TestSchema',
              },
              {},
            ],
          },
        },
      },
    });

    const { schemaFileContent } = generateSourceFilesOrThrow(
      JSON.stringify(document),
    );

    expect(schemaFileContent).toMatchInlineSnapshot(`
      "/* eslint-disable */
      /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
      /**
       * Schema under test.
       */
      export type AllOfArraySchema = readonly (TestSchema & unknown)[];
      /**
       * Schema under test.
       */
      export type OneOfArraySchema = readonly (TestSchema | unknown)[];
      /**
       * Schema under test.
       */
      export type TestSchema = unknown;
      "
    `);
  });

  it('compiles object types', () => {
    const document = createDocument({
      schemas: {
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
        ObjectSchemaWithoutExplicitType: {
          description: 'Schema under test.',
          properties: {
            property: {
              description: 'Property under test.',
            },
          },
        },
      },
    });

    const { schemaFileContent } = generateSourceFilesOrThrow(
      JSON.stringify(document),
    );

    expect(schemaFileContent).toMatchInlineSnapshot(`
      "/* eslint-disable */
      /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
      /**
       * Schema under test.
       */
      export type ObjectSchema = {
        readonly arrayProp?: readonly unknown[];
        readonly arrayRefProp?: readonly TestSchema[];
        readonly optionalProp?: unknown;
        readonly refProp?: TestSchema;
        readonly requiredProp: unknown;
      };
      /**
       * Schema under test.
       */
      export type ObjectSchemaWithoutExplicitType = {
        readonly property?: unknown;
      };
      /**
       * Schema under test.
       */
      export type TestSchema = unknown;
      "
    `);
  });

  it('compiles combined types', () => {
    const document = createDocument({
      schemas: {
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
      },
    });

    const { schemaFileContent } = generateSourceFilesOrThrow(
      JSON.stringify(document),
    );

    expect(schemaFileContent).toMatchInlineSnapshot(`
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
    const document = createDocument({
      schemas: {
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
      },
    });

    const { schemaFileContent } = generateSourceFilesOrThrow(
      JSON.stringify(document),
    );

    expect(schemaFileContent).toMatchInlineSnapshot(`
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

  it('compiles schemas with additional properties', () => {
    const document = createDocument({
      schemas: {
        TestSchema: {
          description: 'Schema under test.',
          type: 'object',
          additionalProperties: true,
          properties: {
            namedProperty: {
              description: 'Property under test.',
            },
          },
        },
      },
    });

    const { schemaFileContent } = generateSourceFilesOrThrow(
      JSON.stringify(document),
    );

    expect(schemaFileContent).toMatchInlineSnapshot(`
      "/* eslint-disable */
      /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
      /**
       * Schema under test.
       */
      export type TestSchema = {
        readonly namedProperty?: unknown;
      } & Record<string, unknown>;
      "
    `);
  });
});
