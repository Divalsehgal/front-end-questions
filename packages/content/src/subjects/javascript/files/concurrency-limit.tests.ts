import { runWithLimit } from './solution';

const tracker = () => {
  let running = 0;
  let peak = 0;
  const started: number[] = [];
  const task = (id: number, ms: number, fail = false) => () => {
    started.push(id);
    running++;
    peak = Math.max(peak, running);
    return new Promise<number>((resolve, reject) =>
      setTimeout(() => {
        running--;
        fail ? reject(new Error(`task ${id} failed`)) : resolve(id);
      }, ms),
    );
  };
  return { task, peak: () => peak, started };
};

test('results in input order', async () => {
  const t = tracker();
  assert.deepEqual(await runWithLimit([t.task(0, 30), t.task(1, 5), t.task(2, 15)], 2), [0, 1, 2]);
});

test('never exceeds the limit', async () => {
  const t = tracker();
  await runWithLimit(Array.from({ length: 10 }, (_, i) => t.task(i, 5 + (i % 3) * 5)), 3);
  assert.equal(t.peak(), 3);
});

test('starts the next task as soon as ONE slot frees up (a pool, not batches)', async () => {
  const t = tracker();
  const start = Date.now();
  // limit 2: [slow 150, fast 40 ×3]. Pool ≈ 150ms. Batches of 2 ≈ 190ms.
  const out = await runWithLimit([t.task(0, 150), t.task(1, 40), t.task(2, 40), t.task(3, 40)], 2);
  assert.deepEqual(out, [0, 1, 2, 3]);
  assert.deepEqual(t.started, [0, 1, 2, 3]);
  assert.ok(Date.now() - start < 175, `took ${Date.now() - start}ms, looks like batching`);
});

test('empty input', async () => {
  assert.deepEqual(await runWithLimit([], 3), []);
});

test('rejects with the first error and starts nothing new', async () => {
  const t = tracker();
  await assert.rejects(runWithLimit([t.task(0, 5, true), t.task(1, 50), t.task(2, 5), t.task(3, 5)], 2), /task 0 failed/);
  await new Promise((r) => setTimeout(r, 80));
  assert.deepEqual(t.started, [0, 1]);
});
