import type { OpenAPIV3_1 } from 'openapi-types';

// TODO: Consolidate the different components instead of having a property for
//  each of them.
type CreateOptions = {
  readonly paths?: NonNullable<OpenAPIV3_1.Document['paths']>;
  readonly schemas?: NonNullable<OpenAPIV3_1.Document['components']>['schemas'];
  readonly responses?: NonNullable<
    OpenAPIV3_1.Document['components']
  >['responses'];
  readonly requestBodies?: NonNullable<
    OpenAPIV3_1.Document['components']
  >['requestBodies'];
  readonly parameters?: NonNullable<
    OpenAPIV3_1.Document['components']
  >['parameters'];
};

export const createDocument = ({
  paths = {},
  schemas = {},
  responses = {},
  requestBodies = {},
  parameters = {},
}: CreateOptions): OpenAPIV3_1.Document => ({
  openapi: '3.1.0',
  info: {
    title: 'API under test',
    version: '1.0.0-SNAPSHOT',
  },
  paths,
  components: {
    schemas,
    responses,
    requestBodies,
    parameters,
  },
});
