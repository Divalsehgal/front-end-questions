/**
 * 32. Polyfill map, filter and reduce
 *
 * Add myMap, myFilter and myReduce to Array.prototype without using the built-in
 * versions. The callback gets (value, index, array); reduce's gets
 * (accumulator, value, index, array).
 * reduce without an initial value starts from the first element. On an empty array
 * with no initial value it throws a TypeError.
 *
 * Examples
 *   [1, 2, 3].myMap((x, i) => x * i)         ->  [0, 2, 6]
 *   [1, 2, 3].myFilter((x) => x % 2)          ->  [1, 3]
 *   [1, 2, 3].myReduce((a, b) => a + b)       ->  6
 *   [1, 2, 3].myReduce((a, b) => a + b, 10)   ->  16
 *   [].myReduce((a, b) => a + b)              ->  TypeError
 *
 * Target complexity: Time O(n), Space O(n) for map and filter, O(1) for reduce
 */
import { check } from '../helpers.js';

Array.prototype.myMap = function (callback) {
  // your solution
  const temp = []
  for (let i = 0; i < this.length; i++) {
    temp.push(callback.call(undefined, this[i], i, this))
  }
  return temp
};

Array.prototype.myFilter = function (callback) {
  // your solution
  const temp = []
  for (let i = 0; i < this.length; i++) {
    if (callback.call(undefined, this[i], i, this)) {
      temp.push(this[i])
    }
  }
  return temp
};

Array.prototype.myReduce = function (callback, initialValue) {
  // your solution
  let temp = initialValue;
  for (let i = 0; i < this.length; i++) {
    temp = callback(temp,this[i],i,this)
    }
  
  return temp
};

check('map with index', [1, 2, 3].myMap((x, i) => x * i), [0, 2, 6]);
check('filter', [1, 2, 3].myFilter((x) => x % 2), [1, 3]);
check('reduce without initial', [1, 2, 3].myReduce((a, b) => a + b), 6);
check('reduce with initial', [1, 2, 3].myReduce((a, b) => a + b, 10), 16);
check('reduce empty with initial', [].myReduce((a, b) => a + b, 0), 0);
let threw = false;
try {
  [].myReduce((a, b) => a + b);
} catch (e) {
  threw = e instanceof TypeError;
}
check('reduce empty without initial throws TypeError', threw, true);
