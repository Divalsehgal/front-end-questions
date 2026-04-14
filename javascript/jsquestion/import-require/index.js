

// index.js
console.log('running index.js');
import { sum } from './sum.js';
console.log(sum(1, 2));
/*

With the import keyword, all imported modules are pre-parsed.
This means that the imported modules get run first,
the code in the file which imports the module gets executed after.

This is a difference between require() in CommonJS and import! 
With require(), you can load dependencies on demand while the code is being run.


import { sum } from './sum.js';
running sum.js
running index.js
3

const {sum}=require("./sum.js")

running index.js
running sum.js
3
*/