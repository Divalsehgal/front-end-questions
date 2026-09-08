/*
Decorator pattern allows us to add new behavior to an object
dynamically without modifying its original structure, 
often implemented using function wrapping or higher-order components in React.
*/


function logger(fn) {
    return (...args) => {
        console.log("Calling function")
        return fn(...args)
    }
}


function sum(a, b) {
    return a + b
}

const logged = logger(sum)

console.log(logged(4, 9))