class Queue {
  constructor(...items) {
    this.reverse = false;
    this.queue = [...items];
  }

  enqueue(...items) {
    if (this.reverse) {
      this.queue.push(...items);
    } else {
      this.queue.unshift(...items);
    }
    return this.queue;
  }

  dequeue() {
    if (this.reverse) {
      this.queue.pop();
    } else {
      this.queue.shift();
    }
    return this.queue;
  }
}

const q = new Queue(2, 3, 4, 45, 8, "hj", 98);

console.log(q.enqueue("fred"));

console.log(q.dequeue());
