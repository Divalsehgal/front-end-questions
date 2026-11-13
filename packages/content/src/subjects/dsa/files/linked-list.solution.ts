export class ListNode<T> {
  constructor(public value: T, public next: ListNode<T> | null = null, public prev: ListNode<T> | null = null) {}
}

export class LinkedList<T> {
  head: ListNode<T> | null = null;
  tail: ListNode<T> | null = null;

  addToHead(value: T): void {
    const node = new ListNode(value, this.head, null);
    if (this.head) this.head.prev = node;
    else this.tail = node;
    this.head = node;
  }

  addToTail(value: T): void {
    const node = new ListNode(value, null, this.tail);
    if (this.tail) this.tail.next = node;
    else this.head = node;
    this.tail = node;
  }

  removeHead(): T | null {
    if (!this.head) return null;
    const value = this.head.value;
    this.head = this.head.next;
    if (this.head) this.head.prev = null;
    else this.tail = null;
    return value;
  }

  removeTail(): T | null {
    if (!this.tail) return null;
    const value = this.tail.value;
    this.tail = this.tail.prev;
    if (this.tail) this.tail.next = null;
    else this.head = null;
    return value;
  }

  toArray(): T[] {
    const out: T[] = [];
    let current = this.head;
    while (current) {
      out.push(current.value);
      current = current.next;
    }
    return out;
  }
}

export function reverseList<T>(head: ListNode<T> | null): ListNode<T> | null {
  let prev: ListNode<T> | null = null;
  let current = head;
  while (current) {
    const next = current.next; // remember the rest of the list
    current.next = prev; // point this node backwards
    prev = current;
    current = next;
  }
  return prev;
}
