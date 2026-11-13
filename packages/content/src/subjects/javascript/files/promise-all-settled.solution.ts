export type Settled<T> = { status: 'fulfilled'; value: T } | { status: 'rejected'; reason: unknown };

export function promiseAllSettled<T>(values: Iterable<T | PromiseLike<T>>): Promise<Settled<T>[]> {
  const items = Array.from(values);
  const results: Settled<T>[] = [];
  let count = 0;

  return new Promise((resolve) => {
    if (items.length === 0) {
      resolve([]);
      return;
    }
    for (let i = 0; i < items.length; i++) {
      Promise.resolve(items[i])
        .then((value) => {
          results[i] = { status: 'fulfilled', value };
        })
        .catch((reason) => {
          results[i] = { status: 'rejected', reason };
        })
        .finally(() => {
          count++;
          if (count === items.length) {
            resolve(results);
          }
        });
    }
  });
}
