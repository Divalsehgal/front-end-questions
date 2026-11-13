export function curry(fn: (...args: any[]) => any): any {
  return function innerCurry(this: unknown, ...args: any[]): any {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    // Not enough arguments yet: wait for more.
    return function (this: unknown, ...moreArgs: any[]) {
      return innerCurry.apply(this, args.concat(moreArgs));
    };
  };
}
