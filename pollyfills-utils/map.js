const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

Array.prototype.myMap = function (fn) {
    let temp = []
    for (let i = 0; i < this.length; i++) {
        temp.push(fn(this[i],i));
    }
    return temp

}

console.log(array.map((value, index) => value + index))
console.log(array.myMap((value, index) => value + index))