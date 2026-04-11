

function chunk(arr, n = 1) {
    let res = [];
    let temp = [];
    for (const i of arr) {
        if (temp.length < n) {
            temp.push(i);
        } else {
            res.push(temp);
            temp = [];
            temp.push(i);
        }
    }
    if (temp.length > 0) {
        res.push(temp);
    }

    return res;
}

// function chunk(array, n) {
//     let res = []
//     let temp = []
//     for (const i of array) {
//         if (temp.length < n) {
//             temp.push(i)
//         } else {
//             res.push(temp)
//             temp = []
//             temp.push(i)
//         }
//     }
//     if (temp.length > 0) {
//         res.push(temp)
//     }
//     return res
// }
console.log(chunk(["a", "b", "c", "d"], 2));
// => [['a', 'b'], ['c', 'd']]

console.log(chunk(["a", "b", "c", "d"], 3));
// => [['a', 'b', 'c'], ['d']]

console.log(chunk(["a", "b", "c"]));


console.log(chunk(['a', 'b', 'c', 'd'], 2))
// => [['a', 'b'], ['c', 'd']]

console.log(chunk(['a', 'b', 'c', 'd'], 3))
// => [['a', 'b', 'c'], ['d']]

console.log(chunk(['a', 'b', 'c']))