import { flatten } from './solution';

const nested = () => [1, [2, [3, [4]]], 5];

test('default depth is 1', () => {
  assert.deepEqual(flatten(nested()), [1, 2, [3, [4]], 5]);
});

test('custom depth and Infinity', () => {
  assert.deepEqual(flatten(nested(), 2), [1, 2, 3, [4], 5]);
  assert.deepEqual(flatten(nested(), Infinity), [1, 2, 3, 4, 5]);
});

test('depth 0 is a shallow copy', () => {
  const input = nested();
  const out = flatten(input, 0);
  assert.deepEqual(out, input);
  assert.notEqual(out, input, 'must return a new array');
});

test('does not mutate the input', () => {
  const input = nested();
  flatten(input, Infinity);
  assert.deepEqual(input, nested());
});

test('no recursion and no .flat (100,000 levels deep)', () => {
  (Array.prototype as any).flat = () => { throw new Error('.flat is disabled'); };
  let deep: unknown[] = [1];
  for (let i = 0; i < 100000; i++) deep = [deep];
  assert.deepEqual(flatten(deep, Infinity), [1]);
});
