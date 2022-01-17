# Changelog

## [3.0.0](https://www.github.com/ChristianIvicevic/openapi-client-generator/compare/v2.5.7...v3.0.0) (2022-01-17)


### ⚠ BREAKING CHANGES

* OpenAPI specs of version 3.0 are no longer guaranteed to be understood by the parser and it will only expect version 3.1 specifications moving forward.

### Features

* introduce api paths helper providing functions to reference api paths ([828d735](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/828d735099f7a66f82eb4219094dfc7e9520af81))


### Bug Fixes

* add automatic operation id coercion for api paths fixing illegal function names ([8332bec](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/8332bec7dab710ebd9778904a33f6f0066699461))
* **deps:** update dependency eslint-config-airbnb to v19 ([7a28e18](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/7a28e18762ee7e75c8fcfbac3a452a99e140791f))
* **deps:** update dependency eslint-config-airbnb to v19.0.1 ([e36b12c](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/e36b12c17a63d041b455dd8501eb17520242798d))
* **deps:** update dependency eslint-config-airbnb to v19.0.2 ([038b975](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/038b975f26a8abb5edd319ae399e16865229008e))
* **deps:** update dependency eslint-config-airbnb to v19.0.4 ([2037272](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/2037272e87f2afb8815bad4589029f8c05a61ebb))
* **deps:** update dependency openapi-types to v10 ([a0159b1](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/a0159b14b70d673d1b6db3b17ba47fb380b6d1ac))
* **deps:** update dependency openapi-types to v9.3.0 ([fe2fadd](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/fe2faddf3aae8f9535d54f82c58f89f6bdd04d31))
* **deps:** update dependency openapi-types to v9.3.1 ([2c3c3a2](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/2c3c3a27c44813812b6c16a95a2b795882cf3604))
* **deps:** update dependency prettier to v2.4.0 ([89997bb](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/89997bb9a08d54921f6dcba8adcab76be7599de7))
* **deps:** update dependency prettier to v2.4.1 ([17b303e](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/17b303efe6b77f7acc900a80f7fa4b0d1b191da7))
* **deps:** update dependency prettier to v2.5.0 ([6af4bce](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/6af4bcea1b1ef74b34483d371b688981449876ee))
* **deps:** update dependency prettier to v2.5.1 ([dd46b4e](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/dd46b4e9ef8e2727d8b2b0c07fe6fdfebe312f0e))
* **deps:** update dependency ramda to v0.27.2 ([1b2068e](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/1b2068ec4d2dee56a3cd80d1b9f8ed4a079b389b))
* **deps:** update dependency winston to v3.4.0 ([5c09f7a](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/5c09f7a374f8a1b7ec2f557dc96c98155112d37d))
* **deps:** update dependency yargs to v17.2.0 ([548b2b6](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/548b2b6b56099ecf3401d55e0a006f66a1fd1944))
* **deps:** update dependency yargs to v17.2.1 ([8f275da](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/8f275daf47f8902d54e5318e34e028704c5fd990))
* **deps:** update dependency yargs to v17.3.0 ([b49360e](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/b49360ee2ba2cf9e999a1f83cf7586528176f17e))
* **deps:** update dependency yargs to v17.3.1 ([73ba62d](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/73ba62d8ab741403f280bb67ef9b4027a7ead1ce))


### Code Refactoring

* replace previous code generation with a more robust functional approach ([9be1c07](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/9be1c07c7a8029d84edd036fccb52f01b514a1e3))

### [2.5.7](https://www.github.com/ChristianIvicevic/openapi-client-generator/compare/v2.5.6...v2.5.7) (2021-08-25)


### Bug Fixes

* **deps:** update dependency openapi-types to v9.0.3 ([77bef31](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/77bef3177a685b192ce8a7aef233fc988abdce34))
* **deps:** update dependency openapi-types to v9.1.0 ([23b1587](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/23b158771d1e3d096b34c3041d6567567ebab1c1))
* **deps:** update dependency openapi-types to v9.2.0 ([d7a7f7a](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/d7a7f7af713609f0048b6d75e1a6be0040568581))
* **deps:** update dependency prettier to v2.3.1 ([edeefb0](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/edeefb0a53591bb447a34b667e6963329b79e8ec))
* **deps:** update dependency prettier to v2.3.2 ([aec32b2](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/aec32b267177969d6f77e71dacae9bb844076ece))
* **deps:** update dependency tslib to v2.3.0 ([144c391](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/144c391412fd3565a7aee6038949646c89a8f007))
* **deps:** update dependency tslib to v2.3.1 ([afdfcaa](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/afdfcaa05a518fd38fcdaf4ed6b823e1088f0613))
* **deps:** update dependency yargs to v17.1.0 ([447cfa5](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/447cfa5cfd57f1ce4f039ece8513b379c336ff43))
* **deps:** update dependency yargs to v17.1.1 ([274febf](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/274febf0552d0b00fa80387ef506159ee458c1d2))

### [2.5.6](https://www.github.com/ChristianIvicevic/openapi-client-generator/compare/v2.5.5...v2.5.6) (2021-05-26)


### Bug Fixes

* **deps:** update dependency openapi-types to v9 ([099c1c7](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/099c1c76550e97d7ea7a95fc515337c49864404f))
* **deps:** update dependency prettier to v2.3.0 ([05468a3](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/05468a3eae8edfb04fe9db9d5300d4f6cd854e65))
* **deps:** update dependency yargs to v17 ([ce96a3e](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/ce96a3e42fdf02db842fd58691452381802ea660))

### [2.5.5](https://www.github.com/ChristianIvicevic/openapi-client-generator/compare/v2.5.4...v2.5.5) (2021-04-09)


### Bug Fixes

* **deps:** update dependency openapi-types to v8 ([9c783f5](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/9c783f5981d41a89484b41bb161965aed2ae6141))
* **deps:** update dependency tslib to v2.2.0 ([1950af0](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/1950af0476497e540811b506f000fc70adbb64bc))
* **deps:** update dependency yaml to v1.10.1 ([6320119](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/63201195c510ccb7d3452ea819fec955c3f828fb))
* **deps:** update dependency yaml to v1.10.2 ([b511c1b](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/b511c1b35986015c9a1cda103d6cb386edae0429))
* enable new prettier config ([880e843](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/880e843f9139ddbdb4d29babce09ff274ddd8f72))

### [2.5.4](https://www.github.com/ChristianIvicevic/openapi-client-generator/compare/v2.5.3...v2.5.4) (2021-02-17)


### Bug Fixes

* prevent importing unused transitive type references ([880e362](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/880e3625d731d8bf3683ab1657ae1645268f5a0b))

### [2.5.3](https://www.github.com/ChristianIvicevic/openapi-client-generator/compare/v2.5.2...v2.5.3) (2021-01-18)


### Performance Improvements

* remove duplicate declaration files from package to reduce overall size ([b1da679](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/b1da6790a01a2543c5bec451ccfa8a4ebf2e8410))

### [2.5.2](https://www.github.com/ChristianIvicevic/openapi-client-generator/compare/v2.5.1...v2.5.2) (2021-01-15)


### Bug Fixes

* resolve ambiguous object and array types without explicit type property ([e8c7bea](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/e8c7bea110ee5ebd8f80bc751c066483c20e40bf))

### [2.5.1](https://www.github.com/ChristianIvicevic/openapi-client-generator/compare/v2.5.0...v2.5.1) (2021-01-14)


### Bug Fixes

* promote tslib to an actual dependency to fix silent build errors ([26d4725](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/26d47258f18b7602991d88088063197e773d038f))

## [2.5.0](https://www.github.com/ChristianIvicevic/openapi-client-generator/compare/v2.4.1...v2.5.0) (2021-01-14)


### Features

* add CLI and API compile option to customize names of generated files ([ea38835](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/ea38835f0d040553a1b49b576ca280cbe341f88f))
* expose a properly documented compile method for programmatic api usage ([d5717d2](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/d5717d228c6ac159a857779f6583362b0fc80fb4))

### [2.4.1](https://www.github.com/ChristianIvicevic/openapi-client-generator/compare/v2.4.0...v2.4.1) (2021-01-13)


### Bug Fixes

* **deps:** update dependency openapi-types to v7.2.3 ([6c0e0eb](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/6c0e0ebce3bd26b7b336f9ba1ad9e5c418301b45))

## [2.4.0](https://www.github.com/ChristianIvicevic/openapi-client-generator/compare/v2.3.0...v2.4.0) (2021-01-13)


### Features

* add index signature intersection for schemas with additionalProperties ([8862b3a](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/8862b3a7a9e1d5ba749368e529a28e89819160dd))
* enforce request body types to adhere to the required property in their definition ([f9b4e96](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/f9b4e969d99081af3ebf80aac027cfad2b6d0d79))

## [2.3.0](https://www.github.com/ChristianIvicevic/openapi-client-generator/compare/v2.2.0...v2.3.0) (2021-01-09)


### Features

* add generation of jsdoc comments for path and query parameters ([f56fd91](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/f56fd917679f7b6917ae529f3471b14dd7b11372))

## [2.2.0](https://www.github.com/ChristianIvicevic/openapi-client-generator/compare/v2.1.0...v2.2.0) (2021-01-09)


### Features

* components such as responses, request bodies and deeply nested schemas are now supported ([65c1f42](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/65c1f42340ccb6f355d8092e0f59c47f2f35e434))

## [2.1.0](https://www.github.com/ChristianIvicevic/openapi-client-generator/compare/v2.0.0...v2.1.0) (2021-01-08)


### Features

* add code generation using the actual typescript compiler ([ae6a881](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/ae6a881974b412b36c05433b0fc42754cd4af6b7))

## [2.0.0](https://www.github.com/ChristianIvicevic/openapi-client-generator/compare/v1.0.0...v2.0.0) (2021-01-06)


### ⚠ BREAKING CHANGES

* Command line arguments for the CLI have been adjusted and the CLI no longer creates a single file and writes two separate files for requests and schema types.

### Features

* add schema type generation for named schemas ([f8c6388](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/f8c638839b892582c570eb4785e162e6ed1b0b18))


### Bug Fixes

* **deps:** update dependency openapi-types to v7.2.2 ([#11](https://www.github.com/ChristianIvicevic/openapi-client-generator/issues/11)) ([3a2df4b](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/3a2df4bfc0be8300481f6b902ec7a17e4e0949f1))

## 1.0.0 (2020-12-29)


### Features

* initial public commit ([e70d2e8](https://www.github.com/ChristianIvicevic/openapi-client-generator/commit/e70d2e84d6fed63fa4c48a370a812560aeb2b27a))
