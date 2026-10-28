// Implement these on Array.prototype WITHOUT calling the native map/filter/reduce.
// Match the real behaviour: callback gets (value, index, array), holes are skipped,
// map/filter honour thisArg, reduce throws on an empty array with no initial value.
declare global {
  interface Array<T> {
    myMap<U>(cb: (value: T, index: number, array: T[]) => U, thisArg?: unknown): U[];
    myFilter(cb: (value: T, index: number, array: T[]) => unknown, thisArg?: unknown): T[];
    myReduce<U>(cb: (acc: U, value: T, index: number, array: T[]) => U, initial?: U): U;
  }
}

Array.prototype.myMap = function (cb, thisArg) {
  // your code
};

Array.prototype.myFilter = function (cb, thisArg) {
  // your code
};

Array.prototype.myReduce = function (cb, ...initial) {
  // your code
};

export {};
