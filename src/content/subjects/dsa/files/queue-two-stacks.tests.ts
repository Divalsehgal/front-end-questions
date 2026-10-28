import { Queue } from './solution';
test('FIFO order', () => {
  const q = new Queue<number>();
  q.enqueue(1);
  q.enqueue(2);
  q.enqueue(3);
  assert.equal(q.peek(), 1);
  assert.equal(q.dequeue(), 1);
  q.enqueue(4);
  assert.deepEqual([q.dequeue(), q.dequeue(), q.dequeue()], [2, 3, 4]);
  assert.equal(q.dequeue(), undefined);
});
test('size', () => {
  const q = new Queue<string>();
  q.enqueue('a');
  q.enqueue('b');
  q.dequeue();
  assert.equal(q.size, 1);
});
test('no Array.prototype.shift (that is O(n))', () => {
  const real = Array.prototype.shift;
  (Array.prototype as any).shift = () => { throw new Error('shift is O(n): use two stacks'); };
  try {
    const q = new Queue<number>();
    for (let i = 0; i < 5; i++) q.enqueue(i);
    assert.equal(q.dequeue(), 0);
  } finally {
    Array.prototype.shift = real;
  }
});
