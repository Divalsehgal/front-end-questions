export class ListNode<T> {
  constructor(public value: T, public next: ListNode<T> | null = null, public prev: ListNode<T> | null = null) {}
}

/** Doubly linked list with O(1) operations at both ends. */
export class LinkedList<T> {
  head: ListNode<T> | null = null;
  tail: ListNode<T> | null = null;

  addToHead(value: T): void {
    // your code
  }
  addToTail(value: T): void {
    // your code
  }
  removeHead(): T | null {
    // your code
  }
  removeTail(): T | null {
    // your code
  }
  toArray(): T[] {
    // your code
  }
}

/** Reverse a singly linked list (use only .next) and return the new head. Iteratively, O(1) space. */
export function reverseList<T>(head: ListNode<T> | null): ListNode<T> | null {
  // your code
}
