import { PriorityQueue } from './solution';
test('min-heap pops in ascending order', () => {
  const pq = new PriorityQueue<number>();
  [5, 3, 8, 1, 9, 2, 7].forEach((n) => pq.push(n));
  assert.equal(pq.peek(), 1);
  const out: number[] = [];
  while (pq.size) out.push(pq.pop()!);
  assert.deepEqual(out, [1, 2, 3, 5, 7, 8, 9]);
  assert.equal(pq.pop(), undefined);
});
test('custom comparator: max-heap of tasks by priority', () => {
  const pq = new PriorityQueue<{ name: string; p: number }>((a, b) => b.p - a.p);
  pq.push({ name: 'low', p: 1 });
  pq.push({ name: 'high', p: 10 });
  pq.push({ name: 'mid', p: 5 });
  assert.deepEqual([pq.pop()!.name, pq.pop()!.name, pq.pop()!.name], ['high', 'mid', 'low']);
});
test('heap sort 50k numbers fast (O(n log n))', () => {
  // Ban the array tricks a "sorted array" queue would need.
  const saved = (['splice', 'shift', 'unshift', 'sort'] as const).map((k) => [k, Array.prototype[k]] as const);
  for (const [k] of saved) (Array.prototype as any)[k] = () => { throw new Error(`Array.prototype.${k} is disabled: use a binary heap`); };
  try {
  const pq = new PriorityQueue<number>();
  const n = 50000;
  const start = Date.now();
  for (let i = 0; i < n; i++) pq.push((i * 7919) % 50021);
  let prev = -Infinity;
  for (let i = 0; i < n; i++) {
    const v = pq.pop()!;
    assert.ok(v >= prev, 'out of order');
    prev = v;
  }
  assert.ok(Date.now() - start < 2000, 'too slow: push/pop must be O(log n)');
  } finally {
    for (const [k, f] of saved) (Array.prototype as any)[k] = f;
  }
});
