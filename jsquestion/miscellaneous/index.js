const num = parseInt('7*6', 10);



// counter.js
let counter = 10;
export default counter;
// index.js
import myCounter from './counter';

myCounter += 1;

console.log(myCounter);

// An imported module is read - only: you cannot modify the imported module.
// Only the module that exports them can change its value.