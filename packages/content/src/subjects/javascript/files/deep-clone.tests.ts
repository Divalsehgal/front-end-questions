import { deepClone } from './solution';

(globalThis as any).structuredClone = () => { throw new Error('structuredClone is disabled'); };

test('nested objects are copied, not shared', () => {
  const src = { name: 'Dival', address: { city: 'Chamba', location: { temp: 'important' } } };
  const copy = deepClone(src);
  copy.address.location.temp = 'changed';
  assert.equal(src.address.location.temp, 'important');
  assert.deepEqual(deepClone(src), src);
});

test('arrays stay arrays', () => {
  const copy = deepClone({ list: [1, [2, 3]] });
  assert.ok(Array.isArray(copy.list));
  assert.deepEqual(copy, { list: [1, [2, 3]] });
});

test('Date, Map and Set are cloned as their own types', () => {
  const src = { d: new Date(5), m: new Map([['k', { v: 1 }]]), s: new Set([1, 2]) };
  const copy = deepClone(src);
  assert.ok(copy.d instanceof Date && copy.d !== src.d && copy.d.getTime() === 5);
  assert.ok(copy.m instanceof Map && copy.m.get('k') !== src.m.get('k'));
  assert.deepEqual(copy.m.get('k'), { v: 1 });
  assert.ok(copy.s instanceof Set && copy.s !== src.s && copy.s.has(2));
});

test('circular references are preserved, not infinite', () => {
  const a: any = { name: 'a' };
  a.self = a;
  const copy = deepClone(a);
  assert.ok(copy !== a);
  assert.ok(copy.self === copy);
});

test('primitives and functions pass through', () => {
  const f = () => 1;
  assert.equal(deepClone(f), f);
  assert.equal(deepClone(5), 5);
  assert.equal(deepClone(null), null);
});
