function mySetInterval(fn, interval) {
    let active = true
    function run() {
        if (!active) return; // Stop execution if cleared
        fn(); // Execute function
        setTimeout(run, interval); // Schedule next execution
    }
    setTimeout(run, interval);
    return () => (active = false);
}



const timer1 = mySetInterval(function () {
    console.log('Hello, World!');
    clearInterval(timer1)
}, 1000)

const timer = setInterval(function () {
    console.log('Hello, World!');
    timer1()
    clearInterval(timer)
}, 5000)

