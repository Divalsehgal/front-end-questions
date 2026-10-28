export function pipe(...fns: ((...args: any[]) => any)[]): (...args: any[]) => any {
  return function (this: unknown, ...args: any[]) {
    if (fns.length === 0) {
      return args[0];
    }
    // The first function gets all the arguments, every next one gets the previous result.
    let result = fns[0].apply(this, args);
    for (let i = 1; i < fns.length; i++) {
      result = fns[i].call(this, result);
    }
    return result;
  };
}

// compose is pipe from right to left.
export function compose(...fns: ((...args: any[]) => any)[]): (...args: any[]) => any {
  return pipe(...fns.reverse());
}
