import { pascalCase } from 'change-case';
import { resolveSchema } from 'generator/resolver';
import type { Context } from 'generator/types';
import type { OpenAPIV3 } from 'openapi-types';
import ts, { factory } from 'typescript';
import { compact } from 'utils/fp';
import { isReferenceObject } from 'utils/type-guards';

export const createSchemaDeclaration = (
  context: Context,
  schemaName: string,
  schemaObject:
    | OpenAPIV3.ReferenceObject
    | OpenAPIV3.ArraySchemaObject
    | OpenAPIV3.NonArraySchemaObject,
) => {
  const description = isReferenceObject(schemaObject)
    ? // TODO: Dereference description of deeply referenced schema object.
      ''
    : schemaObject.description ?? '';
  return compact([
    description.length !== 0 && factory.createJSDocComment(description, []),
    factory.createTypeAliasDeclaration(
      undefined,
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createIdentifier(pascalCase(schemaName)),
      undefined,
      resolveSchema(context, schemaObject),
    ),
  ]);
};
