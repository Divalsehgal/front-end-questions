import { promiseAny } from './solution';

Promise.any = () => { throw new Error('Promise.any is disabled'); };
const wait = <T,>(ms: number, v: T) => new Promise<T>((r) => setTimeout(r, ms, v));
const fail = (ms: number, msg: string) => new Promise<never>((_, j) => setTimeout(() => j(new Error(msg)), ms));

test('resolves with the FIRST success, ignoring earlier failures', async () => {
  assert.equal(await promiseAny([fail(1, 'x'), wait(30, 'slow'), wait(10, 'fast')]), 'fast');
});

test('rejects with an AggregateError holding every reason, in input order', async () => {
  let err: any;
  try {
    await promiseAny([fail(20, 'a'), fail(5, 'b')]);
  } catch (e) {
    err = e;
  }
  assert.ok(err !== undefined, 'should have rejected');
  assert.ok(err instanceof AggregateError, 'expected an AggregateError');
  assert.deepEqual(err.errors.map((x: Error) => x.message), ['a', 'b']);
});

test('empty input rejects with AggregateError', async () => {
  let err: unknown;
  try {
    await promiseAny([]);
  } catch (e) {
    err = e;
  }
  assert.ok(err instanceof AggregateError, 'expected it to reject with an AggregateError');
});
