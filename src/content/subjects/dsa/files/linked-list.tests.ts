import { LinkedList, ListNode, reverseList } from './solution';
test('add and remove at both ends', () => {
  const l = new LinkedList<number>();
  l.addToTail(2);
  l.addToHead(1);
  l.addToTail(3);
  assert.deepEqual(l.toArray(), [1, 2, 3]);
  assert.equal(l.removeHead(), 1);
  assert.equal(l.removeTail(), 3);
  assert.deepEqual(l.toArray(), [2]);
});
test('prev pointers stay consistent', () => {
  const l = new LinkedList<string>();
  ['a', 'b', 'c'].forEach((x) => l.addToTail(x));
  assert.equal(l.tail!.prev!.value, 'b');
  assert.equal(l.head!.next!.prev, l.head);
  assert.equal(l.head!.prev, null);
});
test('emptying resets head and tail', () => {
  const l = new LinkedList<number>();
  l.addToHead(1);
  assert.equal(l.removeTail(), 1);
  assert.equal(l.head, null);
  assert.equal(l.tail, null);
  assert.equal(l.removeHead(), null);
});
test('reverseList', () => {
  const head = new ListNode(1, new ListNode(2, new ListNode(3)));
  const r = reverseList(head)!;
  const vals: number[] = [];
  for (let n: ListNode<number> | null = r; n; n = n.next) vals.push(n.value);
  assert.deepEqual(vals, [3, 2, 1]);
  assert.equal(reverseList(null), null);
});
