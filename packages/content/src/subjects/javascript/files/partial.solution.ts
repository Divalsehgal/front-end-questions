export function partial<R>(fn: (...args: any[]) => R, ...args: any[]): (...moreArgs: any[]) => R {
  return function (this: unknown, ...moreArgs: any[]) {
    return fn.apply(this, [...args, ...moreArgs]);
  };
}
