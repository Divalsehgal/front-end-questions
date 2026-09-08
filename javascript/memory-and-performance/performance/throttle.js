
//Execute at most once in a fixed time window

function throttle(callback, delay) {
  let timer = null;
  let coolDown = false
  return function (...args) {
    if (coolDown) {
      return;
    }

    callback.apply(this, args)
    coolDown = true

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      coolDown = false;
    }, delay);
  }
}

//leading: true, trailing: true

//Leading means runs immediately on first trigger
//Trailing runs at the end of the time window

function throttleWithTrailLead(func, wait = 1000, { leading = true, trailing = true } = {}) {
  let timer = null;
  let lastArgs = null;
  let lastThis = null;

  return function (...args) {
    if (!timer) {
      // first call in window
      if (leading) {
        func.apply(this, args);
      } else {
        lastArgs = args;
        lastThis = this;
      }

      timer = setTimeout(() => {
        // run trailing only if we got a new call
        if (trailing && lastArgs) {
          func.apply(lastThis, lastArgs);
        }

        // reset
        timer = null;
        lastArgs = lastThis = null;
      }, wait);
    } else {
      // during cooldown → store last call
      if (trailing) {
        lastArgs = args;
        lastThis = this;
      }
    }
  };
}
