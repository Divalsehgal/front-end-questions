import { sym } from './solution';

test('two arrays', () => {
  assert.deepEqual(sym([1, 2, 3], [5, 2, 1, 4]), [3, 5, 4]);
});

test('applies pairwise across several arrays', () => {
  assert.deepEqual(sym([1, 2, 5], [2, 3, 5], [3, 4, 5]), [1, 4, 5]);
});

test('duplicates inside an array count once', () => {
  assert.deepEqual(sym([1, 1, 2], [2, 3, 3]), [1, 3]);
});

test('identical arrays → empty', () => {
  assert.deepEqual(sym([1, 2], [2, 1]), []);
});
