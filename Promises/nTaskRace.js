const Promises = [
    () => new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Promise 1 resolved");
        }, 1000);
    }),
    () => new Promise((resolve, reject) => {
        setTimeout(() => {
            reject("Promise 2 rejected");
        }, 980);
    }),
    () => new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Promise 3 resolved");
        }, 3000);
    })
];



async function runTasksInSeries(array) {
    try {
        const result = await Promise.race(array.map((task) => task()))
        console.log(result)
    } catch (error) {
        console.log(error);
    }
}

runTasksInSeries(Promises)