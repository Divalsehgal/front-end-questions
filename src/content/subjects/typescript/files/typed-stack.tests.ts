import { Stack } from './solution';

test('LIFO order', () => {
  const s = new Stack<number>();
  s.push(1);
  s.push(2);
  assert.equal(s.peek(), 2);
  assert.equal(s.pop(), 2);
  assert.equal(s.pop(), 1);
});

test('empty stack returns undefined and reports empty', () => {
  const s = new Stack<string>();
  assert.equal(s.isEmpty(), true);
  assert.equal(s.pop(), undefined);
  assert.equal(s.peek(), undefined);
  s.push('a');
  assert.equal(s.size, 1);
  assert.equal(s.isEmpty(), false);
});

test('internal storage is not exposed', () => {
  const s: any = new Stack<number>();
  s.push(1);
  assert.deepEqual(Object.keys(s), [], 'storage should be a private (#) field, not a visible property');
});
