import { generateSourceFilesOrThrow } from 'index';
import { createDocument } from 'utils/testing';

describe('API Paths', () => {
  it('compiles operations to an ApiPaths object', () => {
    const document = createDocument({
      paths: {
        '/api/resources': {
          get: {
            operationId: 'listResources',
            responses: {},
            summary: 'Returns a list of all resources.',
          },
        },
        '/api/resources/{resourceId}': {
          parameters: [
            {
              in: 'path',
              description: 'ID of the resource to query.',
              name: 'resourceId',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          get: {
            operationId: 'getResourceById',
            responses: {},
            summary: 'Returns a resource with the specified ID.',
          },
        },
        '/api/resources/{resourceId}/child-resources/{childResourceId}': {
          get: {
            parameters: [
              {
                in: 'path',
                description: 'ID of the resource to query.',
                name: 'resourceId',
                required: true,
                schema: {
                  type: 'string',
                },
              },
              {
                in: 'path',
                description: 'ID of the child resource to query.',
                name: 'childResourceId',
                required: true,
                schema: {
                  type: 'string',
                },
              },
            ],
            operationId: 'getChildResourceById',
            responses: {},
            summary: 'Returns a child resource with the specified ID.',
          },
        },
      },
    });

    const { pathsFileContent } = generateSourceFilesOrThrow(
      JSON.stringify(document),
    );

    expect(pathsFileContent).toMatchInlineSnapshot(`
      "/* eslint-disable */
      /* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */
      export const ApiPaths = {
        /**
         * Returns a list of all resources.
         */
        listResources: () => '/api/resources',
        /**
         * Returns a resource with the specified ID.
         */
        getResourceById: (parameters: {
          /**
           * ID of the resource to query.
           */
          readonly resourceId: string;
        }) => \`/api/resources/\${parameters.resourceId}\`,
        /**
         * Returns a child resource with the specified ID.
         */
        getChildResourceById: (parameters: {
          /**
           * ID of the resource to query.
           */
          readonly resourceId: string;
          /**
           * ID of the child resource to query.
           */
          readonly childResourceId: string;
        }) =>
          \`/api/resources/\${parameters.resourceId}/child-resources/\${parameters.childResourceId}\`,
      };
      "
    `);
  });
});
