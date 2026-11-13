import { importWithRetry } from './solution';

const noWait = () => fn(() => Promise.resolve());
// Fails `failures` times, then resolves with the module.
const flaky = (failures: number, mod = { default: 'Page' }) => {
  let n = 0;
  return fn(() => (n++ < failures ? Promise.reject(new Error(`network error ${n}`)) : Promise.resolve(mod)));
};

test('resolves straight away when the first load works', async () => {
  const wait = noWait();
  const mod = { default: 'Checkout' };
  assert.equal(await importWithRetry(() => Promise.resolve(mod), { wait }), mod);
  assert.equal(wait.callCount, 0);
});

test('retries after a failure and resolves with the module', async () => {
  const load = flaky(1);
  const result = await importWithRetry(load, { wait: noWait() });
  assert.deepEqual(result, { default: 'Page' });
  assert.equal(load.callCount, 2);
});

test('backs off exponentially from baseDelayMs', async () => {
  const wait = noWait();
  await importWithRetry(flaky(3), { retries: 3, baseDelayMs: 100, wait });
  assert.deepEqual(wait.calls, [[100], [200], [400]]);
});

test('defaults to 2 retries starting at 500ms', async () => {
  const wait = noWait();
  const load = flaky(2);
  await importWithRetry(load, { wait });
  assert.equal(load.callCount, 3);
  assert.deepEqual(wait.calls, [[500], [1000]]);
});

test('gives up after `retries` retries with the last error, without a pointless final wait', async () => {
  const wait = noWait();
  const load = flaky(10);
  await assert.rejects(importWithRetry(load, { retries: 2, wait }), /network error 3/);
  assert.equal(load.callCount, 3);
  assert.equal(wait.callCount, 2);
});

test('retries: 0 means a single attempt', async () => {
  const load = flaky(1);
  await assert.rejects(importWithRetry(load, { retries: 0, wait: noWait() }), /network error 1/);
  assert.equal(load.callCount, 1);
});
