import { getProperty, pair, update } from './solution';

test('getProperty reads the key', () => {
  const user = { name: 'Alice', age: 30 };
  assert.equal(getProperty(user, 'name'), 'Alice');
  assert.equal(getProperty(user, 'age'), 30);
});

test('update returns a new merged object without mutating', () => {
  const base = { name: 'Carol', age: 28 };
  const next = update(base, { age: 29 });
  assert.deepEqual(next, { name: 'Carol', age: 29 });
  assert.notEqual(next, base);
  assert.equal(base.age, 28);
});

test('pair returns a 2-tuple', () => {
  assert.deepEqual(pair('hello', 42), ['hello', 42]);
});
