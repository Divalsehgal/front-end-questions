function mergeAndSortArrays(arr1, arr2) {
    // Step 1: Sort both arrays
    arr1.sort((a, b) => a - b);
    arr2.sort((a, b) => a - b);

    // Step 2: Merge them using two-pointer technique
    let i = 0, j = 0;
    let mergedArray = [];

    while (i < arr1.length && j < arr2.length) {
        if (arr1[i] < arr2[j]) {
            mergedArray.push(arr1[i]);
            i++;
        } else {
            mergedArray.push(arr2[j]);
            j++;
        }
    }

    // Add remaining elements from arr1 (if any)
    while (i < arr1.length) {
        mergedArray.push(arr1[i]);
        i++;
    }

    // Add remaining elements from arr2 (if any)
    while (j < arr2.length) {
        mergedArray.push(arr2[j]);
        j++;
    }

    return mergedArray;
}

const arr1 = [3, 1, 2];
const arr2 = [5, 3, 4, 1, 2];

console.log(mergeAndSortArrays(arr1, arr2));
