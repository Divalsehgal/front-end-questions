import { allConstruct, canConstruct, countConstruct } from './solution';
const sortWays = (ways: string[][]) => ways.map((w) => w.join('|')).sort();
test('canConstruct', () => {
  assert.equal(canConstruct('abcdef', ['ab', 'abc', 'cd', 'def', 'abcd']), true);
  assert.equal(canConstruct('skateboard', ['bo', 'rd', 'ate', 't', 'ska', 'sk', 'boar']), false);
  assert.equal(canConstruct('', ['cat']), true);
});
test('countConstruct', () => {
  assert.equal(countConstruct('purple', ['purp', 'p', 'ur', 'le', 'purpl']), 2);
  assert.equal(countConstruct('abcdef', ['ab', 'abc', 'cd', 'def', 'abcd']), 1);
});
test('allConstruct', () => {
  assert.deepEqual(sortWays(allConstruct('purple', ['purp', 'p', 'ur', 'le', 'purpl'])), ['purp|le', 'p|ur|p|le']);
  assert.deepEqual(allConstruct('', ['x']), [[]]);
  assert.deepEqual(allConstruct('hello', ['cat']), []);
});
test('memoized: pathological input is fast', () => {
  const start = Date.now();
  assert.equal(canConstruct('e'.repeat(25) + 'f', ['e', 'ee', 'eee', 'eeee', 'eeeee', 'eeeeee']), false);
  assert.equal(countConstruct('e'.repeat(25) + 'f', ['e', 'ee', 'eee', 'eeee', 'eeeee', 'eeeeee']), 0);
  assert.ok(Date.now() - start < 100, 'too slow: memoize on the remaining string');
});
