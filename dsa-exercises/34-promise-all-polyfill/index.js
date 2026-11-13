/**
 * 34. Polyfill Promise.all
 *
 * Write promiseAll(items). It returns a promise that resolves with all results in
 * the same order as the input, even if later items finish first. Plain values count
 * as already resolved. It rejects as soon as any item rejects. An empty array
 * resolves to [].
 *
 * Examples
 *   promiseAll([later(1, 30), later(2, 10), 3])   ->  [1, 2, 3]
 *   promiseAll([])                                 ->  []
 *   promiseAll([later(1, 10), fail('boom', 5)])    ->  rejects with 'boom'
 *
 * Target complexity: Time O(n), Space O(n)
 */
import { check } from '../helpers.js';

function promiseAll(items) {
  // your solution
}

const later = (value, ms) => new Promise((resolve) => setTimeout(() => resolve(value), ms));
const fail = (reason, ms) => new Promise((_, reject) => setTimeout(() => reject(reason), ms));

check('keeps input order', await promiseAll([later(1, 30), later(2, 10), 3]), [1, 2, 3]);
check('empty array', await promiseAll([]), []);
let error;
try {
  await promiseAll([later(1, 10), fail('boom', 5)]);
} catch (e) {
  error = e;
}
check('rejects with first error', error, 'boom');
