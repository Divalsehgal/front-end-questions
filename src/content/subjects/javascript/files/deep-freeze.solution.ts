export function deepFreeze<T>(obj: T, seen = new Set<unknown>()): Readonly<T> {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (seen.has(obj)) {
    return obj; // circular reference: already handled
  }
  seen.add(obj);
  Object.freeze(obj);
  for (const key in obj) {
    deepFreeze(obj[key], seen);
  }
  return obj;
}
