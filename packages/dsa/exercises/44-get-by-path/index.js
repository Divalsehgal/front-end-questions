/**
 * 44. Get Value by Path
 *
 * Write get(obj, path, defaultValue). path is a string like 'a.b[0].c' or an array
 * of keys. Return the value at that path, or defaultValue when any step is missing
 * or the final value is undefined. Falsy values like 0 are real values.
 *
 * Examples
 *   obj = { a: { b: [{ c: 5 }] }, x: null, z: 0 }
 *   get(obj, 'a.b[0].c')               ->  5
 *   get(obj, ['a', 'b', '0', 'c'])     ->  5
 *   get(obj, 'a.b[1].c', 'none')       ->  'none'
 *   get(obj, 'x.y', 0)                 ->  0
 *   get(obj, 'z', 9)                   ->  0
 *
 * Target complexity: Time O(k) for k path steps, Space O(k)
 */
import { check } from '../helpers.js';

function get(obj, path, defaultValue) {
  // your solution
}

const obj = { a: { b: [{ c: 5 }] }, x: null, z: 0 };
check('string path with brackets', get(obj, 'a.b[0].c'), 5);
check('array path', get(obj, ['a', 'b', '0', 'c']), 5);
check('dot index', get(obj, 'a.b.0.c'), 5);
check('missing returns default', get(obj, 'a.b[1].c', 'none'), 'none');
check('through null returns default', get(obj, 'x.y', 0), 0);
check('falsy value is kept', get(obj, 'z', 9), 0);
