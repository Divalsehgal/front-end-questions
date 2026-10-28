export function once<A extends unknown[], R>(fn: (...args: A) => R): (...args: A) => R {
  let hasRun = false; // a flag, so a result of undefined is remembered too
  let result: R;
  return function (this: unknown, ...args: A) {
    if (!hasRun) {
      hasRun = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}
