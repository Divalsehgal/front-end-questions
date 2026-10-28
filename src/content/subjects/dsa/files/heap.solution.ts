// A heap is a binary tree stored in an array, level by level:
// the parent of i is at (i - 1) / 2, its children are at 2i + 1 and 2i + 2.
export class PriorityQueue<T> {
  private heap: T[] = [];

  // compare(a, b) < 0 means a comes out first. The default makes a min-heap of numbers.
  constructor(private compare: (a: T, b: T) => number = (a: any, b: any) => a - b) {}

  private parent(i: number) {
    return Math.floor((i - 1) / 2);
  }

  private swap(i: number, j: number) {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }

  push(value: T): void {
    this.heap.push(value);
    // Bubble up: swap with the parent while we come before it.
    let i = this.heap.length - 1;
    while (i > 0 && this.compare(this.heap[i], this.heap[this.parent(i)]) < 0) {
      this.swap(i, this.parent(i));
      i = this.parent(i);
    }
  }

  pop(): T | undefined {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) return this.heap.pop();

    const top = this.heap[0];
    this.heap[0] = this.heap.pop()!; // move the last item to the top
    // Bubble down: swap with the child that should come first, while it does.
    let i = 0;
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let best = i;
      if (left < this.heap.length && this.compare(this.heap[left], this.heap[best]) < 0) best = left;
      if (right < this.heap.length && this.compare(this.heap[right], this.heap[best]) < 0) best = right;
      if (best === i) break;
      this.swap(i, best);
      i = best;
    }
    return top;
  }

  peek(): T | undefined {
    return this.heap[0];
  }

  get size(): number {
    return this.heap.length;
  }
}
