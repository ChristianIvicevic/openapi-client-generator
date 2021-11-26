import { camelCase, pascalCase } from 'change-case';
import * as E from 'fp-ts/Either';
import * as Eq from 'fp-ts/Eq';
import type { FunctionN } from 'fp-ts/function';
import { flow, pipe } from 'fp-ts/function';
import * as M from 'fp-ts/Monoid';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { ReferenceDoesntMatchValidPatternError } from 'generator/errors';
import { formatUsingPrettier } from 'generator/format';
import type { OpenAPIV3_1 } from 'openapi-types';
import ts, { factory } from 'typescript';

/**
 * Used to format schema names from an arbitrary casing to strictly valid
 * casing for consumption within a Typescript codebase.
 */
export const formatSchemaName = pascalCase;

/**
 * Used to format operation ids from an arbitrary casing to strictly valid
 * casing for consumption within a Typescript codebase.
 */
export const formatOperationId = camelCase;

/**
 * Used to sequence an `Either<ReadonlyNonEmptyArray<Error>, R>` for validation
 * purposes.
 */
export const applicativeValidation = E.getApplicativeValidation(
  RNEA.getSemigroup<Error>(),
);

/**
 * Lifts the specified function `f` that returns an `Either<L, R>` to a function
 * returning `Either<ReadonlyNonEmptyArray<L>, R>` to be consumed by an
 * applicative validation over a semigroup that can be used to concatenate `L`s
 * into `L[]`.
 * @param f Function to lift.
 */
export const liftN = <A extends readonly unknown[], L, R>(
  f: FunctionN<A, E.Either<L, R>>,
): FunctionN<A, E.Either<RNEA.ReadonlyNonEmptyArray<L>, R>> =>
  flow(
    f,
    E.mapLeft(left => [left]),
  );

/**
 * Concatenates multiple `Option<T[]>` into a single `Option<T[]>` by
 * concatenating the values within.
 */
export const concatOptions = <T = unknown>() =>
  pipe(Eq.eqStrict as Eq.Eq<T>, RA.getUnionSemigroup, O.getMonoid, M.concatAll);

/**
 * Custom type-guard to discriminate between common schema objects and reference
 * objects through a document.
 * @param value Value to check.
 */
export const isReferenceObject = <T = unknown>(
  value: OpenAPIV3_1.ReferenceObject | T,
): value is OpenAPIV3_1.ReferenceObject =>
  (value as OpenAPIV3_1.ReferenceObject).$ref !== undefined;

/**
 * Custom type-guard to discriminate between array schema objects and other
 * schema objects through a document.
 * @param value Value to check.
 */
export const isArraySchemaObject = <T = unknown>(
  value: OpenAPIV3_1.ArraySchemaObject | T,
): value is OpenAPIV3_1.ArraySchemaObject =>
  (value as OpenAPIV3_1.ArraySchemaObject).items !== undefined;

/**
 * Dereferences the specified fully-qualified reference to a valid Typescript
 * qualified name with proper casing.
 * @param $ref Fully-qualified JSON path to dereference.
 */
export const dereferenceQualifiedName = ({
  $ref,
}: OpenAPIV3_1.ReferenceObject) => {
  if ($ref.startsWith('#/components/schemas')) {
    return E.right(formatSchemaName($ref.replace('#/components/schemas/', '')));
  }
  if ($ref.startsWith('#/components/parameters')) {
    return E.right($ref.replace('#/components/parameters/', ''));
  }
  return E.left(new ReferenceDoesntMatchValidPatternError());
};

/**
 * Attempts to (recursively) dereference a component from the specified document.
 * @param document Document to dereference from.
 * @param kind Expected kind of the component to be dereferenced. Used for
 * proper type inferrence and lookup within the document components.
 * @param componentOrReferenceObject An object of or reference to an object of
 * the specified kind to be dereferenced.
 */
// TODO: It may be nice to make a partial version of this function with the last
//  argument being curried for better readability.
export const dereferenceComponent = <
  K extends keyof OpenAPIV3_1.ComponentsObject,
  T extends NonNullable<OpenAPIV3_1.ComponentsObject[K]>[string],
>(
  document: OpenAPIV3_1.Document,
  kind: K,
  componentOrReferenceObject: T,
): O.Option<Exclude<T, OpenAPIV3_1.ReferenceObject>> => {
  if (!isReferenceObject(componentOrReferenceObject)) {
    return O.some(
      componentOrReferenceObject as Exclude<T, OpenAPIV3_1.ReferenceObject>,
    );
  }

  return pipe(
    document.components?.[kind]?.[
      componentOrReferenceObject.$ref.replace(`#/components/${kind}/`, '')
    ] as T,
    O.fromNullable,
    O.chain(dereferencedObject =>
      dereferenceComponent(document, kind, dereferencedObject),
    ),
  );
};

/**
 * Formats the specified list of AST nodes using the Typescript compiler and
 * prettier into a source file.
 * @param nodes AST nodes to compile and format.
 */
export const compileNodes = <T extends ts.Node>(nodes: readonly T[]) =>
  pipe(
    [
      '/* eslint-disable */',
      '/* THIS FILE HAS BEEN GENERATED AUTOMATICALLY - DO NOT EDIT IT MANUALLY */',
      ts
        .createPrinter({ newLine: ts.NewLineKind.LineFeed })
        .printList(
          ts.ListFormat.MultiLine,
          factory.createNodeArray(nodes),
          ts.createSourceFile(
            'output.ts',
            '',
            ts.ScriptTarget.Latest,
            false,
            ts.ScriptKind.TS,
          ),
        ),
    ].join('\n'),
    formatUsingPrettier,
  );

/**
 * Asserts that the specified value is non-nullable.
 * @param val Value to assert.
 */
export function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    throw new Error(
      `Expected 'val' to be defined, but received ${String(val)}`,
    );
  }
}
