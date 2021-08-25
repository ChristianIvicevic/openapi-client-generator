import { Constants } from 'generator/constants';
import { factory } from 'typescript';
import { compact } from 'utils/fp';

type Options = {
  readonly schemas: readonly string[];
  readonly schemasFileName?: string;
};

export const createLeadingTrivia = ({
  schemas,
  schemasFileName = 'schemas',
}: Options) => {
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
        schemas.map(schema =>
          factory.createImportSpecifier(
            undefined,
            factory.createIdentifier(schema),
          ),
        ),
      ),
    ),
    factory.createStringLiteral(`./${schemasFileName.replace(/\.ts$/, '')}`),
  );

  return compact([
    axiosRequestConfigImport,
    axiosImport,
    schemas.length !== 0 && schemasImport,
  ]);
};
