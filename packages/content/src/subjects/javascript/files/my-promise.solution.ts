type State = 'pending' | 'fulfilled' | 'rejected';

export class MyPromise<T> {
  private state: State = 'pending';
  private value: any; // the result, or the error when rejected
  private callbacks: (() => void)[] = [];

  constructor(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: unknown) => void) => void) {
    let called = false; // resolve and reject only work once

    const resolve = (value: any) => {
      if (called) return;
      called = true;
      // Resolving with another promise means "wait for that one".
      if (value && typeof value.then === 'function') {
        value.then(
          (v: unknown) => this.settle('fulfilled', v),
          (r: unknown) => this.settle('rejected', r),
        );
      } else {
        this.settle('fulfilled', value);
      }
    };

    const reject = (reason?: unknown) => {
      if (called) return;
      called = true;
      this.settle('rejected', reason);
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  private settle(state: State, value: unknown) {
    this.state = state;
    this.value = value;
    for (const callback of this.callbacks) {
      queueMicrotask(callback);
    }
    this.callbacks = [];
  }

  // then always returns a NEW promise, which is what makes chaining work.
  then<R1 = T, R2 = never>(
    onFulfilled?: (value: T) => R1 | PromiseLike<R1>,
    onRejected?: (reason: unknown) => R2 | PromiseLike<R2>,
  ): MyPromise<R1 | R2> {
    return new MyPromise<R1 | R2>((resolve, reject) => {
      const handle = () => {
        try {
          if (this.state === 'fulfilled') {
            if (onFulfilled) resolve(onFulfilled(this.value));
            else resolve(this.value); // no handler: pass the value on
          } else {
            if (onRejected) resolve(onRejected(this.value)); // handling the error recovers the chain
            else reject(this.value); // no handler: pass the error on
          }
        } catch (error) {
          reject(error);
        }
      };

      if (this.state === 'pending') {
        this.callbacks.push(handle);
      } else {
        queueMicrotask(handle); // handlers always run later, even if already settled
      }
    });
  }

  catch<R = never>(onRejected: (reason: unknown) => R | PromiseLike<R>): MyPromise<T | R> {
    return this.then(undefined, onRejected);
  }

  // Runs onFinally, waits for it, then passes the original value or error on.
  finally(onFinally: () => unknown): MyPromise<T> {
    return this.then(
      (value) => MyPromise.resolve(onFinally()).then(() => value),
      (reason) =>
        MyPromise.resolve(onFinally()).then(() => {
          throw reason;
        }),
    );
  }

  static resolve<T>(value: T | PromiseLike<T>): MyPromise<T> {
    return new MyPromise<T>((resolve) => resolve(value));
  }

  static reject<T = never>(reason?: unknown): MyPromise<T> {
    return new MyPromise<T>((_, reject) => reject(reason));
  }
}
