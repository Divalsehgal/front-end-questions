export type Settled<T> = { status: 'fulfilled'; value: T } | { status: 'rejected'; reason: unknown };

export function promiseAllSettled<T>(values: Iterable<T | PromiseLike<T>>): Promise<Settled<T>[]> {
  // your code (Promise.allSettled is disabled in the tests)
}
