function throttle(callback, delay = 1000) {
  let shouldWait = false;

  return (...args) => {
    if (shouldWait) return;

    callback(...args);
    shouldWait = true;
    setTimeout(() => {
      shouldWait = false;
    }, delay);
  };
}

const throttledFunction = throttle(() => {
  console.log("Function called");
}, 2000);

throttledFunction();
throttledFunction();
throttledFunction();
throttledFunction();
throttledFunction();
throttledFunction();
throttledFunction();
throttledFunction();
throttledFunction();
throttledFunction();
throttledFunction();
throttledFunction();
throttledFunction();
throttledFunction();
throttledFunction();
throttledFunction();
