import { mySetInterval } from './solution';

clock.install();
globalThis.setInterval = (() => { throw new Error('setInterval is disabled'); }) as any;

test('calls fn every interval', () => {
  const f = fn();
  mySetInterval(f, 100);
  clock.tick(99);
  assert.equal(f.callCount, 0);
  clock.tick(1);
  assert.equal(f.callCount, 1);
  clock.tick(300);
  assert.equal(f.callCount, 4);
});

test('the returned function stops it', () => {
  const f = fn();
  const stop = mySetInterval(f, 50);
  clock.tick(120);
  stop();
  clock.tick(500);
  assert.equal(f.callCount, 2);
});

test('can be stopped from inside fn', () => {
  let stop = () => {};
  const f = fn(() => {
    if (f.callCount === 3) stop();
  });
  stop = mySetInterval(f, 10);
  clock.tick(200);
  assert.equal(f.callCount, 3);
});
