import { containsNearbyDuplicate, groupAnagrams, isAnagram } from './solution';
test('isAnagram', () => {
  assert.equal(isAnagram('anagram', 'nagaram'), true);
  assert.equal(isAnagram('rat', 'car'), false);
  assert.equal(isAnagram('ab', 'a'), false);
});
test('groupAnagrams', () => {
  assert.deepEqual(groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']), [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]);
  assert.deepEqual(groupAnagrams(['']), [['']]);
});
test('containsNearbyDuplicate', () => {
  assert.equal(containsNearbyDuplicate([1, 2, 3, 1], 3), true);
  assert.equal(containsNearbyDuplicate([1, 0, 1, 1], 1), true);
  assert.equal(containsNearbyDuplicate([1, 2, 3, 1, 2, 3], 2), false);
});
