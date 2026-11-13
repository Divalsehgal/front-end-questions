/**
 * 40. Flatten Array
 *
 * Write flat(arr, depth = 1) without using Array.prototype.flat. It returns a new
 * array with nested arrays spread into it, up to depth levels deep.
 * Follow-up: write it again without recursion, using a stack.
 *
 * Examples
 *   flat([1, [2, [3, [4]]]])            ->  [1, 2, [3, [4]]]
 *   flat([1, [2, [3, [4]]]], 2)         ->  [1, 2, 3, [4]]
 *   flat([1, [2, [3, [4]]]], Infinity)  ->  [1, 2, 3, 4]
 *   flat([1, [2]], 0)                   ->  [1, [2]]
 *
 * Target complexity: Time O(n) for n total elements, Space O(n)
 */
import { check } from '../helpers.js';

function flat(arr, depth = 1) {
  // your solution
  const temp = []
  for (const i of arr) {
    if (Array.isArray(i) && depth > 0) {
      temp.push(...flat(i,depth-1))
    } else {
      temp.push(i)
    }

  }
  return temp
}

const nested = [1, [2, [3, [4]]]];
check('default depth 1', flat(nested), [1, 2, [3, [4]]]);
check('depth 2', flat(nested, 2), [1, 2, 3, [4]]);
check('depth Infinity', flat(nested, Infinity), [1, 2, 3, 4]);
check('depth 0', flat([1, [2]], 0), [1, [2]]);
check('empty', flat([]), []);
