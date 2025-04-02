//leading: true, trailing: false)

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

    setTimeout(() => {
      coolDown = false;
    }, delay);
  }
}

function throttleTrailLead(callback, delay = 1000, options = { leading: true, trailing: false }) {
  let timer = null;
  let lastArgs, lastThis;
  let coolDown = false;

  return function (...args) {
    if (!coolDown) {
      if (options.leading) {
        callback.apply(this, args);  // Leading call immediately
      } else {
        lastArgs = args;  // Save the arguments for trailing execution
        lastThis = this;
      }

      coolDown = true;  // Start cooldown

      timer = setTimeout(() => {
        coolDown = false;

        if (options.trailing && lastArgs) {
          callback.apply(lastThis, lastArgs);  // Trailing call after delay
          lastArgs = lastThis = null;  // Reset after trailing execution
        }
      }, delay);
    } else {
      lastArgs = args;  // Save arguments for trailing call
      lastThis = this;
    }
  };
}

function updateLayout() {
  console.count('scrolling window');
}

const throttledUpdateLayout = throttle(updateLayout, 250);

window.addEventListener("scroll", throttledUpdateLayout);
