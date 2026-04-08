const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

Array.prototype.myMap = function (fn,thisArg) {
    const temp = [];
    for (let i = 0; i < this.length; i++) {
        if (i in this) {
            const res = fn.call(thisArg, this[i], i, this);
            temp[i] = res;
        }
    }
    return temp;

}

console.log(array.map((value, index) => value + index))
console.log(array.myMap((value, index) => value + index))