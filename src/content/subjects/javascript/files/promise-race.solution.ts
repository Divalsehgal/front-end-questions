export function promiseRace<T>(values: Iterable<T | PromiseLike<T>>): Promise<T> {
  const items = Array.from(values);

  return new Promise((resolve, reject) => {
    for (let i = 0; i < items.length; i++) {
      // Whichever settles first wins. A promise ignores resolve/reject after it has settled.
      Promise.resolve(items[i]).then(resolve, reject);
    }
  });
}
