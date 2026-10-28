export function range(start: number, end: number, step = 1): Iterable<number> {
  return {
    // A new iterator each time, so every for...of starts from the beginning.
    [Symbol.iterator]() {
      let current = start;
      return {
        next(): IteratorResult<number> {
          const finished = step > 0 ? current > end : current < end;
          if (finished) {
            return { value: undefined, done: true };
          }
          const value = current;
          current += step;
          return { value, done: false };
        },
      };
    },
  };
}

export function take<T>(iterable: Iterable<T>, n: number): T[] {
  const result: T[] = [];
  if (n <= 0) {
    return result;
  }
  for (const value of iterable) {
    result.push(value);
    if (result.length === n) {
      break; // stop pulling values
    }
  }
  return result;
}
