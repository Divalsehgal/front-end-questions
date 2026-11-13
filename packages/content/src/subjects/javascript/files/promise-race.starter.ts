export function promiseRace<T>(values: Iterable<T | PromiseLike<T>>): Promise<T> {
  // your code (Promise.race is disabled in the tests)
}
