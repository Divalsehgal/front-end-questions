const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const array1 = [{ name: "Dival", age: 27 }, { name: "Minal", age: 24 }, { name: "Tanya", age: 26 }]

Array.prototype.myFind = function (fn) {
    for (let i = 0; i < this.length; i++) {
        if (fn(this[i], i)) {
            return this[i];
        }
    }

}


console.log(array1.find((value, index) => value.name === 'Minal'))
console.log(array1.myFind((value, index) => value.name === 'Minal'))