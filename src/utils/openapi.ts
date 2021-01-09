import { pascalCase } from 'change-case';
import type { Context } from 'generator/types';
import type { OpenAPIV3 } from 'openapi-types';
import { isReferenceObject } from 'utils/type-guards';

export const dereferenceName = ($ref: OpenAPIV3.ReferenceObject['$ref']) => {
  /* istanbul ignore else */
  if ($ref.startsWith('#/components/schemas')) {
    return pascalCase($ref.replace('#/components/schemas/', ''));
  }
  /* istanbul ignore next */
  throw Error(`The reference '${$ref}' does not match any component pattern`);
};

export const dereferenceOrThrow = (
  context: Context,
  componentOrRef: unknown,
) => {
  if (!isReferenceObject(componentOrRef)) {
    return componentOrRef;
  }

  const { document } = context;

  let referencedComponent: unknown;

  if (componentOrRef.$ref.startsWith('#/components/responses/')) {
    referencedComponent =
      document.components?.responses?.[
        componentOrRef.$ref.replace('#/components/responses/', '')
      ];
  }

  if (componentOrRef.$ref.startsWith('#/components/requestBodies/')) {
    referencedComponent =
      document.components?.requestBodies?.[
        componentOrRef.$ref.replace('#/components/requestBodies/', '')
      ];
  }

  if (componentOrRef.$ref.startsWith('#/components/parameters/')) {
    referencedComponent =
      document.components?.parameters?.[
        componentOrRef.$ref.replace('#/components/parameters/', '')
      ];
  }

  if (referencedComponent === undefined) {
    throw Error(`Cannot dereference component '${componentOrRef.$ref}'`);
  }

  if (isReferenceObject(referencedComponent)) {
    // Calling this recursively is overkill, just don't use deep $refs.
    throw Error(
      `Dereferenced component '${componentOrRef.$ref}' is a deep reference to '${referencedComponent.$ref}', which is not supported`,
    );
  }

  return referencedComponent;
};
