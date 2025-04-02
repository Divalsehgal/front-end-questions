function mySetTimeout(fn, delay) {
    const start = Date.now();

    function checkTime() {
        if (Date.now() - start >= delay) {
            fn()
        } else {
            setImmediate(checkTime);

        }
    }
    setImmediate(checkTime);

}

mySetTimeout(function () {
    console.log('mySetTimeout personal')
}, 2000);

setTimeout(function () {
    console.log('mySetTimeout')
}, 2000)

