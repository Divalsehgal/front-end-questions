import { capitalize, mySplit, omit, pick, reverse } from './solution';
const user = { id: 1, name: 'Paul', password: 'x', website: 'paul.dev' };
test('pick and omit', () => {
  assert.deepEqual(pick(user, ['name', 'website']), { name: 'Paul', website: 'paul.dev' });
  assert.deepEqual(omit(user, ['password', 'id']), { name: 'Paul', website: 'paul.dev' });
  assert.deepEqual(pick({ a: 1 } as { a: number; b?: number }, ['b']), {});
});
test('capitalize', () => {
  assert.equal(capitalize('my name is dival'), 'My Name Is Dival');
  assert.equal(capitalize('a'), 'A');
  assert.equal(capitalize("don't stop"), "Don't Stop");
});
test('reverse strings and numbers', () => {
  assert.equal(reverse('dival'), 'lavid');
  assert.equal(reverse(1342), 2431);
  assert.equal(reverse(-120), -21);
});
test('mySplit', () => {
  const real = String.prototype.split;
  String.prototype.split = (() => { throw new Error('native split is disabled'); }) as any;
  try {
    assert.deepEqual(mySplit('dival.a.b.c', '.'), ['dival', 'a', 'b', 'c']);
    assert.deepEqual(mySplit('a,,b', ','), ['a', '', 'b']);
    assert.deepEqual(mySplit('a--b--c', '--'), ['a', 'b', 'c']);
    assert.deepEqual(mySplit('abc', ','), ['abc']);
  } finally {
    String.prototype.split = real;
  }
});
