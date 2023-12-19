var createCounter = function (init) {
  let no = init;
  this.increment = function increment() {
    return (no += 1);
  };

  this.decrement = function decrement() {
    return (no -= 1);
  };

  this.reset = function reset() {
    return (no = init);
  };

  return this;
};

const counter = createCounter(5);
console.log(counter.increment()); // 6
console.log(counter.reset()); // 5
console.log(counter.decrement()); // 4
console.log(counter.reset()); // 5
