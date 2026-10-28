import { shuffle } from './solution';
test('returns the same array, same elements', () => {
  const arr = [1, 2, 3, 4, 5];
  const out = shuffle(arr);
  assert.equal(out, arr);
  assert.deepEqual([...out].sort(), [1, 2, 3, 4, 5]);
});
test('all 6 permutations of 3 items appear roughly equally', () => {
  const counts: Record<string, number> = {};
  const N = 60000;
  for (let i = 0; i < N; i++) {
    const key = shuffle([1, 2, 3]).join('');
    counts[key] = (counts[key] ?? 0) + 1;
  }
  assert.equal(Object.keys(counts).length, 6, 'some permutations never appear');
  for (const [perm, c] of Object.entries(counts)) {
    assert.ok(Math.abs(c / N - 1 / 6) < 0.02, `permutation ${perm} appeared ${((c / N) * 100).toFixed(1)}% of the time (expected ~16.7%)`);
  }
});
