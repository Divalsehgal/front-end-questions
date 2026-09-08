
Array.prototype.myFill = function (a, b, c) {
    let start = b || 0;
    let end = c || this[this.length - 1];
    for (let i = start; i < end; i++) {
        this[i] = a;
    }
    return this;
};

const a = [3, 6, 9];


a.fill(5, 0);
a.myFill(4, 0, 1)

console.log(a);
