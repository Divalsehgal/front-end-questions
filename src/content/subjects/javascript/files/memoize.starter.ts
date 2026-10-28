export function memoize<A extends unknown[], R>(
  fn: (...args: A) => R,
  resolver?: (...args: A) => unknown,
): ((...args: A) => R) & { cache: Map<unknown, R> } {
  // your code
}
