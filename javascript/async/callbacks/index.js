/**
 * WHAT IS A CALLBACK?
 * 
 * Simple Definition: A callback is a function passed as an argument 
 * to another function.
 * 
 * Why it works: In JS, functions are "First-Class Citizens" – they can 
 * be passed around just like numbers or strings.
 */

// 1. A Simple Synchronous Callback
function processInput(name, callback) {
    console.log("--- Basic Callback ---");
    console.log("Processing name:", name);
    callback(name); // Executing the callback
}

processInput("Alice", (n) => {
    console.log("Callback executed for:", n.toUpperCase());
});


// 2. An Asynchronous Callback (The real power)
console.log("\n--- Async Callback Analogy ---");
console.log("1. Ordering Pizza...");

setTimeout(() => {
    console.log("3. Pizza is ready! (This is the callback)");
}, 2000);

console.log("2. Watching TV while waiting...");


// ===========================================================================
// PREVIOUS SECTIONS: CALLBACKS vs PROMISES
// ===========================================================================

function fetchUserCallback(id, callback) {
    console.log("Fetching user...");
    setTimeout(() => {
        // Simulating success
        const user = { id: id, username: "JohnDev" };
        callback(null, user); // Standard error-first callback pattern
    }, 1000);
}

console.log("--- Callback Example ---");
fetchUserCallback(1, (err, user) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log("User received:", user);
});


// ===========================================================================
// SECTION 2: CALLBACK HELL (THE PROBLEM)
// ===========================================================================
/*
getData( (a) => {
    getMoreData( a, (b) => {
        getEvenMoreData( b, (c) => {
            // This is "Callback Hell" or the "Pyramid of Doom"
        });
    });
});
*/


// ===========================================================================
// SECTION 3: THE PROMISE WAY (THE SOLUTION)
// ===========================================================================

function fetchUserPromise(id) {
    return new Promise((resolve, reject) => {
        console.log("\nFetching user via Promise...");
        setTimeout(() => {
            const success = true;
            if (success) {
                resolve({ id: id, username: "PromiseDev" });
            } else {
                reject("Failed to fetch user");
            }
        }, 1500);
    });
}

console.log("\n--- Promise Example ---");
fetchUserPromise(2)
    .then(user => {
        console.log("User received via Promise:", user);
        return user.username; // Chaining
    })
    .then(name => {
        console.log("User name is:", name);
    })
    .catch(error => {
        console.error("Error:", error);
    })
    .finally(() => {
        console.log("Async operation complete.");
    });


// ===========================================================================
// INTERVIEW CHEAT SHEET
// ===========================================================================
/*
Q: What is a Promise?
A: An object representing the eventual completion (or failure) of an 
   asynchronous operation. It has three states: Pending, Resolved, and Rejected.

Q: Why are Promises better than Callbacks?
A: 1. Readability: Avoids deep nesting (Callback Hell).
   2. Error Handling: Provides .catch() for centralized error management.
   3. Composition: Allows easy chaining and running tasks in parallel (Promise.all).
   4. Trust: Promises are settled only once; callbacks can be called multiple times 
      accidently if handled poorly by a 3rd party library.
*/
