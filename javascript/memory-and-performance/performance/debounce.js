// Debounce and throttling

// Throttling limit the no of API  calls for certain period off time
// Debounce is to delay the API call

//leading: false, trailing: true) default behaviour

const debounce = (fn, delay) => {
    let timer;
    return function (...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
};


function debounceWithTrailLead(func, wait, { leading = false, trailing = true } = {}) {
    let timer = null;
    let lastArgs = null;
    let lastThis = null;

    return function (...args) {
        lastArgs = args;
        lastThis = this;

        const callNow = leading && !timer;

        clearTimeout(timer);

        timer = setTimeout(() => {
            if (trailing && !callNow) {
                func.apply(lastThis, lastArgs);
            }
            timer = null;
        }, wait);

        if (callNow) {
            func.apply(this, args);
        }
    };
}


