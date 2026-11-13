export function throttle<A extends unknown[]>(fn: (...args: A) => void, wait: number): (...args: A) => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: A | undefined; // the latest call made while waiting
  let lastThis: unknown;

  function endWindow() {
    if (lastArgs) {
      // Run the trailing call, which starts a new window.
      fn.apply(lastThis, lastArgs);
      lastArgs = undefined;
      timer = setTimeout(endWindow, wait);
    } else {
      timer = undefined;
    }
  }

  return function (this: unknown, ...args: A) {
    if (timer) {
      lastArgs = args;
      lastThis = this;
      return;
    }
    fn.apply(this, args); // leading call
    timer = setTimeout(endWindow, wait);
  };
}
