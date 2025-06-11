const waitFun = (delay) => {
    return new Promise((resolve) => setTimeout(resolve, delay));
};

async function retry(fn, retries, delay, finalError) {

    return fn()
        .then((result) => result) // Return the result if successful
        .catch((err) => {
            console.log(`Retry attempts left: ${retries}, Error: ${err}`);
            for (let i = 0; i < retries; i++) {
                if (retries > 0) { 
                    return waitFun(delay)
                        .then(() => retry(fn, retries - 1, delay, finalError)); // Ensure proper chaining
                }
            }

            return Promise.reject(finalError); // Properly reject the final error
        });
}

async function retry1(fn, retries, delay, finalError) {
    for (let i = 0; i <= retries; i++) {
        try {
            return await fn(); // Try executing the function
        } catch (err) {
            console.log(`Attempt ${i + 1} failed: ${err}`);
            if (i < retries) {
                await waitFun(delay); // Wait before retrying
            } else {
                throw finalError; // Final failure after all retries
            }
        }
    }
}

async function asyncFn() {
    console.log("Trying...");
    return Promise.reject("Error occurred"); // Simulate failure
}


// recursive
// retry(asyncFn, 3, 2000, "Failed")
//     .then(() => console.log("Success"))
//     .catch((err) => console.log("Final error:", err));


//iterative

retry1(asyncFn, 3, 2000, "Failed")
    .then(() => console.log("Success"))
    .catch((err) => console.log("Final error:", err));
