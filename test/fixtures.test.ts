import { readFileSync } from 'fs';
import { compileDocument } from 'generator';
import { parseYaml } from 'parser';
import { compose } from 'ramda';

// TESTEE function
const compile = compose(compileDocument, parseYaml);

describe('Fixtures', () => {
  it('compiles the link example schema', () => {
    // GIVEN the link example OpenAPI schema
    const document = readFileSync('test/fixtures/link-example.yaml').toString();

    // WHEN compiling
    const { requests, schemas } = compile(document);

    // THEN the output matches the snapshot
    expect(requests).toMatchSnapshot();
    expect(schemas).toMatchSnapshot();
  });

  it('compiles the petstore schema', () => {
    // GIVEN the petstore OpenAPI schema
    const document = readFileSync('test/fixtures/petstore.yaml').toString();

    // WHEN compiling
    const { requests, schemas } = compile(document);

    // THEN the output matches the snapshot
    expect(requests).toMatchSnapshot();
    expect(schemas).toMatchSnapshot();
  });

  it('compiles the expanded petstore schema', () => {
    // GIVEN the expanded petstore OpenAPI schema
    const document = readFileSync(
      'test/fixtures/petstore-expanded.yaml',
    ).toString();

    // WHEN compiling
    const { requests, schemas } = compile(document);

    // THEN the output matches the snapshot
    expect(requests).toMatchSnapshot();
    expect(schemas).toMatchSnapshot();
  });

  it('compiles the uspto schema', () => {
    // GIVEN the uspto OpenAPI schema
    const document = readFileSync('test/fixtures/uspto.yaml').toString();

    // WHEN compiling
    const { requests, schemas } = compile(document);

    // THEN the output matches the snapshot
    expect(requests).toMatchSnapshot();
    expect(schemas).toMatchSnapshot();
  });
});
