import { compose, pipe } from './solution';

const addPrefix = (s: string) => 'prefix-' + s;
const addSuffix = (s: string) => s + '-suffix';
const upper = (s: string) => s.toUpperCase();

test('pipe runs left to right', () => {
  assert.equal(pipe(addPrefix, addSuffix, upper)('hello'), 'PREFIX-HELLO-SUFFIX');
  assert.equal(pipe(upper, addPrefix, addSuffix)('hello'), 'prefix-HELLO-suffix');
});

test('compose runs right to left', () => {
  assert.equal(compose(upper, addPrefix, addSuffix)('hello'), 'PREFIX-HELLO-SUFFIX');
});

test('the first function can take several arguments', () => {
  assert.equal(pipe((a: number, b: number) => a + b, (n: number) => n * 10)(2, 3), 50);
});

test('no functions = identity', () => {
  assert.equal(pipe()('same'), 'same');
  assert.equal(compose()('same'), 'same');
});
