# Deprecated

> I have decided to stop working on this package for the time being, as such it will no longer be updated.

## OpenAPI Client Generator

![Logo](./docs/logo.png)

> **Framework-agnostic OpenAPI client generator for Typescript**

![Tests](https://github.com/ChristianIvicevic/openapi-client-generator/workflows/Tests/badge.svg)
[![codecov](https://codecov.io/gh/ChristianIvicevic/openapi-client-generator/branch/main/graph/badge.svg?token=JB66SCDW2Q)](https://codecov.io/gh/ChristianIvicevic/openapi-client-generator)
[![npm](https://img.shields.io/npm/v/@ivicevic/openapi-client-generator)](https://www.npmjs.com/package/@ivicevic/openapi-client-generator)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Consuming a REST API can be needlessly complicated at times, especially when having to manually maintain client code, paths etc.
In one of our projects at work we relied on [`restful-react`](https://github.com/contiamo/restful-react) to generate React components and hooks based on an OpenAPI schema which was really convenient in the beginning.
However `restful-react` can be too sophisticated at times and restrictive which we noticed as our application handles a lot of dynamic data that cannot be easily expressed by the created hooks.

Eventually we ran into the scenario where sometimes we'd really just like to send a simple request without any complex wrappers or hooks, yet have those client methods be automatically generated.
Therefore this command line tool has been created to simplify maintaining reliable and up to date client code in our frontend.

## Overview

The `openapi-client-generator` will parse an OpenAPI V3.1 schema file and create function for each operation and their respective schemas yielding the following output:

```typescript
/**
 * Endpoint under test.
 * @param parameters The HTTP request (path, query, header and cookie)
 * parameters sent to the server.
 * @param requestBody The HTTP request content sent to the server.
 * @param config A custom `AxiosRequestConfig` object that is used to override
 * the global configuration for this request. This value is optional.
 */
export const postOperation = async (
  parameters: {
    /**
     * Path parameter under test.
     */
    readonly pathParameter: string;
    /**
     * Query parameter under test.
     */
    readonly queryParameter?: number;
  },
  requestBody: TestRequestBodyType,
  config?: AxiosRequestConfig,
) =>
  axios.post<TestResponseType>(
    `/api/test/${parameters.pathParameter}`,
    requestBody,
    {
      ...config,
      params: {
        query: parameters.queryParameter,
      },
    }
  );
```

Refer to the snapshots in the test files located in the `test` directory for further details of what the generated output will look like.

## Installation

We suggest installing the tool locally (instead of globally) into your project by issuing the following command using `yarn`
```
yarn add @ivicevic/openapi-client-generator -D
```
or the following if you use `npm`
```
npm i @ivicevic/openapi-client-generator --save-dev
```

### Peer dependencies

Be aware that [`axios`](https://www.npmjs.com/package/axios) is a peer dependency and has to be installed as well.

## Usage

### Shell

```
Usage: openapi-client-generator -i [INPUT] -o [OUTPUT]

Options:
      --help      Outputs this message                                 [boolean]
      --version   Show version number                                  [boolean]
  -i, --input     Input file                                 [string] [required]
  -o, --output    Output folder                              [string] [required]
  -r, --requests  File name to write generated request methods to
                                               [string] [default: "requests.ts"]
  -s, --schemas   File name to write generated schemas to
                                                [string] [default: "schemas.ts"]
  -p, --paths     File name to write generated API paths to
                                                  [string] [default: "paths.ts"]
  -v, --verbose   Run with verbose logging                             [boolean]
  -d, --debug     Run with even more verbose logging                   [boolean]
```

In our project we run the CLI with the following command:

```
openapi-client-generator -i ./submodules/schema/v2.yaml -o ./src/api
```

This creates two files `src/api/requests.ts` and `src/api/schemas.ts` based on the supplied YAML file.
We don't recommend adding those output files to your repository as they can cause verbose commits and can be easily generated from the schema file, e.g. in your pipeline or locally.

### Programmatic

This package is intended to be used primarily as a CLI, however its core method `generateSourceFilesOrThrow` has been exposed to be used in custom scripts and workflows.
You can import it as follows:

```ts
import { generateSourceFilesOrThrow } from '@ivicevic/openapi-client-generator';
```

Refer to the documentation at [`src/index.ts`](./src/index.ts) or usage at [`src/cli.ts`](./src/cli.ts) for further details.

## Caveats, missing features and minor issues

* The generator expects your input schema to match the specification of version 3.1.
As such any previous features that have been deprecated such as nullable types have to follow the rules of the new version.
* The generator is not able to fully validate whether a given input schema is a valid OpenAPI 3.1 schema.
It will only validate basic invariants such as operation ids being defined or responses not being undefined.
* In the current version only request bodies for the media type `application/json` are supported.
As such the generator may transform operations using other media types into invalid Typescript code.
* Even though the OpenAPI spec doesn't restrict naming conventions the generator will coerce certain names in order to be able to produce valid Typescript code.
This includes schema names and operation ids that will be pascal and camel-cased respectively.
However, path and query parameters cannot be safely coerced without breaking the functionality and as such you are required to use valid Typescript identifiers for those, e.g. camel or snake-case but not kebab-case.
* Certain errors during generation such as referencing components that don't exist may be silently ignored since the error handling logic isn't fully implemented yet.

## Feature roadmap

The order of these features does not reflect any priorization.

* Introduce `io-ts` for runtime validation of received responses
* Introduce automatically generated mappers for responses for when an API uses snake case but you prefer camel case in your source code

## Contribution

All contributions are welcome, be it documentation, bug reports and issues or code contributions.

Since we don't fully support all features of the OpenAPI spec it is really helpful if you report any issues with the respective spec files that cause unexpected behavior so that we can fix them.

To contribute to the code clone the repository, use the Node version denoted in the `.nvmrc` file (most likely by running `nvm use`), install its dependencies using `yarn install` (we are using Yarn 2) and use the following commands as necessary:

* The library and CLI are compiled using either `yarn build` or `yarn watch` for incremental compilation.
* Tests are written using Jest and can be executed via `yarn test --coverage`.
* Lint your code using `yarn lint` and keep PRs small and concise.
* Commits have to follow the [conventional commits](https://www.conventionalcommits.org/) standard.
  For that purpose you can run `yarn cm` for interactive commits using `commitizen`, otherwise `commitlint` will lint your commit messages using `husky`.

## License

The code in this project is released under the [MIT License](./LICENSE).
