const s = "tact coa"; // dgoo

function isPerm(s) {
    const arr=s.toString().split('')
    let l = 0;
    let r = arr.length - 1;
    while (l < r) {
        if (arr[l] !== arr[r]) {
            return false
        }
        l++;
        r--
    }
    return true
}

console.log(isPerm(s))
