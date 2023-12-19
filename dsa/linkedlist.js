class Node {
  constructor(value, next, prev) {
    this.next = next;
    this.value = value;
    this.prev = prev;
  }
}

class LinkedList {
  constructor(head, tail) {
    this.head = head;
    this.tail = tail;
  }

  addToHead(value) {
    const node = new Node(value, null, this.head);
    if (this.head) {
      this.head.next = node;
    } else {
      this.tail = node;
    }
    this.head = node;
  }

  addToTail() {}

  removeHead() {}
  removeTail() {}
  search() {}

  indexOf() {}
}

const l1 = new LinkedList(1, 2, 3, 4);

console.log(l1);
