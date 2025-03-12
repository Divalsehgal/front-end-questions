class Queue {
  constructor(items = []) {
    this.reverse = false;
    this.queue = [...items];
  }

  enqueue(item) {
    if (this.reverse) {
      this.queue.push(item);
    } else {
      this.queue.push(item); // Regular queue adds to the end
    }
    return this.queue.length;
  }

  dequeue() {
    if (this.reverse) {
      return this.queue.pop(); // Returns the removed item
    } else {
      return this.queue.shift(); // Returns the removed item
    }
  }

  peek() {
    if (this.reverse) {
      return this.queue[this.queue.length - 1];
    } else {
      return this.queue[0];
    }
  }

  isEmpty() {
    return this.queue.length === 0;
  }

  size() {
    return this.queue.length;
  }
}
const q = new Queue([2, 3, 4, 45, 8, "hj", 98]);

console.log(q.enqueue("fred"));

console.log(q.dequeue());

console.log(q);
