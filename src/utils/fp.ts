export const compact = <T>(
  array: (T | undefined | false)[] | readonly (T | undefined | false)[],
): T[] => array.filter(Boolean) as T[];
