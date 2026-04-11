function memoise(fn) {
    const map = new Map();
    return function (...args) {
        const key = JSON.stringify(args)

        if (map.has(key)) {
            return map.get(key)
        }

        const result = fn.apply(this, args)
        map.set(key, result)

        return result
    }
}

function sum(a, b) {
    return a + b
}

const callMemoised = memoise(sum)

console.log(callMemoised(2, 4))
console.log(callMemoised(2, 4))
console.log(callMemoised(2, 8))
console.log(callMemoised(2, 8))