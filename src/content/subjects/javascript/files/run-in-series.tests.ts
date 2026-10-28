import { runInSeries } from './solution';

const make = (log: string[], id: string, ms: number, fail = false) => () => {
  log.push(`start ${id}`);
  return new Promise<string>((res, rej) =>
    setTimeout(() => {
      log.push(`end ${id}`);
      fail ? rej(new Error(id)) : res(id);
    }, ms),
  );
};

test('runs strictly one after another', async () => {
  const log: string[] = [];
  await runInSeries([make(log, 'a', 20), make(log, 'b', 1), make(log, 'c', 5)]);
  assert.deepEqual(log, ['start a', 'end a', 'start b', 'end b', 'start c', 'end c']);
});

test('a failure does not stop the rest; outcomes are reported in order', async () => {
  const log: string[] = [];
  const out = await runInSeries([make(log, 'a', 1), make(log, 'b', 1, true), make(log, 'c', 1)]);
  assert.deepEqual(out.map((o) => o.ok), [true, false, true]);
  assert.equal((out[0] as any).value, 'a');
  assert.equal((out[1] as any).error.message, 'b');
});

test('does not start tasks before it is called', async () => {
  const log: string[] = [];
  const tasks = [make(log, 'a', 1)];
  assert.deepEqual(log, []);
  await runInSeries(tasks);
  assert.equal(log.length, 2);
});
