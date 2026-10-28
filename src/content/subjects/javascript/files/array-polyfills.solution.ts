declare global {
  interface Array<T> {
    myMap<U>(cb: (value: T, index: number, array: T[]) => U, thisArg?: unknown): U[];
    myFilter(cb: (value: T, index: number, array: T[]) => unknown, thisArg?: unknown): T[];
    myReduce<U>(cb: (acc: U, value: T, index: number, array: T[]) => U, initial?: U): U;
  }
}

Array.prototype.myMap = function (cb, thisArg) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this) {
      // `i in this` skips holes like [1, , 3]
      result[i] = cb.call(thisArg, this[i], i, this);
    }
  }
  return result;
};

Array.prototype.myFilter = function (cb, thisArg) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this && cb.call(thisArg, this[i], i, this)) {
      result.push(this[i]);
    }
  }
  return result;
};

Array.prototype.myReduce = function (cb: any, initialValue?: any) {
  let acc = initialValue;
  let startIndex = 0;
  // Check arguments.length, not `initialValue === undefined`: reduce(fn, undefined) still has an initial value.
  if (arguments.length < 2) {
    if (this.length === 0) {
      throw new TypeError('Reduce of empty array with no initial value');
    }
    acc = this[0];
    startIndex = 1;
  }
  for (let i = startIndex; i < this.length; i++) {
    if (i in this) {
      acc = cb(acc, this[i], i, this);
    }
  }
  return acc;
};

export {};
