import { maxDistToClosest } from './solution';
test('middle gap', () => {
  assert.equal(maxDistToClosest([1, 0, 0, 0, 1, 0, 1]), 2);
});
test('edges count fully', () => {
  assert.equal(maxDistToClosest([1, 0, 0, 0]), 3);
  assert.equal(maxDistToClosest([0, 0, 1]), 2);
});
test('long middle gap', () => {
  assert.equal(maxDistToClosest([1, 0, 0, 0, 0, 0, 0, 0, 1, 0]), 4);
});
