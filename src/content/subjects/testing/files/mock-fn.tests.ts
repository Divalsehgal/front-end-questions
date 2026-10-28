import { mockFn } from './solution';

test('records calls and results', () => {
  const m = mockFn((a: number, b: number) => a + b);
  assert.equal(m(1, 2), 3);
  m(5, 5);
  assert.deepEqual(m.mock.calls, [[1, 2], [5, 5]]);
  assert.deepEqual(m.mock.results, [{ type: 'return', value: 3 }, { type: 'return', value: 10 }]);
});

test('records throws and rethrows', () => {
  const m = mockFn(() => {
    throw new Error('boom');
  });
  let caught = false;
  try {
    m();
  } catch {
    caught = true;
  }
  assert.ok(caught);
  assert.equal(m.mock.results[0].type, 'throw');
});

test('return value configuration, once-values first', () => {
  const m = mockFn().mockReturnValue('default').mockReturnValueOnce('first').mockReturnValueOnce('second');
  assert.deepEqual([m(), m(), m(), m()], ['first', 'second', 'default', 'default']);
});

test('mockImplementation and chaining', () => {
  const m = mockFn();
  assert.equal(m.mockImplementation((x: number) => x * 2), m);
  assert.equal(m(4), 8);
  assert.equal(mockFn()(), undefined);
});

test('mockClear vs mockReset', () => {
  const m = mockFn().mockReturnValue(1);
  m();
  m.mockClear();
  assert.deepEqual(m.mock.calls, []);
  assert.equal(m(), 1, 'clear keeps the implementation');
  m.mockReset();
  assert.equal(m(), undefined, 'reset removes it');
  assert.equal(m.mock.calls.length, 1);
});

test('mockResolvedValue', async () => {
  const m = mockFn().mockResolvedValue({ ok: true });
  assert.deepEqual(await m(), { ok: true });
});
