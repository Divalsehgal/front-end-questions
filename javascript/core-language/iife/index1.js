// var hoisting + closures over setTimeout - x is reassigned before the timeout fires (logs updated value),
// y is declared with var lower down but hoisted, so it's accessible (undefined until the assignment runs) instead of throwing

let x = 10;
function A() {
  setTimeout(function () {
    console.log(x);
    console.log(y);
  }, 3000);
}
A();

x = 99;

var y = 20;
