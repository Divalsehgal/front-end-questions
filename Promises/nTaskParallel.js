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


async function runTasksInParallel(array) {
    try {
        // const result = await Promise.all(array.map((a) => a()))
        const result = await Promise.allSettled(array.map((a) => a()))

        console.log(result)
    } catch (error) {
        console.log(error)
    }
}


runTasksInParallel(Promises)