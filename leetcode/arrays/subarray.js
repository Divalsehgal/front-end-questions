function findSubarrayWithSum(rr, targetSum) {
    let currentSum = rr[0];
    let start = 0;

    for (let end = 1; end < rr.length; end++) {
        while (currentSum > targetSum && start < end - 1) {
            currentSum -= rr[start];
            start++;
        }

        if (currentSum === targetSum) {
            return rr.slice(start, end);
        }

        currentSum += rr[end];
    }

    if (currentSum === targetSum) {
        return rr.slice(start);
    }

    return null;
}

const rr = [-4, -3, 5, -1, -2, 1, 6, -3, -1];
const targetSum = 9;
const subarray = findSubarrayWithSum(rr, targetSum);
console.log("Subarray with sum 9:", subarray);




function nextHigherTemperatures(temperatures) {
    const result = [];
    const stack = [];

    for (let i = 0; i < temperatures.length; i++) {
        while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
            const idx = stack.pop();
            result[idx] = temperatures[i];
        }
        stack.push(i);
    }

    // Remaining elements in the stack don't have a next higher temperature
    while (stack.length > 0) {
        result[stack.pop()] = -1;
    }

    return result;
}

const n = 6;
const temperatures = [23, 21, 40, 31, 25, 35];
const output = nextHigherTemperatures(temperatures);
console.log(output.join(', ')); // Output the result
