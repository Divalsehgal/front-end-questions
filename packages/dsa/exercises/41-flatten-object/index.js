/**
 * 41. Flatten and Unflatten Object
 *
 * Part 1: write flattenObject(obj). Nested keys become one key joined with dots.
 * Array indexes count as keys.
 * Part 2: write unflatten(obj), the reverse, for objects without arrays.
 *
 * Examples
 *   flattenObject({ a: { b: 1, c: { d: 2 } }, e: 3 })  ->  { 'a.b': 1, 'a.c.d': 2, e: 3 }
 *   flattenObject({ a: [1, 2] })                        ->  { 'a.0': 1, 'a.1': 2 }
 *   unflatten({ 'a.b': 1, 'a.c.d': 2, e: 3 })           ->  { a: { b: 1, c: { d: 2 } }, e: 3 }
 *
 * Target complexity: Time O(n) for n leaf values, Space O(n)
 */
import { check } from '../helpers.js';

function flattenObject(obj) {
  // your solution
  let res={}

  
}

function unflatten(obj) {
  // your solution
}

check('nested objects', flattenObject({ a: { b: 1, c: { d: 2 } }, e: 3 }), { 'a.b': 1, 'a.c.d': 2, e: 3 });
check('arrays', flattenObject({ a: [1, 2] }), { 'a.0': 1, 'a.1': 2 });
check('null stays a value', flattenObject({ a: { b: null } }), { 'a.b': null });
check('unflatten', unflatten({ 'a.b': 1, 'a.c.d': 2, e: 3 }), { a: { b: 1, c: { d: 2 } }, e: 3 });
