import { readFileSync } from 'fs';
import { compileUsingTypescript } from 'generators/typescript/generator';
import { parseYaml } from 'parser/parser';
import { compose } from 'ramda';

// TESTEE function
const compile = compose(compileUsingTypescript, parseYaml);

describe('Typescript Generator Integration', () => {
  it('compiles the link example schema', () => {
    // GIVEN the link example OpenAPI schema
    const document = readFileSync('test/link-example.yaml').toString();

    // WHEN compiling with the typescript generator
    const { requests, schemas } = compile(document);

    // THEN the output matches the snapshot
    expect(requests).toMatchSnapshot();
    expect(schemas).toMatchSnapshot();
  });

  it('compiles the petstore schema', () => {
    // GIVEN the petstore OpenAPI schema
    const document = readFileSync('test/petstore.yaml').toString();

    // WHEN compiling with the typescript generator
    const { requests, schemas } = compile(document);

    // THEN the output matches the snapshot
    expect(requests).toMatchSnapshot();
    expect(schemas).toMatchSnapshot();
  });

  it('compiles the expanded petstore schema', () => {
    // GIVEN the expanded petstore OpenAPI schema
    const document = readFileSync('test/petstore-expanded.yaml').toString();

    // WHEN compiling with the typescript generator
    const { requests, schemas } = compile(document);

    // THEN the output matches the snapshot
    expect(requests).toMatchSnapshot();
    expect(schemas).toMatchSnapshot();
  });

  it('compiles the uspto schema', () => {
    // GIVEN the uspto OpenAPI schema
    const document = readFileSync('test/uspto.yaml').toString();

    // WHEN compiling with the typescript generator
    const { requests, schemas } = compile(document);

    // THEN the output matches the snapshot
    expect(requests).toMatchSnapshot();
    expect(schemas).toMatchSnapshot();
  });
});
