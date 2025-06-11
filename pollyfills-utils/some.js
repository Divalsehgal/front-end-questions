const arr = [1, 2, 3, 4, 5];

console.log(arr.some((r) => r > 0))

Array.prototype.newSome = function newSome(fn) {
    for (let i = 0; i < this.length; i++) {
        if (fn(this[i], i)) {
            return true
        }
    }
    return false
}
console.log(arr.newSome((r) => r > 0))

