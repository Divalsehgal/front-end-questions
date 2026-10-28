export function promisify<T>(fn: (...args: any[]) => void): (...args: any[]) => Promise<T> {
  return function (this: unknown, ...args: any[]) {
    return new Promise<T>((resolve, reject) => {
      // Node-style callback: the error comes first.
      const callback = (error: unknown, result: T) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      };
      fn.call(this, ...args, callback);
    });
  };
}
