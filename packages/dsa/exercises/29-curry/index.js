/**
 * 29. Curry
 *
 * Part 1: write curry(fn). The curried function collects arguments over any number
 * of calls and calls fn once it has fn.length arguments.
 *
 * Part 2: write sum so that sum(1)(2)(3)() returns 6. It keeps adding until it is
 * called with no argument.
 *
 * Examples
 *   c = curry((a, b, c) => a + b + c)
 *   c(1)(2)(3)    ->  6
 *   c(1, 2)(3)    ->  6
 *   c(1)(2, 3)    ->  6
 *   sum(1)(2)(3)()  ->  6
 *   sum(5)()        ->  5
 *
 * Target complexity: Time O(n) for n arguments, Space O(n)
 */
import { check } from '../helpers.js';

function curry(fn) {
  const f1 = fn.length;

  return function inner(...args) {
    const f2 = args.arguments;
    const context = this
    if (f1 <= f2) {
      fn.apply(this, args)
    } else {
      return function (...args2) {
       return  inner.apply(context, [...args, ...args2])
      }
    }
  }
  // your solution
}

function sum(a) {
  // your solution
}

const add3 = curry((a, b, c) => a + b + c);
check('one at a time', add3?.(1)?.(2)?.(3), 6);
check('two then one', add3?.(1, 2)?.(3), 6);
check('one then two', add3?.(1)?.(2, 3), 6);
check('all at once', add3?.(1, 2, 3), 6);
check('sum chain', sum(1)?.(2)?.(3)?.(), 6);
check('sum single', sum(5)?.(), 5);
