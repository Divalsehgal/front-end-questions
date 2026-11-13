/**
 * 31. Pipe and Compose
 *
 * Write pipe(...fns) and compose(...fns). Both return a function of one value.
 * pipe runs the functions left to right; compose runs them right to left.
 * With no functions, both return the value unchanged.
 *
 * Examples
 *   add1 = x => x + 1, double = x => x * 2, square = x => x * x
 *   pipe(add1, double, square)(2)     ->  36   square(double(add1(2)))
 *   compose(add1, double, square)(2)  ->  9    add1(double(square(2)))
 *   pipe()(5)                         ->  5
 *
 * Target complexity: Time O(n) for n functions, Space O(1)
 */
import { check } from '../helpers.js';

function pipe(...fns) {
  // your solution
  return function inner(args) {
    let temp=args;
    const context=this
    for (const fn of fns) {
      temp= fn.call(context,temp)
    }
    return temp

  }

}

function compose(...fns) {
  // your solution
  return function inner(args){
    for(const fn of fns){
      
    }
  }
}

const add1 = (x) => x + 1;
const double = (x) => x * 2;
const square = (x) => x * x;
check('pipe', pipe(add1, double, square)?.(2), 36);
check('compose', compose(add1, double, square)?.(2), 9);
check('pipe with no functions', pipe()?.(5), 5);
check('compose with no functions', compose()?.(5), 5);
