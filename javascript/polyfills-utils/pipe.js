function pipe(...funcs) {
    return function piped(...args) {
        return funcs.reduce((result, func) => [func.call(this, ...result)], args)[0];
    };
}

function pipe1(...funcs) {
    return function piped(...args) {
        let result = args;
        for (let i = 0; i < funcs.length; i++) {
            result = [funcs[i].call(this, ...result)];

        }
        return result[0];
    };
}


// intital value in reduce is args which is of type array
// So we pass the first instance of func in a array and spread the intital results

// Define the functions that add to the string
function addPrefix(str) {
    return "prefix-" + str;
}

function addSuffix(str) {
    return str + "-suffix";
}

function toUppercase(str) {
    return str.toUpperCase()
}

// Create a piped function that applies the three functions in the correct order
const decorated1 = pipe(addPrefix, addSuffix, toUppercase);
const decorated2 = pipe(toUppercase, addPrefix, addSuffix);
const decorated3 = pipe1(addPrefix, addSuffix, toUppercase);
const decorated4 = pipe1(toUppercase, addPrefix, addSuffix);

// Call the piped function with the input string
const result1 = decorated1("hello");		// PREFIX-HELLO-SUFFIX
const result2 = decorated2("hello");		// prefix-HELLO-suffix
const result3 = decorated3("hello");		// PREFIX-HELLO-SUFFIX
const result4 = decorated4("hello");		// prefix-HELLO-suffix
console.log(result1, result2, result3, result4);