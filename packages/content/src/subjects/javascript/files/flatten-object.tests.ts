import { flattenObject } from './solution';

test('flattens nested objects with dot paths', () => {
  const nested = { user: { name: 'John', address: { city: 'NYC', zip: 10001 } }, active: true };
  assert.deepEqual(flattenObject(nested), { 'user.name': 'John', 'user.address.city': 'NYC', 'user.address.zip': 10001, active: true });
});

test('arrays become index keys', () => {
  assert.deepEqual(flattenObject({ tags: ['a', 'b'] }), { 'tags.0': 'a', 'tags.1': 'b' });
});

test('null is a value, not an object to recurse into', () => {
  assert.deepEqual(flattenObject({ a: null, b: { c: null } }), { a: null, 'b.c': null });
});

test('empty nested objects disappear; dates stay as values', () => {
  const d = new Date(0);
  assert.deepEqual(flattenObject({ a: {}, when: d }), { when: d });
});
