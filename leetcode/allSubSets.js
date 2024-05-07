
function getAllSubsets(arr) {
    let result = [[]]
    for (let i of arr) {
        let subset = [];
        for (let j of result) {
            subset.push([...j, i]);
        }
        result.push(...subset);
    }
    return result;
}

console.log(getAllSubsets([1, 2, 3])) 