import { createCounter } from './solution';

test('increment / decrement / reset', () => {
  const c = createCounter(5);
  assert.equal(c.increment(), 6);
  assert.equal(c.reset(), 5);
  assert.equal(c.decrement(), 4);
  assert.equal(c.reset(), 5);
});

test('counters are independent', () => {
  const a = createCounter(0);
  const b = createCounter(100);
  a.increment();
  a.increment();
  assert.equal(b.increment(), 101);
  assert.equal(a.increment(), 3);
});

test('the count is private', () => {
  const c = createCounter(1) as any;
  assert.deepEqual(Object.keys(c).sort(), ['decrement', 'increment', 'reset']);
});

test('methods still work when destructured', () => {
  const { increment } = createCounter(10);
  assert.equal(increment(), 11);
});
