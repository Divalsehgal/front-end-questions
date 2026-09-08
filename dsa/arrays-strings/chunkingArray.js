function chunk(arr, size) {
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

console.log(chunk(arr, size));
