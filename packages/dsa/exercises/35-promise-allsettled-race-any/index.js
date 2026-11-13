/**
 * 35. Polyfill Promise.allSettled, race and any
 *
 * Write three functions without using the built-in versions:
 *   promiseAllSettled(items)  waits for all; resolves with
 *                             { status: 'fulfilled', value } or { status: 'rejected', reason }
 *   promiseRace(items)        settles the same way as the first item to settle
 *   promiseAny(items)         resolves with the first success; if all reject, rejects
 *                             with an AggregateError whose errors are in input order
 *
 * Examples
 *   promiseAllSettled([later(1, 20), fail('x', 10)])
 *     ->  [{ status: 'fulfilled', value: 1 }, { status: 'rejected', reason: 'x' }]
 *   promiseRace([later('slow', 30), later('fast', 10)])   ->  'fast'
 *   promiseAny([fail('a', 5), later('b', 10)])             ->  'b'
 *   promiseAny([fail('a', 5), fail('b', 10)])              ->  AggregateError ['a', 'b']
 *
 * Target complexity: Time O(n), Space O(n)
 */
import { check } from '../helpers.js';

function promiseAllSettled(items) {
  // your solution
}

function promiseRace(items) {
  // your solution
}

function promiseAny(items) {
  // your solution
}

const later = (value, ms) => new Promise((resolve) => setTimeout(() => resolve(value), ms));
const fail = (reason, ms) => new Promise((_, reject) => setTimeout(() => reject(reason), ms));

check('allSettled', await promiseAllSettled([later(1, 20), fail('x', 10)]), [
  { status: 'fulfilled', value: 1 },
  { status: 'rejected', reason: 'x' },
]);
check('race', await promiseRace([later('slow', 30), later('fast', 10)]), 'fast');
check('any picks first success', await promiseAny([fail('a', 5), later('b', 10)]), 'b');
let error;
try {
  await promiseAny([fail('a', 5), fail('b', 10)]);
} catch (e) {
  error = e;
}
check('any rejects with AggregateError', [error instanceof AggregateError, error?.errors], [true, ['a', 'b']]);
