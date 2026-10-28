import { once } from './solution';

test('runs fn only the first time', () => {
  const f = fn((n: number) => n * 2);
  const o = once(f);
  assert.equal(o(2), 4);
  assert.equal(o(10), 4, 'later calls return the FIRST result');
  assert.equal(f.callCount, 1);
});

test('each once() wrapper is independent', () => {
  const name = (n: string) => n;
  const a = once(name);
  const b = once(name);
  assert.equal(a('Dival'), 'Dival');
  assert.equal(a('Zoro'), 'Dival');
  assert.equal(b('Minal'), 'Minal');
});

test('keeps `this` of the first call', () => {
  const obj = { x: 7, get: once(function (this: { x: number }) { return this.x; }) };
  assert.equal(obj.get(), 7);
});

test('caches undefined results too', () => {
  const f = fn(() => undefined);
  const o = once(f);
  o();
  o();
  assert.equal(f.callCount, 1);
});
