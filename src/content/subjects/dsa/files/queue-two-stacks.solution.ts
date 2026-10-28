// New items go on `inbox`. To take one out, read from `outbox`.
// When outbox is empty, move everything from inbox into it, which reverses the order.
export class Queue<T> {
  private inbox: T[] = [];
  private outbox: T[] = [];

  private moveIfEmpty() {
    if (this.outbox.length === 0) {
      while (this.inbox.length > 0) {
        this.outbox.push(this.inbox.pop()!);
      }
    }
  }

  enqueue(value: T): void {
    this.inbox.push(value);
  }

  dequeue(): T | undefined {
    this.moveIfEmpty();
    return this.outbox.pop();
  }

  peek(): T | undefined {
    this.moveIfEmpty();
    return this.outbox[this.outbox.length - 1];
  }

  get size(): number {
    return this.inbox.length + this.outbox.length;
  }
}
