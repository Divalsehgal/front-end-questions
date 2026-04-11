// main.js
const f1 = require("./a");
const f2 = require("./a");

console.log(f1());
console.log(f2());

//Node caches modules, so multiple requires share the same state.