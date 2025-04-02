function throttle(fn, delay) {

    let throttle = false

    return function (...args) {
        if (throttle) {
            return
        }
        fn.apply(this, args)
        throttle=true

        setTimeout(() => {
            throttle = false
        }, delay)
    }

}