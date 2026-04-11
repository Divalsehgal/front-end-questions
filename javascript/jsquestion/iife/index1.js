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
