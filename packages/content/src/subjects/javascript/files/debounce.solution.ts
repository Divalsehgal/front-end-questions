export function debounce<T extends (...args: any[]) => void>(fn: T, wait: number) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: Parameters<T> | undefined;
  let lastThis: unknown;

  function debounced(this: unknown, ...args: Parameters<T>) {
    lastArgs = args;
    lastThis = this;
    clearTimeout(timer);
    timer = setTimeout(() => debounced.flush(), wait);
  }

  debounced.cancel = function () {
    clearTimeout(timer);
    lastArgs = undefined;
  };

  // Run the waiting call now, if there is one.
  debounced.flush = function () {
    clearTimeout(timer);
    if (lastArgs) {
      const args = lastArgs;
      lastArgs = undefined;
      fn.apply(lastThis, args);
    }
  };

  return debounced;
}
