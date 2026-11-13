/**
 * 28. Memoize
 *
 * Write memoize(fn). It returns a function that caches results by arguments, so
 * calling it again with the same arguments returns the cached value without
 * calling fn. Arguments 1 and '1' must not share a cache entry.
 *
 * Examples
 *   m = memoize(add)
 *   m(1, 2)    ->  3   (fn called)
 *   m(1, 2)    ->  3   (from cache)
 *   m(2, 1)    ->  3   (fn called, different args)
 *
 * Target complexity: Time O(k) per call for k arguments, Space O(number of distinct calls)
 */
import { check } from '../helpers.js';

function memoize(fn) {
  // your solution
  const obj = {}
  return function inner(...args) {
    const key = JSON.stringify(args);
    if (key in obj) {
      return obj[key]
    }

    const temp = fn.apply(this, args)
    obj[key] = temp
    return temp
  }

 
}

let count = 0;
const add = (a, b) => {
  count++;
  return a + b;
};
const m = memoize(add);
check('first call', m?.(1, 2), 3);
check('second call', m?.(1, 2), 3);
check('fn ran once', count, 1);
check('different args', m?.(2, 1), 3);
check('fn ran twice', count, 2);
check("1 and '1' are different keys", m?.('1', 2), '12');
check('fn ran three times', count, 3);
