
const arr = [1, 2, 3, 4, 5, 6, 7, 8]
const key = 3
let mid
function bs(arr, i, j) {
    if (i > j) {
        return -1
    }
    mid = Math.floor((i + j) / 2)
    if (arr[mid] === key) {
        return mid
    } else if (arr[mid] > key) {
        return bs(arr, i, mid - 1)
    } else {
        return bs(arr, mid + 1, j)
    }
}

const ans = bs(arr, 0, 7)
console.log(ans)
