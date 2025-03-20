class Node {
  constructor(value, next = null, prev = null) {
    this.value = value;
    this.next = next;
    this.prev = prev;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  addToHead(value) {
    const node = new Node(value, this.head,null);
    if (this.head) {
      this.head.prev = node;
    } else {
      this.tail = node;
    }
    this.head = node;
  }

  addToTail(value) {
    const node = new Node(value, null, this.tail);
    if (this.tail) {
      this.tail.next = node;
    } else {
      this.head = node;
    }
    this.tail = node;
  }

  removeHead() {
    if (!this.head) return null;
    const value = this.head.value;
    this.head = this.head.next;
    if (this.head) {
      this.head.prev = null;
    } else {
      this.tail = null;
    }
    return value;
  }

  removeTail() {
    if (!this.tail) return null;
    const value = this.tail.value;
    this.tail = this.tail.prev;
    if (this.tail) {
      this.tail.next = null;
    } else {
      this.head = null;
    }
    return value;
  }

  search(value) {
    let current = this.head;
    while (current) {
      if (current.value === value) return current;
      current = current.next;
    }
    return null;
  }

  indexOf(value) {
    let index = 0;
    let current = this.head;
    const indices = [];
    while (current) {
      if (current.value === value) indices.push(index);
      current = current.next;
      index++;
    }
    return indices.length ? indices : -1;
  }
}

const l1 = new LinkedList();
l1.addToHead(1);
l1.addToTail(2);
l1.addToTail(3);
l1.addToTail(34);
l1.addToTail(44);
l1.addToHead(0);
console.log(l1);
console.log(l1.indexOf(44))
