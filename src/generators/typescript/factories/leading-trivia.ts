import { pascalCase } from 'change-case';
import { Constants } from 'generators/typescript/constants';
import ts, { factory } from 'typescript';
import { compact } from 'utils/fp';

type Options = {
  readonly referencedSchemas: readonly string[];
};

export const createLeadingTrivia = ({ referencedSchemas }: Options) => {
  const axiosRequestConfigImport = factory.createImportDeclaration(
    undefined,
    undefined,
    factory.createImportClause(
      true,
      undefined,
      factory.createNamedImports([
        factory.createImportSpecifier(
          undefined,
          factory.createIdentifier(Constants.AXIOS_REQUEST_CONFIG_TYPE),
        ),
      ]),
    ),
    factory.createStringLiteral(Constants.AXIOS_PACKAGE_NAME),
  );

  const axiosImport = factory.createImportDeclaration(
    undefined,
    undefined,
    factory.createImportClause(
      false,
      factory.createIdentifier(Constants.AXIOS_IMPORT_NAME),
      undefined,
    ),
    factory.createStringLiteral(Constants.AXIOS_PACKAGE_NAME),
  );

  const schemasImport = factory.createImportDeclaration(
    undefined,
    undefined,
    factory.createImportClause(
      true,
      undefined,
      factory.createNamedImports(
        referencedSchemas.map(schema =>
          factory.createImportSpecifier(
            undefined,
            factory.createIdentifier(pascalCase(schema)),
          ),
        ),
      ),
    ),
    factory.createStringLiteral('./schemas'),
  );

  ts.addSyntheticLeadingComment(
    axiosRequestConfigImport,
    ts.SyntaxKind.MultiLineCommentTrivia,
    ' eslint-disable ',
    true,
  );

  ts.addSyntheticLeadingComment(
    axiosRequestConfigImport,
    ts.SyntaxKind.MultiLineCommentTrivia,
    ' THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY ',
    true,
  );

  return compact([
    axiosRequestConfigImport,
    axiosImport,
    referencedSchemas.length !== 0 && schemasImport,
  ]);
};
