const Promises = [
    () => new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Promise 1 resolved");
        }, 1000);
    }),
    () => new Promise((resolve, reject) => {
        setTimeout(() => {
            reject("Promise 2 rejected");
        }, 2000);
    }),
    () => new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Promise 3 resolved");
        }, 3000);
    })
];

async function runTasksInSeries(array) {
    for (const task of array) {
        try {
            const result = await task(); // Execute the task
            console.log(result);
        } catch (error) {
            console.log(error); // Log error without re-running the task
        }
    }
}

// Run the function
runTasksInSeries(Promises);
