import { retry } from './solution';

const failTimes = (n: number) => {
  let calls = 0;
  const run = async (_signal: AbortSignal) => {
    calls++;
    if (calls <= n) throw new Error(`fail ${calls}`);
    return 'ok';
  };
  return { run, calls: () => calls };
};

test('first success: called once', async () => {
  const f = failTimes(0);
  assert.equal(await retry(f.run, { retries: 3, baseDelayMs: 1 }), 'ok');
  assert.equal(f.calls(), 1);
});

test('retries until it succeeds', async () => {
  const f = failTimes(2);
  assert.equal(await retry(f.run, { retries: 3, baseDelayMs: 1 }), 'ok');
  assert.equal(f.calls(), 3);
});

test('gives up after retries + 1 calls with the LAST error', async () => {
  const f = failTimes(10);
  await assert.rejects(retry(f.run, { retries: 2, baseDelayMs: 1 }), /fail 3/);
  assert.equal(f.calls(), 3);
});

test('delays grow exponentially (20 + 40 + 80)', async () => {
  const f = failTimes(3);
  const start = Date.now();
  await retry(f.run, { retries: 3, baseDelayMs: 20 });
  assert.ok(Date.now() - start >= 135, `only took ${Date.now() - start}ms`);
});

test('passes an AbortSignal to fn', async () => {
  let got: unknown;
  await retry(async (s) => { got = s; return 1; }, { retries: 0, baseDelayMs: 1 });
  assert.ok(got instanceof AbortSignal, 'fn did not receive an AbortSignal');
});

test('aborting during a wait rejects right away with the abort reason', async () => {
  const f = failTimes(10);
  const ctrl = new AbortController();
  const start = Date.now();
  setTimeout(() => ctrl.abort(new Error('cancelled by user')), 30);
  await assert.rejects(retry(f.run, { retries: 5, baseDelayMs: 1000, signal: ctrl.signal }), /cancelled by user/);
  assert.ok(Date.now() - start < 500, 'kept waiting after abort');
  assert.equal(f.calls(), 1);
});

test('already-aborted signal: fn is never called', async () => {
  const f = failTimes(0);
  await assert.rejects(retry(f.run, { retries: 1, baseDelayMs: 1, signal: AbortSignal.abort(new Error('nope')) }), /nope/);
  assert.equal(f.calls(), 0);
});
