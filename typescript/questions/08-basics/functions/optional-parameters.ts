/**
 * TOPIC: Functions & Optional Parameters
 */
const subWithOptionalDivision = (numbers: number[], divisor?: number) => {
    let temp = 0;
    for (const i of numbers) {
        temp += i
    }
    if (divisor) {
        temp = temp / divisor
        return temp; // Fixed: returned the value
    } else {
        return temp
    }
}

console.log("Sum:", subWithOptionalDivision([1, 2, 3]));
console.log("Divided:", subWithOptionalDivision([10, 20], 2));
