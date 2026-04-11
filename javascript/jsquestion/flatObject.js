function flattenObject(obj, parentKey = '') {
    let flatObj = {};

    for (let key in obj) {
        const newKey = parentKey ? `${parentKey}.${key}` : key;

        if (typeof obj[key] === 'object') {
            
            const nestedFlat = flattenObject(obj[key], newKey);
            flatObj = {...flatObj, ...nestedFlat }

        } else {
            flatObj[newKey] = obj[key];
        }
    }

    return flatObj;
}


const nested = {
    user: {
        name: 'John',
        address: {
            city: 'NYC',
            zip: 10001
        }
    },
    active: true
};

console.log(flattenObject(nested))