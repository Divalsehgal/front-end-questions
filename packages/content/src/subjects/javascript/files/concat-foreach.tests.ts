import { concat, forEach } from './solution';

test('concat flattens array arguments one level and copies', () => {
  const base = [1, 2, 3];
  const out = concat<unknown>(base, [4, 5], 6, [[7]]);
  assert.deepEqual(out, [1, 2, 3, 4, 5, 6, [7]]);
  assert.notEqual(out, base);
  assert.deepEqual(base, [1, 2, 3]);
});

test('forEach visits values with index and array, honours thisArg, skips holes', () => {
  const seen: unknown[] = [];
  const sparse = [10, , 30]; // eslint-disable-line no-sparse-arrays
  const ret = forEach(sparse, function (this: { tag: string }, v, i, a) {
    seen.push([this.tag, v, i, a === sparse]);
  }, { tag: 't' });
  assert.equal(ret, undefined);
  assert.deepEqual(seen, [['t', 10, 0, true], ['t', 30, 2, true]]);
});
