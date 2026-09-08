const arr = [1, 2, 3, 4]

console.log(arr.indexOf(4))

console.log(arr.indexOf(9))


Array.prototype.newFindIndex = function newFindIndex(n) {

    for (let i = 0; i < this.length; i++) {
        if (this[i] === n) {
            return i
        }
    }

    return -1

}

console.log(arr.newFindIndex(4))
console.log(arr.newFindIndex(9))
