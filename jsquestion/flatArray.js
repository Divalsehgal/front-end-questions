

function flat(arr) {
    const temp = [];
    for (const i of arr) {
        if (Array.isArray(i)) {
            temp.push(...flat(i))

        } else {
            temp.push(i)
        }

    }

    return temp
}

const arr = [1, [2, [3, 4], 5], 6];
console.log(flat(arr))


