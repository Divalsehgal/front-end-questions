import { promiseAll } from './solution';

const wait = <T,>(ms: number, v: T) => new Promise<T>((r) => setTimeout(r, ms, v));
Promise.all = () => { throw new Error('Promise.all is disabled: implement it yourself'); };
Promise.allSettled = () => { throw new Error('Promise.allSettled is disabled'); };

test('keeps INPUT order, not completion order', async () => {
  assert.deepEqual(await promiseAll([wait(30, 'slow'), wait(1, 'fast'), wait(10, 'mid')]), ['slow', 'fast', 'mid']);
});

test('plain values pass through', async () => {
  assert.deepEqual(await promiseAll<unknown>([1, Promise.resolve(2), 'x', null]), [1, 2, 'x', null]);
});

test('empty input resolves to []', async () => {
  assert.deepEqual(await promiseAll([]), []);
});

test('accepts any iterable (Set, generator)', async () => {
  function* gen() { yield 1; yield Promise.resolve(2); }
  assert.deepEqual(await promiseAll(new Set([1, 2])), [1, 2]);
  assert.deepEqual(await promiseAll(gen()), [1, 2]);
});

test('rejects FAST with the first rejection reason', async () => {
  const start = Date.now();
  await assert.rejects(promiseAll([wait(300, 'never'), Promise.reject(new Error('boom'))]), /boom/);
  assert.ok(Date.now() - start < 200, 'waited for the slow promise before rejecting');
});
