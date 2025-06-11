const arr = [1, 2, 3, 4];

console.log(arr.every((a) => a > 1))

Array.prototype.newEvery = function (fn) {

    for (let i = 0; i < this.length; i++) {
        if (!fn(this[i])) {
            return false
        }
    }
    return true

}
console.log(arr.newEvery((a) => a > 1))