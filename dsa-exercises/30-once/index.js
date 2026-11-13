/**
 * 30. Once
 *
 * Write once(fn). The returned function calls fn only the first time. Every later
 * call returns the result of that first call without calling fn again.
 *
 * Examples
 *   init = once((x) => x * 2)
 *   init(5)   ->  10
 *   init(9)   ->  10   (fn not called)
 *
 * Target complexity: Time O(1), Space O(1)
 */
import { check } from '../helpers.js';

function once(fn) {
  // your solution
  let temp, first = true
  return function inner(...args) {
    if (first) {
      temp = fn.apply(this, args);
      first = false
      return temp
    }
  }
}

let n = 0;
const init = once((x) => {
  n++;
  return x * 2;
});
check('first call', init?.(5), 10);
check('later call returns first result', init?.(9), 10);
check('fn ran once', n, 1);
