import { promiseAllSettled } from './solution';

Promise.allSettled = () => { throw new Error('Promise.allSettled is disabled'); };
Promise.all = () => { throw new Error('Promise.all is disabled'); };
const wait = <T,>(ms: number, v: T) => new Promise<T>((r) => setTimeout(r, ms, v));

test('reports every outcome in input order', async () => {
  const out = await promiseAllSettled<unknown>([wait(20, 'a'), Promise.reject(new Error('b')), 3]);
  assert.equal(out.length, 3);
  assert.deepEqual(out[0], { status: 'fulfilled', value: 'a' });
  assert.equal(out[1].status, 'rejected');
  assert.equal((out[1] as any).reason.message, 'b');
  assert.deepEqual(out[2], { status: 'fulfilled', value: 3 });
});

test('never rejects, even if everything fails', async () => {
  const out = await promiseAllSettled([Promise.reject(1), Promise.reject(2)]);
  assert.deepEqual(out, [{ status: 'rejected', reason: 1 }, { status: 'rejected', reason: 2 }]);
});

test('empty input resolves to []', async () => {
  assert.deepEqual(await promiseAllSettled([]), []);
});
