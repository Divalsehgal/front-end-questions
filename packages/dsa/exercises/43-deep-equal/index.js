/**
 * 43. Deep Equal
 *
 * Write isEqual(a, b). It returns true when both values have the same structure
 * and the same values, at every level. Key order does not matter. An array is not
 * equal to an object with the same keys. NaN equals NaN.
 *
 * Examples
 *   isEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] })  ->  true
 *   isEqual({ a: 1, b: 2 }, { b: 2, a: 1 })              ->  true
 *   isEqual({ a: 1 }, { a: 1, b: undefined })            ->  false
 *   isEqual([1, 2], { 0: 1, 1: 2 })                      ->  false
 *   isEqual(NaN, NaN)                                    ->  true
 *
 * Target complexity: Time O(n) for n values, Space O(depth)
 */
import { check } from '../helpers.js';

function isEqual(a, b) {
  // your solution
}

check('nested equal', isEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] }), true);
check('key order ignored', isEqual({ a: 1, b: 2 }, { b: 2, a: 1 }), true);
check('extra undefined key', isEqual({ a: 1 }, { a: 1, b: undefined }), false);
check('array vs object', isEqual([1, 2], { 0: 1, 1: 2 }), false);
check('different nested value', isEqual({ a: { b: 1 } }, { a: { b: 2 } }), false);
check('NaN', isEqual(NaN, NaN), true);
check('null vs object', isEqual(null, {}), false);
check('number vs string', isEqual(1, '1'), false);
