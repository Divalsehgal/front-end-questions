function once(fn) {
    let hasRun = false;
    let result;

    return function (...args) {
        if (!hasRun) {
            hasRun = true
            result = fn.apply(this, args);
        }
        return result;
    }
}

function printName(name) {
    return name
}

const onlyOnce = once(printName)
const onlyOnce1 = once(printName)

console.log(onlyOnce('Dival'))
console.log(onlyOnce('Zoro'))
console.log(onlyOnce1('Minal'))
console.log(onlyOnce1('Luffy'))