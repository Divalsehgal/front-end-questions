function getAllSubarrays(arr) {
    let subarrays = [];
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j <= arr.length; j++) {
            subarrays.push(arr.slice(i, j));
        }
    }
    return subarrays;
}

console.log(getAllSubarrays([1, 2, 3]))