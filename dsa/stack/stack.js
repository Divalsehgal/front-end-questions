class Stack {
  constructor(items = []) {
    this.reverse = false;
    this.stack = [...items]; // Creates a copy of the input array
  }

  push(item) {
    if (this.reverse) {
      this.stack.unshift(item);
    } else {
      this.stack.push(item);
    }
    return this.stack.length;
  }

  pop() {
    if (this.reverse) {
      return this.stack.shift();
    } else {
      return this.stack.pop();
    }
  }

  peek() {
    if (this.reverse) {
      return this.stack[0];
    } else {
      return this.stack[this.stack.length - 1];
    }
  }

  isEmpty() {
    return this.stack.length === 0;
  }

  size() {
    return this.stack.length;
  }
}

const r = new Stack([1, 2, 3, 4, 5]);
console.log(r);
console.log(r.pop()); // Should print 1 (first item in the stack when reversed)
console.log(r.push(2)); // Should print 5 (new length)
console.log(r);