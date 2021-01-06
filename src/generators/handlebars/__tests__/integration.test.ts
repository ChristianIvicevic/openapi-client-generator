import { readFileSync } from 'fs';
import { compileUsingHandlebars } from 'generators/handlebars/generator';
import { parseYaml } from 'parser/parser';
import { compose } from 'ramda';

// TESTEE function
const compile = compose(compileUsingHandlebars, parseYaml);

describe('Handlebars Generator Integration', () => {
  it('compiles the link example schema', async () => {
    // GIVEN the link example OpenAPI schema
    const document = readFileSync('test/link-example.yaml').toString();

    // WHEN compiling with the handlebars generator
    const { requests, schemas } = await compile(document);

    // THEN the output matches the snapshot
    expect(requests).toMatchSnapshot();
    expect(schemas).toMatchSnapshot();
  });

  it('compiles the petstore schema', async () => {
    // GIVEN the petstore OpenAPI schema
    const document = readFileSync('test/petstore.yaml').toString();

    // WHEN compiling with the handlebars generator
    const { requests, schemas } = await compile(document);

    // THEN the output matches the snapshot
    expect(requests).toMatchSnapshot();
    expect(schemas).toMatchSnapshot();
  });

  it('compiles the expanded petstore schema', async () => {
    // GIVEN the expanded petstore OpenAPI schema
    const document = readFileSync('test/petstore-expanded.yaml').toString();

    // WHEN compiling with the handlebars generator
    const { requests, schemas } = await compile(document);

    // THEN the output matches the snapshot
    expect(requests).toMatchSnapshot();
    expect(schemas).toMatchSnapshot();
  });

  it('compiles the uspto schema', async () => {
    // GIVEN the uspto OpenAPI schema
    const document = readFileSync('test/uspto.yaml').toString();

    // WHEN compiling with the handlebars generator
    const { requests, schemas } = await compile(document);

    // THEN the output matches the snapshot
    expect(requests).toMatchSnapshot();
    expect(schemas).toMatchSnapshot();
  });
});
