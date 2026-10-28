import { memoize } from './solution';

test('caches by first argument', () => {
  const square = fn((n: number) => n * n);
  const m = memoize(square);
  assert.equal(m(4), 16);
  assert.equal(m(4), 16);
  assert.equal(m(5), 25);
  assert.equal(square.callCount, 2);
});

test('object keys are compared by reference', () => {
  const f = fn((o: { id: number }) => o.id);
  const m = memoize(f);
  const a = { id: 1 };
  m(a);
  m(a);
  m({ id: 1 });
  assert.equal(f.callCount, 2);
});

test('resolver builds the key', () => {
  const add = fn((a: number, b: number) => a + b);
  const m = memoize(add, (a, b) => `${a}|${b}`);
  assert.equal(m(1, 2), 3);
  assert.equal(m(1, 3), 4);
  assert.equal(m(1, 2), 3);
  assert.equal(add.callCount, 2);
});

test('an undefined result is still cached', () => {
  const f = fn((_k: string) => undefined);
  const m = memoize(f);
  m('x');
  m('x');
  assert.equal(f.callCount, 1);
});

test('.cache is exposed and clearable', () => {
  const f = fn((n: number) => n);
  const m = memoize(f);
  m(1);
  m.cache.clear();
  m(1);
  assert.equal(f.callCount, 2);
});
