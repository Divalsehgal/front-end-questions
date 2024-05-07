// Debounce and throttling

// Throttling limit the no of API  calls for certain period off time
// Debounce is to delay the API call

const debounce = (fn, delay) => {
    let timer;
    return function (...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
};