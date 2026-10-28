type Resolve<T> = (value: T | PromiseLike<T>) => void;
type Reject = (reason?: unknown) => void;

/**
 * A minimal Promise: then (with chaining), catch, finally, and the static resolve/reject.
 * Handlers must always run asynchronously (as microtasks), even if already settled.
 */
export class MyPromise<T> {
  constructor(executor: (resolve: Resolve<T>, reject: Reject) => void) {
    // your code
  }

  then<R1 = T, R2 = never>(onFulfilled?: (value: T) => R1 | PromiseLike<R1>, onRejected?: (reason: unknown) => R2 | PromiseLike<R2>): MyPromise<R1 | R2> {
    // your code
  }

  catch<R = never>(onRejected: (reason: unknown) => R | PromiseLike<R>): MyPromise<T | R> {
    // your code
  }

  finally(onFinally: () => void): MyPromise<T> {
    // your code
  }

  static resolve<T>(value: T | PromiseLike<T>): MyPromise<T> {
    // your code
  }

  static reject<T = never>(reason?: unknown): MyPromise<T> {
    // your code
  }
}
