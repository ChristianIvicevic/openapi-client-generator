import { readFileSync } from 'fs';
import { generateSourceFilesOrThrow } from 'index';

describe('Fixtures', () => {
  it('compiles the link example schema', () => {
    // GIVEN the link example OpenAPI schema
    const document = readFileSync('test/fixtures/link-example.yaml').toString();

    // WHEN compiling
    const { schemaFileContent, operationsFileContent } =
      generateSourceFilesOrThrow(document);

    // THEN the output matches the snapshot
    expect(schemaFileContent).toMatchSnapshot();
    expect(operationsFileContent).toMatchSnapshot();
  });

  it('compiles the petstore schema', () => {
    // GIVEN the petstore OpenAPI schema
    const document = readFileSync('test/fixtures/petstore.yaml').toString();

    // WHEN compiling
    const { schemaFileContent, operationsFileContent } =
      generateSourceFilesOrThrow(document);

    // THEN the output matches the snapshot
    expect(schemaFileContent).toMatchSnapshot();
    expect(operationsFileContent).toMatchSnapshot();
  });

  it('compiles the expanded petstore schema', () => {
    // GIVEN the expanded petstore OpenAPI schema
    const document = readFileSync(
      'test/fixtures/petstore-expanded.yaml',
    ).toString();

    // WHEN compiling
    const { schemaFileContent, operationsFileContent } =
      generateSourceFilesOrThrow(document);

    // THEN the output matches the snapshot
    expect(schemaFileContent).toMatchSnapshot();
    expect(operationsFileContent).toMatchSnapshot();
  });
});
