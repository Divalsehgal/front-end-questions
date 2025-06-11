const iterator = {
    current: 0,
    last: 5,
    next() {
        if (this.current <= this.last) {
            return { value: this.current++, done: false };
        } else {
            return { value: undefined, done: true };
        }
    },
};

let result = iterator.next();
while (!result.done) {
    console.log(result.value); // Logs 0, 1, 2, 3, 4, 5
    result = iterator.next();
}