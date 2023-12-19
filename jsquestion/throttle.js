function throttle(fn, wait) {
  let coolingdown = false;
  let last;
  return function (...args) {
    if (!coolingdown) {
      clearTimeout(coolingdown);
      fn.apply(this, args);
      coolingdown = true;
      setTimeout(() => {
        coolingdown = false;
        if (last) {
          fn.apply(this, last);
          coolingdown = true;
        }
      }, wait);
    } else {
      last = args;
    }
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
