import { isArray, isFunction, isObject, isPlainObject } from './solution';

class Foo {}

test('isArray', () => {
  assert.equal(isArray([]), true);
  assert.equal(isArray({ length: 0 }), false);
  assert.equal(isArray('abc'), false);
});

test('isFunction includes classes and arrows', () => {
  assert.equal(isFunction(() => {}), true);
  assert.equal(isFunction(Foo), true);
  assert.equal(isFunction(async () => {}), true);
  assert.equal(isFunction({}), false);
});

test('isObject: objects and functions, never null', () => {
  assert.equal(isObject({}), true);
  assert.equal(isObject([]), true);
  assert.equal(isObject(() => {}), true);
  assert.equal(isObject(null), false);
  assert.equal(isObject('x'), false);
});

test('isPlainObject', () => {
  assert.equal(isPlainObject({}), true);
  assert.equal(isPlainObject(Object.create(null)), true);
  assert.equal(isPlainObject(new Object()), true);
  assert.equal(isPlainObject([]), false);
  assert.equal(isPlainObject(new Date()), false);
  assert.equal(isPlainObject(new Foo()), false);
  assert.equal(isPlainObject(null), false);
});
