import { pascalCase } from 'change-case';
import { resolveSchema } from 'generator/resolver';
import type { OpenAPIV3 } from 'openapi-types';
import ts, { factory } from 'typescript';
import { compact } from 'utils/fp';
import { dereferenceName } from 'utils/openapi';
import { isReferenceObject } from 'utils/type-guards';

export const createSchemaDeclaration = (
  schemaName: string,
  schemaObject:
    | OpenAPIV3.ReferenceObject
    | OpenAPIV3.ArraySchemaObject
    | OpenAPIV3.NonArraySchemaObject,
) => {
  const description =
    (isReferenceObject(schemaObject) ? undefined : schemaObject.description) ??
    '';
  const seeReferencedSchemaTag = isReferenceObject(schemaObject)
    ? factory.createJSDocSeeTag(
        factory.createIdentifier('see'),
        factory.createJSDocNameReference(
          factory.createIdentifier(dereferenceName(schemaObject.$ref)),
        ),
      )
    : undefined;

  const hasJSDoc =
    description.length !== 0 || seeReferencedSchemaTag !== undefined;

  return compact([
    hasJSDoc &&
      factory.createJSDocComment(
        description,
        compact([seeReferencedSchemaTag]),
      ),
    factory.createTypeAliasDeclaration(
      undefined,
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createIdentifier(pascalCase(schemaName)),
      undefined,
      resolveSchema(schemaObject),
    ),
  ]);
};
