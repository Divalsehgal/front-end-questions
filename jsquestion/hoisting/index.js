/*

Hoisting is a process similar to hoisting a flag.
In JavaScript, it means variables and functions are declared in memory before execution.

We can declare variables in 3 ways:
let, const, var

var is function scoped  
let is block scoped  
const is also block scoped and used for constants, cannot be reassigned

There is a phenomenon called TDZ (Temporal Dead Zone) which gives ReferenceError

This happens when we try to access a variable before it is initialized.
JavaScript first creates memory (hoisting phase), then executes code.

In case of var:
it is declared and initialized with undefined, so no error

In case of let and const:
they are declared but not initialized, so accessing them before initialization
will give ReferenceError due to TDZ

*/

console.log(f)
console.log(a)
const a = 9

var f = 9


