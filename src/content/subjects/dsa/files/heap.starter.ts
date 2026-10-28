/**
 * Binary heap priority queue stored in an array.
 * compare(a, b) < 0 means a has HIGHER priority (comes out first). Default: min-heap of numbers.
 */
export class PriorityQueue<T> {
  constructor(private compare: (a: T, b: T) => number = (a: any, b: any) => a - b) {}

  push(value: T): void {
    // your code
  }
  pop(): T | undefined {
    // your code
  }
  peek(): T | undefined {
    // your code
  }
  get size(): number {
    // your code
  }
}
