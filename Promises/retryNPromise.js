const p1 = new Promise(function (resolve) {
    setTimeout(function () {
        resolve("first resolved after 1 second")
    }, 1000)
})

// const p2 = new Promise(function (_, reject) {
//     setTimeout(function () {
//         reject("second rejected after 2 second")
//     }, 2000)
// })

const p3 = new Promise(function (resolve) {
    setTimeout(function () {
        resolve("second resolved after 3 second")
    }, 3000)
})

// const p4 = new Promise(function (_, reject) {
//     setTimeout(function () {
//         reject("fourth resolved")
//     }, 1000)
// })


// Promise.all([p1, p3]).then((result) => {
//   return result.map((r)=>console.log(r))
// }).catch((err) => console.log(err));


const waitFun = (delay) => {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve()
        }, delay)
    })
}
function retry(fn, retry, delay, finalError) {
    return new Promise(function (resolve, reject) {

        return fn().then(function () {
            resolve()
        }).catch((err) => {
            if (retry > 0) {
                return waitFun(delay)
                    .then(retry(fn, retry - 1, delay, finalError))
                    .then(resolve)
                    .catch(reject)
            }
            return reject(finalError)
        })
    })
}


retry(asyncFn, retries = 3, delay = 1000, finalError = 'Failed');



