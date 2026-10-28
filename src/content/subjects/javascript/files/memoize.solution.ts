export function memoize<A extends unknown[], R>(fn: (...args: A) => R, resolver?: (...args: A) => unknown) {
  const cache = new Map<unknown, R>();

  function memoized(...args: A): R {
    const key = resolver ? resolver(...args) : args[0];
    // Check `has`, not the value: a cached undefined is still a hit.
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }

  memoized.cache = cache;
  return memoized;
}
