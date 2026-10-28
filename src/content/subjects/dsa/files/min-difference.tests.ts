import { minimumDifference } from './solution';
test('examples', () => {
  assert.equal(minimumDifference([90], 1), 0);
  assert.equal(minimumDifference([9, 4, 1, 7], 2), 2);
  assert.equal(minimumDifference([87063, 61094, 44530, 21297, 95857, 93551, 9918], 6), 74560);
});
test('k equal to length', () => {
  assert.equal(minimumDifference([5, 1, 9], 3), 8);
});
