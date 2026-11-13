/**
 * 39. setInterval using setTimeout
 *
 * Write mySetInterval(fn, ms) and myClearInterval(id) using only setTimeout and
 * clearTimeout. mySetInterval calls fn every ms until myClearInterval is called with
 * the id it returned.
 *
 * Examples
 *   id = mySetInterval(tick, 20)
 *   after ~100ms           ->  tick ran about 5 times
 *   myClearInterval(id)    ->  tick never runs again
 *
 * Target complexity: Time O(1) per tick, Space O(1)
 */
import { check, wait } from '../helpers.js';

function mySetInterval(fn, ms) {
  // your solution
}

function myClearInterval(id) {
  // your solution
}

let n = 0;
const id = mySetInterval(() => n++, 20);
await wait(110);
myClearInterval(id);
const afterClear = n;
check('ran several times', n >= 3 && n <= 6, true);
await wait(60);
check('stopped after clear', n, afterClear);
