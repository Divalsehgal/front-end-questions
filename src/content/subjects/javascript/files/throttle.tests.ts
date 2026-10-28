import { throttle } from './solution';

clock.install();
const firstArgs = (f: { calls: unknown[][] }) => f.calls.map((c) => c[0]);

test('leading call runs immediately', () => {
  const f = fn();
  throttle(f, 100)(1);
  assert.deepEqual(firstArgs(f), [1]);
});

test('calls inside the window collapse into ONE trailing call with the latest args', () => {
  const f = fn();
  const t = throttle(f, 100);
  t(1);
  t(2);
  t(3);
  assert.deepEqual(firstArgs(f), [1]);
  clock.tick(100);
  assert.deepEqual(firstArgs(f), [1, 3]);
});

test('no trailing call if nothing happened during the window', () => {
  const f = fn();
  const t = throttle(f, 100);
  t(1);
  clock.tick(500);
  assert.deepEqual(firstArgs(f), [1]);
});

test('keeps the caller\'s `this` for leading and trailing calls', () => {
  const seen: unknown[] = [];
  const obj = { t: throttle(function (this: unknown) { seen.push(this); }, 100) };
  obj.t();
  obj.t();
  clock.tick(100);
  assert.deepEqual(seen, [obj, obj]);
});

test('runs immediately again once the window has passed', () => {
  const f = fn();
  const t = throttle(f, 100);
  t(1);
  t(2);
  clock.tick(100); // trailing 2 fires and opens a new window until 200
  clock.tick(200);
  t(4);
  assert.deepEqual(firstArgs(f), [1, 2, 4]);
});
