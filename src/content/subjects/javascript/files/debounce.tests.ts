import { debounce } from './solution';

clock.install();

test('calls once, after the wait, with the last arguments', () => {
  const f = fn();
  const d = debounce(f, 100);
  d(1);
  d(2);
  clock.tick(99);
  d(3);
  clock.tick(99);
  assert.equal(f.callCount, 0, 'fired too early');
  clock.tick(1);
  assert.equal(f.callCount, 1);
  assert.deepEqual(f.calls[0], [3]);
});

test('keeps `this` of the last call', () => {
  let seen: unknown;
  const obj = { save: debounce(function (this: unknown) { seen = this; }, 10) };
  obj.save();
  clock.tick(10);
  assert.equal(seen, obj);
});

test('cancel() drops the pending call', () => {
  const f = fn();
  const d = debounce(f, 50);
  d();
  d.cancel();
  clock.tick(100);
  assert.equal(f.callCount, 0);
});

test('flush() runs the pending call now, and not again later', () => {
  const f = fn();
  const d = debounce(f, 50);
  d('a');
  d.flush();
  assert.deepEqual(f.calls, [['a']]);
  clock.tick(100);
  assert.equal(f.callCount, 1);
});

test('flush() with nothing pending does nothing', () => {
  const f = fn();
  const d = debounce(f, 50);
  d.flush();
  d('x');
  clock.tick(50);
  d.flush();
  assert.equal(f.callCount, 1);
});
