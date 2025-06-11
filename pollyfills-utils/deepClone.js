const obj1 = {
    name: 'Dival',
    age: 28,
    address: {
        line1: "Mohalla Bansi Gopal",
        line2: "Near Akhand Chandi Palace",
        city: "Chamba",
        location: {
            temp: "very important"
        }
    }
}
Object.deepClone = function (obj) {

    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    let res = Array.isArray(obj) ? [] : {};

    for (let i in obj) {
        res[i] = Object.deepClone(obj[i])
    }
    return res
}

const newObj=Object.deepClone(obj1)
newObj.name="Minal"
console.log(newObj,obj1)