export function myCall(fn: Function, thisArg: any, ...args: any[]): any {
  if (thisArg === null || thisArg === undefined) {
    return fn(...args);
  }
  const context = Object(thisArg); // wraps primitives like 5 or 'a' in an object
  const key = Symbol('fn'); // a unique key, so we never overwrite a real property
  context[key] = fn;
  const result = context[key](...args); // called as a method, so `this` is context
  delete context[key];
  return result;
}

export function myApply(fn: Function, thisArg: any, args: any[] = []): any {
  return myCall(fn, thisArg, ...args);
}

export function myBind(fn: Function, thisArg: any, ...args: any[]): any {
  return function bound(this: any, ...moreArgs: any[]) {
    // Called with `new`: ignore thisArg and build a real instance of fn.
    if (this instanceof bound) {
      return new (fn as any)(...args, ...moreArgs);
    }
    return myCall(fn, thisArg, ...args, ...moreArgs);
  };
}
