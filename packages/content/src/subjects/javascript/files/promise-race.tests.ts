import { promiseRace } from './solution';

Promise.race = () => { throw new Error('Promise.race is disabled'); };
const wait = <T,>(ms: number, v: T) => new Promise<T>((r) => setTimeout(r, ms, v));
const fail = (ms: number, msg: string) => new Promise<never>((_, j) => setTimeout(() => j(new Error(msg)), ms));

test('settles like the first to settle: success', async () => {
  assert.equal(await promiseRace([wait(30, 'slow'), wait(5, 'fast')]), 'fast');
});

test('settles like the first to settle: failure', async () => {
  await assert.rejects(promiseRace([wait(30, 'slow'), fail(5, 'boom')]), /boom/);
});

test('a plain value wins immediately', async () => {
  assert.equal(await promiseRace([wait(10, 'later'), 'now']), 'now');
});
