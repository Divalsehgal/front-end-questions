

const arr = [1, 2, 3, 3, 5]

function sum(a, b) {
    return a + b
}


Array.prototype.myReduce = function (callbackFn, initialValue) {
    if (typeof callbackFn !== "function") {
        throw new TypeError("Callback must be a function");
    }

    if (this.length === 0 && initialValue === undefined) {
        throw new TypeError("Reduce of empty array with no initial value");
    }

    let acc = initialValue;
    let startIndex = 0;

    if (acc === undefined) {
        acc = this[0];
        startIndex = 1;
    }

    for (let i = startIndex; i < this.length; i++) {
        if (i in this) {
            acc = callbackFn(acc, this[i], i, this);
        }
    }

    return acc;
};


console.log(arr.myReduce(sum, 0));