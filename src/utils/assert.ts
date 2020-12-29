export function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
  /* istanbul ignore if */
  if (val === undefined || val === null) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new Error(`Expected 'val' to be defined, but received ${val}`);
  }
}
