

const arr = [1, 2, 3, 3, 5]

function sum(a, b) {
    return a + b
}


Array.prototype.myReduce = function (callback, initialValue) {
    let acc = initialValue;
    let startIndex = 0;

    if (acc === undefined) {
        acc = this[0];
        startIndex = 1;
    }

    for (let i = startIndex; i < this.length; i++) {
        acc = callback(acc, this[i], i, this);
    }

    return acc;
};

console.log(arr.myReduce(sum, 0));