import { partial } from './solution';

const calculate = (x: number, y: number, z: number) => (x + y) * z;

test('prepends the preset arguments', () => {
  assert.equal(partial(calculate, 8, 2)(5), 50);
  assert.equal(partial(calculate, 1)(2, 3), 9);
});

test('works with no preset', () => {
  assert.equal(partial(calculate)(1, 1, 1), 2);
});

test('keeps `this`', () => {
  const obj = { k: 3, mul: partial(function (this: { k: number }, a: number, b: number) { return this.k * a * b; }, 2) };
  assert.equal(obj.mul(5), 30);
});
