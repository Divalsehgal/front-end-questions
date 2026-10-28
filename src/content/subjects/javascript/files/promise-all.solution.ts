export function promiseAll<T>(values: Iterable<T | PromiseLike<T>>): Promise<T[]> {
  const items = Array.from(values); // works for arrays, Sets and generators
  const results: T[] = [];
  let count = 0;

  return new Promise((resolve, reject) => {
    if (items.length === 0) {
      resolve([]);
      return;
    }
    for (let i = 0; i < items.length; i++) {
      Promise.resolve(items[i])
        .then((value) => {
          results[i] = value; // save by index so the order matches the input
          count++;
          if (count === items.length) {
            resolve(results);
          }
        })
        .catch((error) => reject(error)); // the first failure rejects everything
    }
  });
}
