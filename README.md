# `openapi-client-generator`

![Logo](./docs/logo.png)

> **Simple Typescript code generator based on an OpenAPI V3 schema**

![Tests](https://github.com/ChristianIvicevic/openapi-client-generator/workflows/Tests/badge.svg)
[![codecov](https://codecov.io/gh/ChristianIvicevic/openapi-client-generator/branch/main/graph/badge.svg?token=JB66SCDW2Q)](https://codecov.io/gh/ChristianIvicevic/openapi-client-generator)
[![npm](https://img.shields.io/npm/v/@ivicevic/openapi-client-generator)](https://www.npmjs.com/package/@ivicevic/openapi-client-generator)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Consuming a REST API can be needlessly complicated at times, especially when having to manually maintain client code, paths etc.
In one of our projects at work we relied on [`restful-react`](https://github.com/contiamo/restful-react) to generate React components and hooks based on an OpenAPI schema which was really nice.
However `restful-react` can be too sophisticated at times and restrictive which we noticed as our application handles a lot of dynamic data that cannot be easily expressed by the created hooks.

Eventually we ran into the scenario where sometimes we'd really just like to send a simple request without any complex wrappers or hooks, yet have those client methods be automatically generated.
Therefore this command line tool has been created to simplify maintaining reliable and up to date client code in our frontend.

## Overview

The `openapi-client-generator` will parse an OpenAPI V3 schema file and create concise methods for each operation and their respective schemas yielding methods that look as follows:

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

Be aware that [`axios`](https://www.npmjs.com/package/axios) is a peer dependency and has to be installed as well.

## CLI usage

The CLI command usage looks as follows where `INPUT` is the OpenAPI schema file and `OUTPUT` where the generated files are written to:

```
openapi-client-generator --input [INPUT] --output [OUTPUT]
```

When executing the CLI two files will be generated, namely `requests.ts` and `schemas.ts` in the specified output folder.

In our project we run the CLI with the following command:

```
openapi-client-generator -i ./submodules/schema/v2.yaml -o ./src/api
```

To display more detailed log outputs you can append the `--verbose` or `--debug` flags to any command to debug any issues.

For more help run the command `openapi-client-generator --help` to show a list of all available arguments.


## API usage

This package is intended to be used as a CLI and it is discouraged to use it via its API as its public methods haven't been properly exposed.
If you really want to walk down that dark path nonetheless refer to the `src/cli.ts` file until we establish a stable API.

## Feature roadmap

The order of these features does not reflect any priorization.

* Add `fetch` as an alternative to `axios`
* Resolving array types that include either `items.allOf`, `items.oneOf` or `items.enum`
* Default values of parameters and objects
* Improved summary and description parsing to generate better JSDoc

## Contribution

All contributions are welcome, be it documentation, bug reports and issues or code contributions.

Since we don't fully support all features of the OpenAPI spec it is really helpful if you report any issues with the respective spec files that cause unexpected behavior so that we can fix them.

To contribute to the code clone the repository, use the Node version denoted in the `.nvmrc` file (most likely by running `nvm use`), install its dependencies using `yarn install` (we are using Yarn 2) and use the following commands as necessary:

* The library and CLI are compiled using either
  * `yarn build:main`
  * `yarn watch:build`
* Tests are written using Jest and can be executed via either
  * `yarn test`
  * `yarn test:coverage`
* Test your code using `yarn lint` and keep PRs small and concise
* Commits have to follow the [conventional commits](https://www.conventionalcommits.org/) standard.
  For that purpose you can run `yarn cm` for interactive commits using `commitizen`, otherwise `commitlint` will lint your commit messages using `husky`

## License

The code in this project is released under the [MIT License](./LICENSE).
