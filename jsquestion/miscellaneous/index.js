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

var foo = function () {

    var args = Array.prototype.slice.call(arguments)
    console.log(args[1])
}

foo(1, 2, 4)



const obj1 = {
    a: 5,
    b: {
        c: 6
    }

}
const obj2 = Object.assign({}, obj1)
const obj3 = { obj1 }
obj1.b.c = 8
console.log(Object.assign({}, obj1, obj2, obj3))




var obj = { hasOwnProperty: 1, foo: 2 }
obj.hasOwnProperty("foo")