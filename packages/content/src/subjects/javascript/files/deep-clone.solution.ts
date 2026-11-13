export function deepClone<T>(value: T, seen = new Map<any, any>()): T {
  if (value === null || typeof value !== 'object') {
    return value; // primitives and functions are returned as they are
  }
  if (seen.has(value)) {
    return seen.get(value); // circular reference: reuse the copy we already made
  }

  if (value instanceof Date) {
    return new Date(value.getTime()) as T;
  }
  if (value instanceof Map) {
    const copy = new Map();
    seen.set(value, copy);
    value.forEach((v, k) => copy.set(k, deepClone(v, seen)));
    return copy as T;
  }
  if (value instanceof Set) {
    const copy = new Set();
    seen.set(value, copy);
    value.forEach((v) => copy.add(deepClone(v, seen)));
    return copy as T;
  }

  const copy: any = Array.isArray(value) ? [] : {};
  seen.set(value, copy); // save it before going deeper, so cycles find it
  for (const key in value) {
    if (Object.hasOwn(value, key)) {
      copy[key] = deepClone(value[key], seen);
    }
  }
  return copy;
}
