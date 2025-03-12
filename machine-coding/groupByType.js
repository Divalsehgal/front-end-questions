const combineArray = [
    { type: "fruits", value: "orange" },
    { type: "fruits", value: "apple" },
    { type: "vegetables", value: "cucumber" }
];

const reduced = [combineArray.reduce((acc, curr) => {
    acc[curr.type] = acc[curr.type] || []
    acc[curr.type].push(curr)
    return acc
}, {})]


console.log('reduced', reduced)