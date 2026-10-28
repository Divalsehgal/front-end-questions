export function promiseAny<T>(values: Iterable<T | PromiseLike<T>>): Promise<T> {
  const items = Array.from(values);
  const errors: unknown[] = [];
  let count = 0;

  return new Promise((resolve, reject) => {
    if (items.length === 0) {
      reject(new AggregateError([], 'All promises were rejected'));
      return;
    }
    for (let i = 0; i < items.length; i++) {
      Promise.resolve(items[i])
        .then((value) => resolve(value)) // the first success wins
        .catch((error) => {
          errors[i] = error;
          count++;
          if (count === items.length) {
            reject(new AggregateError(errors, 'All promises were rejected'));
          }
        });
    }
  });
}
