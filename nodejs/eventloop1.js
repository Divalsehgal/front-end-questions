const fs = require("fs");
const a = 100;

setImmediate(() => console.log("setImmediate"));

fs.readFile("./file.txt", "utf8", () => {
    console.log("File Reading CB");
});

setTimeout(() => console.log("Timer expired"), 0);

function printA() {
    console.log("a=", a);
}

printA();
console.log("Last line of the file.");

// a=100
// Last line of the file.
// Timer expired / setImmediate -> order NOT guaranteed here (see index.md #4:
// outside an I/O callback, the setTimeout(0) vs setImmediate race depends on
// how fast the event loop reaches the Timers phase, so either can print first)
// File Reading CB (last, since fs.readFile only resolves once the Poll phase
// gets the completed I/O event, which takes longer than the two timers above)