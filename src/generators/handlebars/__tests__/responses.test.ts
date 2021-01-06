import { compileUsingHandlebars } from 'generators/handlebars/generator';
import type { OpenAPIV3 } from 'openapi-types';
import { parseYaml } from 'parser/parser';
import { compose } from 'ramda';
import { createTestDocumentWithPaths } from 'utils/testing';

// TESTEE function
const compile = compose(compileUsingHandlebars, parseYaml);

describe('Handlebars Generator Requests', () => {
  describe('Operations with empty responses', () => {
    it('compiles a GET operation', async () => {
      // GIVEN an OpenAPI schema that contains a single GET endpoint with an
      // empty response
      const document = createTestDocumentWithPaths({
        '/api/sample': {
          get: {
            operationId: 'getSample',
            responses: {
              204: {
                description: 'No content',
              },
            },
            summary: 'Endpoint under test',
          } as OpenAPIV3.OperationObject,
        },
      });

      // WHEN compiling with the handlebars generator
      const { requests } = await compile(document);

      // THEN the output matches the snapshot
      expect(requests).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */

        import axios, { AxiosRequestConfig } from 'axios';

        /**
         * Endpoint under test
         * @param config Overrides of the axios configuration for this request
         */
        export const getSample = async (config?: AxiosRequestConfig) =>
          axios.get<void>(\`/api/sample\`, config);
        "
      `);
    });

    it('compiles a POST operation', async () => {
      // GIVEN an OpenAPI schema that contains a single POST endpoint with an
      // empty response
      const document = createTestDocumentWithPaths({
        '/api/sample': {
          post: {
            operationId: 'postSample',
            responses: {
              204: {
                description: 'No content',
              },
            },
            summary: 'Endpoint under test',
          } as OpenAPIV3.OperationObject,
        },
      });

      // WHEN compiling with the handlebars generator
      const { requests } = await compile(document);

      // THEN the output matches the snapshot
      expect(requests).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */

        import axios, { AxiosRequestConfig } from 'axios';

        /**
         * Endpoint under test
         * @param config Overrides of the axios configuration for this request
         */
        export const postSample = async (config?: AxiosRequestConfig) =>
          axios.post<void>(\`/api/sample\`, undefined, config);
        "
      `);
    });

    it('compiles a PUT operation', async () => {
      // GIVEN an OpenAPI schema that contains a single PUT endpoint with an
      // empty response
      const document = createTestDocumentWithPaths({
        '/api/sample': {
          put: {
            operationId: 'putSample',
            responses: {
              204: {
                description: 'No content',
              },
            },
            summary: 'Endpoint under test',
          } as OpenAPIV3.OperationObject,
        },
      });

      // WHEN compiling with the handlebars generator
      const { requests } = await compile(document);

      // THEN the output matches the snapshot
      expect(requests).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */

        import axios, { AxiosRequestConfig } from 'axios';

        /**
         * Endpoint under test
         * @param config Overrides of the axios configuration for this request
         */
        export const putSample = async (config?: AxiosRequestConfig) =>
          axios.put<void>(\`/api/sample\`, undefined, config);
        "
      `);
    });

    it('compiles a DELETE operation', async () => {
      // GIVEN an OpenAPI schema that contains a single DELETE endpoint with an
      // empty response
      const document = createTestDocumentWithPaths({
        '/api/sample': {
          delete: {
            operationId: 'deleteSample',
            responses: {
              204: {
                description: 'No content',
              },
            },
            summary: 'Endpoint under test',
          } as OpenAPIV3.OperationObject,
        },
      });

      // WHEN compiling with the handlebars generator
      const { requests } = await compile(document);

      // THEN the output matches the snapshot
      expect(requests).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */

        import axios, { AxiosRequestConfig } from 'axios';

        /**
         * Endpoint under test
         * @param config Overrides of the axios configuration for this request
         */
        export const deleteSample = async (config?: AxiosRequestConfig) =>
          axios.delete<void>(\`/api/sample\`, config);
        "
      `);
    });
  });

  describe('Operations with a response content schema $ref', () => {
    it('compiles a GET operation', async () => {
      // GIVEN an OpenAPI schema that contains a single GET endpoint with a
      // response content schema $ref
      const document = createTestDocumentWithPaths({
        '/api/sample': {
          get: {
            operationId: 'getSample',
            responses: {
              204: {
                description: 'No content',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/SampleDto',
                    },
                  },
                },
              },
            },
            summary: 'Endpoint under test',
          } as OpenAPIV3.OperationObject,
        },
      });

      // WHEN compiling with the handlebars generator
      const { requests } = await compile(document);

      // THEN the output matches the snapshot
      expect(requests).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */

        import axios, { AxiosRequestConfig } from 'axios';
        import { SampleDto } from './types';

        /**
         * Endpoint under test
         * @param config Overrides of the axios configuration for this request
         */
        export const getSample = async (config?: AxiosRequestConfig) =>
          axios.get<SampleDto>(\`/api/sample\`, config);
        "
      `);
    });

    it('compiles a POST operation', async () => {
      // GIVEN an OpenAPI schema that contains a single POST endpoint with a
      // response content schema $ref
      const document = createTestDocumentWithPaths({
        '/api/sample': {
          post: {
            operationId: 'postSample',
            responses: {
              204: {
                description: 'No content',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/SampleDto',
                    },
                  },
                },
              },
            },
            summary: 'Endpoint under test',
          } as OpenAPIV3.OperationObject,
        },
      });

      // WHEN compiling with the handlebars generator
      const { requests } = await compile(document);

      // THEN the output matches the snapshot
      expect(requests).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */

        import axios, { AxiosRequestConfig } from 'axios';
        import { SampleDto } from './types';

        /**
         * Endpoint under test
         * @param config Overrides of the axios configuration for this request
         */
        export const postSample = async (config?: AxiosRequestConfig) =>
          axios.post<SampleDto>(\`/api/sample\`, undefined, config);
        "
      `);
    });

    it('compiles a PUT operation', async () => {
      // GIVEN an OpenAPI schema that contains a single PUT endpoint with a
      // response content schema $ref
      const document = createTestDocumentWithPaths({
        '/api/sample': {
          put: {
            operationId: 'putSample',
            responses: {
              204: {
                description: 'No content',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/SampleDto',
                    },
                  },
                },
              },
            },
            summary: 'Endpoint under test',
          } as OpenAPIV3.OperationObject,
        },
      });

      // WHEN compiling with the handlebars generator
      const { requests } = await compile(document);

      // THEN the output matches the snapshot
      expect(requests).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */

        import axios, { AxiosRequestConfig } from 'axios';
        import { SampleDto } from './types';

        /**
         * Endpoint under test
         * @param config Overrides of the axios configuration for this request
         */
        export const putSample = async (config?: AxiosRequestConfig) =>
          axios.put<SampleDto>(\`/api/sample\`, undefined, config);
        "
      `);
    });

    it('compiles a DELETE operation', async () => {
      // GIVEN an OpenAPI schema that contains a single DELETE endpoint with a
      // response content schema $ref
      const document = createTestDocumentWithPaths({
        '/api/sample': {
          delete: {
            operationId: 'deleteSample',
            responses: {
              204: {
                description: 'No content',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/SampleDto',
                    },
                  },
                },
              },
            },
            summary: 'Endpoint under test',
          } as OpenAPIV3.OperationObject,
        },
      });

      // WHEN compiling with the handlebars generator
      const { requests } = await compile(document);

      // THEN the output matches the snapshot
      expect(requests).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */

        import axios, { AxiosRequestConfig } from 'axios';
        import { SampleDto } from './types';

        /**
         * Endpoint under test
         * @param config Overrides of the axios configuration for this request
         */
        export const deleteSample = async (config?: AxiosRequestConfig) =>
          axios.delete<SampleDto>(\`/api/sample\`, config);
        "
      `);
    });
  });

  describe('Operations with a response $ref array', () => {
    it('compiles a GET operation', async () => {
      // GIVEN an OpenAPI schema that contains a single GET endpoint with a
      // response $ref array
      const document = createTestDocumentWithPaths({
        '/api/sample': {
          get: {
            operationId: 'getSample',
            responses: {
              204: {
                description: 'No content',
                content: {
                  'application/json': {
                    schema: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/SampleDto',
                      },
                    },
                  },
                },
              },
            },
            summary: 'Endpoint under test',
          } as OpenAPIV3.OperationObject,
        },
      });

      // WHEN compiling with the handlebars generator
      const { requests } = await compile(document);

      // THEN the output matches the snapshot
      expect(requests).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */

        import axios, { AxiosRequestConfig } from 'axios';
        import { SampleDto } from './types';

        /**
         * Endpoint under test
         * @param config Overrides of the axios configuration for this request
         */
        export const getSample = async (config?: AxiosRequestConfig) =>
          axios.get<readonly SampleDto[]>(\`/api/sample\`, config);
        "
      `);
    });

    it('compiles a POST operation', async () => {
      // GIVEN an OpenAPI schema that contains a single POST endpoint with a
      // response $ref array
      const document = createTestDocumentWithPaths({
        '/api/sample': {
          post: {
            operationId: 'postSample',
            responses: {
              204: {
                description: 'No content',
                content: {
                  'application/json': {
                    schema: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/SampleDto',
                      },
                    },
                  },
                },
              },
            },
            summary: 'Endpoint under test',
          } as OpenAPIV3.OperationObject,
        },
      });

      // WHEN compiling with the handlebars generator
      const { requests } = await compile(document);

      // THEN the output matches the snapshot
      expect(requests).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */

        import axios, { AxiosRequestConfig } from 'axios';
        import { SampleDto } from './types';

        /**
         * Endpoint under test
         * @param config Overrides of the axios configuration for this request
         */
        export const postSample = async (config?: AxiosRequestConfig) =>
          axios.post<readonly SampleDto[]>(\`/api/sample\`, undefined, config);
        "
      `);
    });

    it('compiles a PUT operation', async () => {
      // GIVEN an OpenAPI schema that contains a single PUT endpoint with a
      // response $ref array
      const document = createTestDocumentWithPaths({
        '/api/sample': {
          put: {
            operationId: 'putSample',
            responses: {
              204: {
                description: 'No content',
                content: {
                  'application/json': {
                    schema: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/SampleDto',
                      },
                    },
                  },
                },
              },
            },
            summary: 'Endpoint under test',
          } as OpenAPIV3.OperationObject,
        },
      });

      // WHEN compiling with the handlebars generator
      const { requests } = await compile(document);

      // THEN the output matches the snapshot
      expect(requests).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */

        import axios, { AxiosRequestConfig } from 'axios';
        import { SampleDto } from './types';

        /**
         * Endpoint under test
         * @param config Overrides of the axios configuration for this request
         */
        export const putSample = async (config?: AxiosRequestConfig) =>
          axios.put<readonly SampleDto[]>(\`/api/sample\`, undefined, config);
        "
      `);
    });

    it('compiles a DELETE operation', async () => {
      // GIVEN an OpenAPI schema that contains a single DELETE endpoint with a
      // response $ref array
      const document = createTestDocumentWithPaths({
        '/api/sample': {
          delete: {
            operationId: 'deleteSample',
            responses: {
              204: {
                description: 'No content',
                content: {
                  'application/json': {
                    schema: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/SampleDto',
                      },
                    },
                  },
                },
              },
            },
            summary: 'Endpoint under test',
          } as OpenAPIV3.OperationObject,
        },
      });

      // WHEN compiling with the handlebars generator
      const { requests } = await compile(document);

      // THEN the output matches the snapshot
      expect(requests).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */

        import axios, { AxiosRequestConfig } from 'axios';
        import { SampleDto } from './types';

        /**
         * Endpoint under test
         * @param config Overrides of the axios configuration for this request
         */
        export const deleteSample = async (config?: AxiosRequestConfig) =>
          axios.delete<readonly SampleDto[]>(\`/api/sample\`, config);
        "
      `);
    });
  });

  describe('Operations with an inline response array', () => {
    it('compiles a GET operation', async () => {
      // GIVEN an OpenAPI schema that contains a single GET endpoint with an
      // inline response array
      const document = createTestDocumentWithPaths({
        '/api/sample': {
          get: {
            operationId: 'getSample',
            responses: {
              204: {
                description: 'No content',
                content: {
                  'application/json': {
                    schema: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
            summary: 'Endpoint under test',
          } as OpenAPIV3.OperationObject,
        },
      });

      // WHEN compiling with the handlebars generator
      const { requests } = await compile(document);

      // THEN the output matches the snapshot
      expect(requests).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */

        import axios, { AxiosRequestConfig } from 'axios';

        /**
         * Endpoint under test
         * @param config Overrides of the axios configuration for this request
         */
        export const getSample = async (config?: AxiosRequestConfig) =>
          axios.get<readonly string[]>(\`/api/sample\`, config);
        "
      `);
    });

    it('compiles a POST operation', async () => {
      // GIVEN an OpenAPI schema that contains a single POST endpoint with an
      // inline response array
      const document = createTestDocumentWithPaths({
        '/api/sample': {
          post: {
            operationId: 'postSample',
            responses: {
              204: {
                description: 'No content',
                content: {
                  'application/json': {
                    schema: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
            summary: 'Endpoint under test',
          } as OpenAPIV3.OperationObject,
        },
      });

      // WHEN compiling with the handlebars generator
      const { requests } = await compile(document);

      // THEN the output matches the snapshot
      expect(requests).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */

        import axios, { AxiosRequestConfig } from 'axios';

        /**
         * Endpoint under test
         * @param config Overrides of the axios configuration for this request
         */
        export const postSample = async (config?: AxiosRequestConfig) =>
          axios.post<readonly string[]>(\`/api/sample\`, undefined, config);
        "
      `);
    });

    it('compiles a PUT operation', async () => {
      // GIVEN an OpenAPI schema that contains a single PUT endpoint with an
      // inline response array
      const document = createTestDocumentWithPaths({
        '/api/sample': {
          put: {
            operationId: 'putSample',
            responses: {
              204: {
                description: 'No content',
                content: {
                  'application/json': {
                    schema: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
            summary: 'Endpoint under test',
          } as OpenAPIV3.OperationObject,
        },
      });

      // WHEN compiling with the handlebars generator
      const { requests } = await compile(document);

      // THEN the output matches the snapshot
      expect(requests).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */

        import axios, { AxiosRequestConfig } from 'axios';

        /**
         * Endpoint under test
         * @param config Overrides of the axios configuration for this request
         */
        export const putSample = async (config?: AxiosRequestConfig) =>
          axios.put<readonly string[]>(\`/api/sample\`, undefined, config);
        "
      `);
    });

    it('compiles a DELETE operation', async () => {
      // GIVEN an OpenAPI schema that contains a single DELETE endpoint with an
      // inline response array
      const document = createTestDocumentWithPaths({
        '/api/sample': {
          delete: {
            operationId: 'deleteSample',
            responses: {
              204: {
                description: 'No content',
                content: {
                  'application/json': {
                    schema: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
            summary: 'Endpoint under test',
          } as OpenAPIV3.OperationObject,
        },
      });

      // WHEN compiling with the handlebars generator
      const { requests } = await compile(document);

      // THEN the output matches the snapshot
      expect(requests).toMatchInlineSnapshot(`
        "/* eslint-disable */
        /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */

        import axios, { AxiosRequestConfig } from 'axios';

        /**
         * Endpoint under test
         * @param config Overrides of the axios configuration for this request
         */
        export const deleteSample = async (config?: AxiosRequestConfig) =>
          axios.delete<readonly string[]>(\`/api/sample\`, config);
        "
      `);
    });
  });
});
