export function runWithLimit<T>(tasks: readonly (() => Promise<T>)[], limit: number): Promise<T[]> {
  const results: T[] = [];
  let nextIndex = 0;
  let count = 0;
  let failed = false;

  return new Promise((resolve, reject) => {
    if (tasks.length === 0) {
      resolve([]);
      return;
    }

    function runNext() {
      if (failed || nextIndex >= tasks.length) {
        return;
      }
      const i = nextIndex;
      nextIndex++;
      tasks[i]()
        .then((value) => {
          results[i] = value;
          count++;
          if (count === tasks.length) {
            resolve(results);
          } else {
            runNext(); // this slot is free, so start the next task
          }
        })
        .catch((error) => {
          failed = true;
          reject(error);
        });
    }

    // Start `limit` tasks. Each one starts another when it finishes.
    for (let i = 0; i < limit && i < tasks.length; i++) {
      runNext();
    }
  });
}
