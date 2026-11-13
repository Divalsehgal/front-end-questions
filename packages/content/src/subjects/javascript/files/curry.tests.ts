import { curry } from './solution';

const add3 = curry((a: number, b: number, c: number) => a + b + c);

test('any grouping of arguments works', () => {
  assert.equal(add3(1)(2)(3), 6);
  assert.equal(add3(1, 2)(3), 6);
  assert.equal(add3(1)(2, 3), 6);
  assert.equal(add3(1, 2, 3), 6);
});

test('partials are independent and reusable', () => {
  const add1 = add3(1);
  assert.equal(add1(10)(100), 111);
  assert.equal(add1(20)(200), 221);
});

test('zero-arity function is called immediately', () => {
  assert.equal(curry(() => 'now')(), 'now');
});

test('keeps `this` from the final call', () => {
  const obj = { base: 10, sum: curry(function (this: { base: number }, a: number, b: number) { return this.base + a + b; }) };
  assert.equal(obj.sum(1, 2), 13);
});
