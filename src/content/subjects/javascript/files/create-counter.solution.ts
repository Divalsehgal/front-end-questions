// Return an object that closes over `count`. Don't use `this`: in a plain function call it isn't the counter.
export function createCounter(init: number) {
  let count = init;
  return {
    increment() {
      count += 1;
      return count;
    },
    decrement() {
      count -= 1;
      return count;
    },
    reset() {
      count = init;
      return count;
    },
  };
}
