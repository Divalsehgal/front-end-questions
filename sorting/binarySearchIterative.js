


const arr = [1, 2, 3, 4, 5, 6, 7, 8]
const key = 6
let i = 0;
let j = arr.length - 1;
let res = -1;


while (i <= j) {
    let mid = Math.floor((i + j) / 2);

    if (arr[mid] < key) {
        i = mid + 1;
    } else if (arr[mid] > key) {
        j = mid - 1;
    } else {
        res = mid
        break;
    }
}
console.log(res)