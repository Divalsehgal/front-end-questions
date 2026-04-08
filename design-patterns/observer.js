/*

“Observer pattern means one object
notifies multiple objects
when something changes.”

*/

const subscribers = []

function subscribe(fn) {
    subscribers.push(fn)
}

function notify(data) {
    subscribers.forEach(fn => fn(data))
}

// subscribers
subscribe((data) => console.log("User1:", data))
subscribe((data) => console.log("User2:", data))

// trigger
notify("New update!")