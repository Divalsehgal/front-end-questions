import { startCar, toMillionsAdapter, withLogging, withRetry } from './solution';
test('withLogging logs calls and keeps behaviour', () => {
  const lines: string[] = [];
  const sum = withLogging((a: number, b: number) => a + b, 'sum', (l) => lines.push(l));
  assert.equal(sum(4, 9), 13);
  assert.deepEqual(lines, ['sum(4, 9) → 13']);
});
test('withLogging keeps this', () => {
  const obj = { k: 2, double: withLogging(function (this: { k: number }, n: number) { return n * this.k; }, 'double', () => {}) };
  assert.equal(obj.double(5), 10);
});
test('withRetry', async () => {
  let calls = 0;
  const flaky = withRetry(async () => {
    calls++;
    if (calls < 3) throw new Error(`fail ${calls}`);
    return 'ok';
  }, 3);
  assert.equal(await flaky(), 'ok');
  assert.equal(calls, 3);
  let n = 0;
  await assert.rejects(withRetry(async () => { n++; throw new Error(`nope ${n}`); }, 2)(), /nope 3/);
});
test('adapter', () => {
  assert.deepEqual(toMillionsAdapter({ city: 'Buenos Aires', habitants: 3100000 }), { city: 'Buenos Aires', habitants: 3.1 });
  assert.deepEqual(toMillionsAdapter({ city: 'X', habitants: 8_849_999 }), { city: 'X', habitants: 8.8 });
});
test('facade', () => {
  const ok = { checkFuel: () => 'fuel ok', checkBattery: () => 'battery ok', startEngine: () => 'engine started' };
  assert.deepEqual(startCar(ok), ['fuel ok', 'battery ok', 'engine started']);
  let started = false;
  const bad = { checkFuel: () => 'fuel ok', checkBattery: () => { throw new Error('battery dead'); }, startEngine: () => { started = true; return 'x'; } };
  let msg = '';
  try {
    startCar(bad);
  } catch (e) {
    msg = (e as Error).message;
  }
  assert.equal(msg, 'battery dead');
  assert.equal(started, false);
});
