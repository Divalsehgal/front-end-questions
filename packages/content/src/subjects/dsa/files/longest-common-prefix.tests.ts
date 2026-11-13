import { longestCommonPrefix } from './solution';
test('examples', () => {
  assert.equal(longestCommonPrefix(['flower', 'flow', 'flight']), 'fl');
  assert.equal(longestCommonPrefix(['dog', 'racecar', 'car']), '');
  assert.equal(longestCommonPrefix(['ab', 'a']), 'a');
});
test('edge cases', () => {
  assert.equal(longestCommonPrefix(['alone']), 'alone');
  assert.equal(longestCommonPrefix([]), '');
  assert.equal(longestCommonPrefix(['', 'abc']), '');
});
