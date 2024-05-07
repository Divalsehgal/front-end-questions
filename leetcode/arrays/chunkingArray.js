function chunk(arr, size) {
    let temp = [], set = new Set();
    while (arr.length != 0) {
        temp.push(arr.shift())
        if (temp.length % size === 0) {
            set.add(temp)
            temp = []
        }

        if (arr.length < temp.length && temp.length % 4 !== 0) {
            if (arr.shift() != undefined)
                temp.push(arr.shift())

        }
        set.add(temp)


    }
    return Array.from(set)

}

function chunk1(arr, size) {
    const res = [];
    for (let i = 0; i < arr.length; i += size) {
        res.push(arr.slice(i, size + i))
    }
    return res
}
const arr = [1, 2, 3, 4, 5, 6];
const size = 4

// if size = 3
// 1 2 3
// 4 5 6


// if size = 4
// 1 2 3 4
// 5 6

console.log(chunk1(arr, size));
