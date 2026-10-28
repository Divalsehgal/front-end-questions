/**
 * range(start, end, step = 1) returns an ITERABLE (usable with for...of and spread)
 * that yields start, start + step, ... up to and including end. A negative step counts down.
 * Each iteration starts over from the beginning. Write it WITHOUT a generator first,
 * by implementing [Symbol.iterator]() that returns { next() }.
 */
export function range(start: number, end: number, step = 1): Iterable<number> {
  // your code
}

/** Lazily take the first n values from any iterable (works on infinite ones). */
export function take<T>(iterable: Iterable<T>, n: number): T[] {
  // your code
}
