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




function debounceTrailLead(func, wait, option = { leading: false, trailing: true }) {
    let timer = null
    return function (...args) {
        let isInvoked = false

        if (timer === null && option.leading) {
            func.apply(this, args)
            isInvoked = true
        }

        clearTimeout(timer);

        timer = setTimeout(() => {
            if (option.trailing && !isInvoked) {
                func.apply(this, args)
            }
            timer = null
        }, wait)
    }
}





function updateLayout() {
    console.log('resizing window')
}

const debouncedUpdateLayout = debounce(updateLayout, 250);

// Listen for window resize events and call the debounced function
window.addEventListener("resize", debouncedUpdateLayout);
//window.addEventListener("resize", updateLayout);