import { expect } from './solution';

const throwsWith = (f: () => unknown, msg: string) => {
  try {
    f();
  } catch (e) {
    assert.equal((e as Error).message, msg);
    return;
  }
  assert.ok(false, `expected it to throw "${msg}"`);
};

test('toBe uses Object.is', () => {
  assert.equal(expect(Number.NaN).toBe(Number.NaN), true);
  throwsWith(() => expect(0).toBe(-0), 'Not Equal');
  assert.equal(expect(5).toBe(5), true);
  throwsWith(() => expect(5).toBe('5'), 'Not Equal');
  throwsWith(() => expect({}).toBe({}), 'Not Equal');
});

test('notToBe', () => {
  assert.equal(expect(5).notToBe(null), true);
  throwsWith(() => expect(5).notToBe(5), 'Equal');
});

test('toEqual compares deeply', () => {
  assert.equal(expect({ a: [1, { b: 2 }] }).toEqual({ a: [1, { b: 2 }] }), true);
  throwsWith(() => expect({ a: 1 }).toEqual({ a: 2 }), 'Not Deep Equal');
});
