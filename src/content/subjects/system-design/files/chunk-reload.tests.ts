import { createChunkErrorHandler } from './solution';

const memoryStore = () => {
  const data = new Map<string, string>();
  return { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => void data.set(k, v) };
};
const event = () => ({ preventDefault: fn() });

test('the first failure reloads and stops the error from being thrown', () => {
  const reload = fn();
  const handle = createChunkErrorHandler({ storage: memoryStore(), reload, now: () => 1_000 });
  const e = event();
  handle(e);
  assert.equal(reload.callCount, 1);
  assert.equal(e.preventDefault.callCount, 1);
});

test('a second failure right after the reload does not reload again', () => {
  // The same storage plays the part of sessionStorage across the reload.
  const storage = memoryStore();
  let t = 1_000;
  const reload = fn();
  createChunkErrorHandler({ storage, reload, now: () => t })(event());
  t += 2_000;
  const e = event();
  createChunkErrorHandler({ storage, reload, now: () => t })(e);
  assert.equal(reload.callCount, 1, 'reloaded twice within the window: this would loop');
  assert.equal(e.preventDefault.callCount, 0, 'the error must reach the error boundary');
});

test('a failure after the window has passed may reload again', () => {
  const storage = memoryStore();
  let t = 1_000;
  const reload = fn();
  const handle = createChunkErrorHandler({ storage, reload, now: () => t, windowMs: 10_000 });
  handle(event());
  t += 10_000;
  handle(event());
  assert.equal(reload.callCount, 2);
});

test('defaults to a 10 second window', () => {
  const storage = memoryStore();
  let t = 50_000;
  const reload = fn();
  const handle = createChunkErrorHandler({ storage, reload, now: () => t });
  handle(event());
  t += 9_999;
  handle(event());
  assert.equal(reload.callCount, 1);
  t += 1;
  handle(event());
  assert.equal(reload.callCount, 2);
});

test('never reloads when storage throws (no way to guard against a loop)', () => {
  const reload = fn();
  const broken = {
    getItem: () => {
      throw new Error('SecurityError');
    },
    setItem: () => {
      throw new Error('SecurityError');
    },
  };
  const e = event();
  createChunkErrorHandler({ storage: broken, reload, now: () => 1_000 })(e);
  assert.equal(reload.callCount, 0);
  assert.equal(e.preventDefault.callCount, 0);
});
