/*
The iterator is used to traverse elements of a collection.
*/

const range = {
    start: 1,
    end: 3,
    [Symbol.iterator]() {
        let current = this.start
        let end = this.end

        return {
            next() {
                if (current <= end) {
                    return { value: current++, done: false }
                }
                return { done: true }
            }
        }
    }
}

for (let num of range) {
    console.log(num)
}