const stack = [1, 2, 3, 4, 5];

//left to right
// if you want to pop use pop() method
// and you want to to do right to left use shift()
//console.log(stack.pop())

// console.log(stack.push(7),stack)

//console.log(stack.unshift(), stack);

class Stack {
  constructor(...items) {
    this.reverse = false;
    this.stack = [...items];
  }

  push(...items) {
    if (this.reverse) {
      this.stack.unshift(...items);
    } else {
      this.stack.push(...items);
    }
    return this.stack;
  }

  pop() {
    if (this.reverse) {
      this.stack.shift();
    } else {
      this.stack.pop();
    }
    return this.stack;
  }
}

const r = new Stack(1, 2, 3, 4, 5);
r.reverse = true;
console.log(r);
console.log(r.pop());
console.log(r.push(2));
