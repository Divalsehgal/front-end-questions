function replacePlaceholders(obj, values) {
    if (Array.isArray(obj)) {
        return obj.map(item => replacePlaceholders(item, values));
    } else if (typeof obj === 'object' && obj !== null) {
        const result = {};
        for (let key in obj) {
            result[key] = replacePlaceholders(obj[key], values);
        }
        return result;
    } else if (typeof obj === 'string') {
        return obj.replace(/\{\{(.*?)\}\}/g, (_, key) => values[key.trim()] ?? '');
    }
    return obj;
}














// Example usage:
const template = {
    title: "Hello {{name}}",
    info: {
        age: "{{age}}",
        hobbies: ["{{hobby1}}", "{{hobby2}}"]
    }
};

const data = {
    name: "John",
    age: "30",
    hobby1: "Coding",
    hobby2: "Cycling"
};
console.log(replacePlaceholders(template, data));




