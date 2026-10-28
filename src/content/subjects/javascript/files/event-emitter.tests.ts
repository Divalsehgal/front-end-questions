import { Emitter } from './solution';

type Events = { login: { userId: string }; logout: void; count: number };

test('on + emit delivers the payload, in subscription order', () => {
  const e = new Emitter<Events>();
  const seen: string[] = [];
  e.on('login', (p: any) => seen.push(`a:${p.userId}`));
  e.on('login', (p: any) => seen.push(`b:${p.userId}`));
  e.emit('login', { userId: 'u1' });
  assert.deepEqual(seen, ['a:u1', 'b:u1']);
});

test('void events take no payload; emitting with no listeners is fine', () => {
  const e = new Emitter<Events>();
  e.emit('logout');
  const f = fn();
  e.on('logout', f);
  e.emit('logout');
  assert.equal(f.callCount, 1);
});

test('on returns an unsubscribe function; off works too', () => {
  const e = new Emitter<Events>();
  const a = fn();
  const b = fn();
  const unsubA = e.on('count', a);
  e.on('count', b);
  unsubA();
  e.off('count', b);
  e.emit('count', 1);
  assert.equal(a.callCount + b.callCount, 0);
});

test('once fires a single time', () => {
  const e = new Emitter<Events>();
  const f = fn();
  e.once('count', f);
  e.emit('count', 1);
  e.emit('count', 2);
  assert.deepEqual(f.calls, [[1]]);
});

test('once can be cancelled before it fires', () => {
  const e = new Emitter<Events>();
  const f = fn();
  const cancel = e.once('count', f);
  cancel();
  e.emit('count', 1);
  assert.equal(f.callCount, 0);
});

test('a listener removing itself mid-emit does not skip the next one', () => {
  const e = new Emitter<Events>();
  const order: string[] = [];
  const first = () => {
    order.push('first');
    e.off('count', first);
  };
  e.on('count', first);
  e.on('count', () => order.push('second'));
  e.emit('count', 1);
  e.emit('count', 2);
  assert.deepEqual(order, ['first', 'second', 'second']);
});
