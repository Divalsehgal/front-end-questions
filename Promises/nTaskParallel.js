const Promises = [
    () => new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Promise 1 resolved");
        }, 1000);
    }),
    () => new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Promise 2 resolved");
        }, 2000);
    }),
    () => new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Promise 3 resolved");
        }, 3000);
    })
];

Promise.customAll = function (array) {
    let result = [], itemsCompleted = 0

    return new Promise((resolve, reject) => {

        array.forEach((promise, index) => {
            promise.then((res) => {
                result[index] = res
                itemsCompleted++
                if (itemsCompleted === array.length) {
                    resolve(result)
                }
            }).catch((error) => {
                reject(error)
            })

        })

    })


}

async function runTasksInParallel(array) {
    try {
        const result = await Promise.all(array.map((a) => a()))
        const result1 = await Promise.customAll(array.map((a) => a()))
        console.log('custom', result1, 'old', result)
    } catch (error) {
        console.log(error)
    }
}


runTasksInParallel(Promises)