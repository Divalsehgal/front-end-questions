function multiply(a, b) {
    return new Promise((resolve, reject) => {
        const res = a * b
        resolve(res);
    })

}

async function run() {
    const result = await multiply(5, 3)
    console.log(result)
}

run()