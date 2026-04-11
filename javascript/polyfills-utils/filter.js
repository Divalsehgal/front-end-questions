const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

Array.prototype.myFilter = function (fn,thiArgs) {
    let temp = []
    for (let i = 0; i < this.length; i++) {
        if (fn.call(thiArgs,this[i], i,this)) {
            temp.push(this[i]);
        }
    }
    return temp

}


console.log(array.filter((value, index) => value > 10))
console.log(array.myFilter((value, index) => value > 10))