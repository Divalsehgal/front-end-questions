import { pyramid, updateInventory } from './solution';
test('pyramid', () => {
  assert.equal(pyramid(1), '#\n');
  assert.equal(pyramid(3), '  #\n ###\n#####\n');
  assert.equal(pyramid(0), '');
});
test('updateInventory', () => {
  const cur: [number, string][] = [[21, 'Bowling Ball'], [2, 'Dirty Sock'], [1, 'Hair Pin'], [5, 'Microphone']];
  const fresh: [number, string][] = [[2, 'Hair Pin'], [3, 'Half-Eaten Apple'], [67, 'Bowling Ball'], [7, 'Toothpaste']];
  assert.deepEqual(updateInventory(cur, fresh), [[88, 'Bowling Ball'], [2, 'Dirty Sock'], [3, 'Hair Pin'], [3, 'Half-Eaten Apple'], [5, 'Microphone'], [7, 'Toothpaste']]);
  assert.deepEqual(cur[0], [21, 'Bowling Ball'], 'input mutated');
  assert.deepEqual(updateInventory([], [[1, 'b'], [2, 'a']]), [[2, 'a'], [1, 'b']]);
});
