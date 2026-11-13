export function deepEqual(a: any, b: any, seen = new Map<any, any>()): boolean {
  if (Object.is(a, b)) {
    return true; // like ===, but NaN equals NaN
  }
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
    return false;
  }
  if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) {
    return false; // an array is not an object, a Map is not a Set
  }
  if (seen.get(a) === b) {
    return true; // we're already comparing this pair (circular reference)
  }
  seen.set(a, b);

  if (a instanceof Date) {
    return a.getTime() === b.getTime();
  }
  if (a instanceof Set) {
    if (a.size !== b.size) return false;
    for (const v of a) {
      if (!b.has(v)) return false;
    }
    return true;
  }
  if (a instanceof Map) {
    if (a.size !== b.size) return false;
    for (const [key, v] of a) {
      if (!b.has(key) || !deepEqual(v, b.get(key), seen)) return false;
    }
    return true;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) {
    return false;
  }
  for (const key of keysA) {
    if (!Object.hasOwn(b, key) || !deepEqual(a[key], b[key], seen)) {
      return false;
    }
  }
  return true;
}
