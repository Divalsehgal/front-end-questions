import { range, take } from './solution';

test('works with spread and for...of', () => {
  assert.deepEqual([...range(1, 5)], [1, 2, 3, 4, 5]);
  const seen: number[] = [];
  for (const n of range(0, 10, 5)) seen.push(n);
  assert.deepEqual(seen, [0, 5, 10]);
});

test('negative step counts down; empty when out of order', () => {
  assert.deepEqual([...range(3, 1, -1)], [3, 2, 1]);
  assert.deepEqual([...range(5, 1)], []);
});

test('each iteration starts fresh', () => {
  const r = range(1, 3);
  assert.deepEqual([...r], [1, 2, 3]);
  assert.deepEqual([...r], [1, 2, 3]);
});

test('implements the protocol by hand: [Symbol.iterator]().next()', () => {
  const it = range(1, 2)[Symbol.iterator]();
  assert.deepEqual(it.next(), { value: 1, done: false });
  assert.deepEqual(it.next(), { value: 2, done: false });
  assert.equal(it.next().done, true);
});

test('take is lazy and works on infinite iterables', () => {
  let pulled = 0;
  const naturals = {
    [Symbol.iterator]() {
      let n = 0;
      return { next: () => (pulled++, { value: n++, done: false }) };
    },
  };
  assert.deepEqual(take(naturals, 3), [0, 1, 2]);
  assert.ok(pulled <= 4, `pulled ${pulled} values to take 3`);
  assert.deepEqual(take(range(1, 2), 5), [1, 2]);
});
