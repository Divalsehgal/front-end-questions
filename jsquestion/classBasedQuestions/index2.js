

// index.js
console.log('running index.js');
import { sum } from './sum.js';
console.log(sum(1, 2));

// sum.js
console.log('running sum.js');
export const sum = (a, b) => a + b;



/*

With the import keyword, all imported modules are pre-parsed.
This means that the imported modules get run first,
the code in the file which imports the module gets executed after.

This is a difference between require() in CommonJS and import! 
With require(), you can load dependencies on demand while the code is being run.
If we would have used require instead of import, running index.js, running sum.js,
 3 would have been logged to the console.

*/