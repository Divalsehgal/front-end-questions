/**
 * 42. Deep Clone
 *
 * Write deepClone(value) without structuredClone or JSON. Copy nested objects and
 * arrays so nothing is shared with the original. Copy Dates as new Dates.
 * Primitives and null come back as they are.
 * Follow-up: support circular references (an object that points to itself).
 *
 * Examples
 *   deepClone({ a: 1, b: { c: [1, 2] } })  ->  equal values, every nested object is new
 *   deepClone(5)                           ->  5
 *   obj.self = obj; deepClone(obj)         ->  copy.self === copy
 *
 * Target complexity: Time O(n) for n values, Space O(n)
 */
import { check } from '../helpers.js';

function deepClone(value) {
  // your solution
  const res={}
  if(typeof !=='object' || value===null){
    return value
  }

  const temp=Array.isArray(value)?[]:{};

  for(const i of value){
      res[i]=deepClone(value[i])
  }

  return res
    

}

const orig = { a: 1, b: { c: [1, 2, { d: 3 }] }, date: new Date(0) };
const copy = deepClone(orig);
check('same values', copy, orig);
check('nested values are new objects', !!copy && copy.b !== orig.b && copy.b.c !== orig.b.c && copy.b.c[2] !== orig.b.c[2], true);
check('date copied as a new Date', copy?.date instanceof Date && copy.date !== orig.date, true);
check('primitive', deepClone(5), 5);
check('null', deepClone(null), null);

const cyc = { name: 'loop' };
cyc.self = cyc;
const c2 = deepClone(cyc);
check('circular reference', !!c2 && c2 !== cyc && c2.self === c2, true);
