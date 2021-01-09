import { readFileSync } from 'fs';
import { compileDocument } from 'generator';
import { parseYaml } from 'parser';
import { compose } from 'ramda';

// TESTEE function
const compile = compose(compileDocument, parseYaml);

describe('Typescript Generator Fixtures', () => {
  it('compiles the link example schema', () => {
    // GIVEN the link example OpenAPI schema
    const document = readFileSync('fixtures/link-example.yaml').toString();

    // WHEN compiling with the typescript generator
    const { requests, schemas } = compile(document);

    // THEN the output matches the snapshot
    expect(requests).toMatchSnapshot();
    expect(schemas).toMatchSnapshot();
  });

  it('compiles the petstore schema', () => {
    // GIVEN the petstore OpenAPI schema
    const document = readFileSync('fixtures/petstore.yaml').toString();

    // WHEN compiling with the typescript generator
    const { requests, schemas } = compile(document);

    // THEN the output matches the snapshot
    expect(requests).toMatchSnapshot();
    expect(schemas).toMatchSnapshot();
  });

  it('compiles the expanded petstore schema', () => {
    // GIVEN the expanded petstore OpenAPI schema
    const document = readFileSync('fixtures/petstore-expanded.yaml').toString();

    // WHEN compiling with the typescript generator
    const { requests, schemas } = compile(document);

    // THEN the output matches the snapshot
    expect(requests).toMatchSnapshot();
    expect(schemas).toMatchSnapshot();
  });

  it('compiles the uspto schema', () => {
    // GIVEN the uspto OpenAPI schema
    const document = readFileSync('fixtures/uspto.yaml').toString();

    // WHEN compiling with the typescript generator
    const { requests, schemas } = compile(document);

    // THEN the output matches the snapshot
    expect(requests).toMatchSnapshot();
    expect(schemas).toMatchSnapshot();
  });
});
