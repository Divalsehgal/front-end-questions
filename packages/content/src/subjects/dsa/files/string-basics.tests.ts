import { gcdOfStrings, isPalindromePermutation, titleCase } from './solution';
test('titleCase', () => {
  assert.equal(titleCase('my name is dival sehgal'), 'My Name Is Dival Sehgal');
  assert.equal(titleCase('a'), 'A');
});
test('gcdOfStrings', () => {
  assert.equal(gcdOfStrings('ABABAB', 'ABAB'), 'AB');
  assert.equal(gcdOfStrings('ABCABC', 'ABC'), 'ABC');
  assert.equal(gcdOfStrings('LEET', 'CODE'), '');
});
test('isPalindromePermutation', () => {
  assert.equal(isPalindromePermutation('Tact Coa'), true);
  assert.equal(isPalindromePermutation('aab'), true);
  assert.equal(isPalindromePermutation('abc'), false);
});
