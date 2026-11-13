function isDeepEqual(a: any, b: any): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  const keysA = Object.keys(a);
  if (keysA.length !== Object.keys(b).length) return false;
  for (const key of keysA) {
    if (!isDeepEqual(a[key], b[key])) return false;
  }
  return true;
}

export function expect(actual: unknown) {
  return {
    // Jest's toBe compares with Object.is, so NaN is NaN and 0 is not -0.
    toBe(expected: unknown): true {
      if (!Object.is(actual, expected)) throw new Error('Not Equal');
      return true;
    },
    notToBe(expected: unknown): true {
      if (Object.is(actual, expected)) throw new Error('Equal');
      return true;
    },
    toEqual(expected: unknown): true {
      if (!isDeepEqual(actual, expected)) throw new Error('Not Deep Equal');
      return true;
    },
  };
}
