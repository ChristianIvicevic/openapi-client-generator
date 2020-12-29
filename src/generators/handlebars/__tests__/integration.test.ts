import { compileUsingHandlebars } from 'generators/handlebars/generator';
import { parseYaml } from 'parser/parser';
import { compose } from 'ramda';
import { petstoreSchema } from 'utils/petstore';

// TESTEE function
const compile = compose(compileUsingHandlebars, parseYaml);

describe('Handlebars Generator Integration', () => {
  it('compiles the petstore schema', async () => {
    // GIVEN the petstore OpenAPI schema
    const document = petstoreSchema;

    // WHEN compiling with the handlebars generator
    const actualCompiledOutput = await compile(document);

    // THEN the output matches the snapshot
    expect(actualCompiledOutput).toMatchSnapshot();
  });
});
