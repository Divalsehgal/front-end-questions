const obj1 = {
    name: 'Dival',
    age: 28,
    address: {
        line1: "Mohalla Bansi Gopal",
        line2: "Near Akhand Chandi Palace",
        city: "Chamba"
    }
}

const obj2 = {
    name: 'Dival',
    age: 28,
    address: {
        line1: "Mohalla Bansi Gopal",
        line2: "Near Akhand Chandi Palace",
        city: "Chamba"
    }
}
Object.deepEqual = function (obj1, obj2) {
    function flatObject(obj, parentKey = '') {
        let res = {}
        for (const i in obj) {
            let newKey = parentKey ? `${parentKey}.${i}` : i
            if (typeof obj[i] === 'object') {
                const temp = flatObject(obj[i], newKey)
                res = { ...res, ...temp }
            } else {
                res[newKey] = obj[i]
            }
        }
        return res
    }


    const res1 = flatObject(obj1, '')
    const res2 = flatObject(obj2, '')

    for (const i in res1) {
        if (res2[i] !== res1[i]) {
            return false
        }
    }
    return true
}
// equal logic
console.log(Object.deepEqual(obj1, obj2))