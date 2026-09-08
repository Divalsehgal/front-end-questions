// var shadowing + hoisting inside nested IIFEs - the inner function's own `var x` is hoisted to the top
// of its scope, so console.log(x) here logs undefined, NOT the outer x=43 or x=23

var x = 23;

(function () {
  var x = 43;
  (function random() {
    // x++;
    console.log(x);
    var x = 21;
  })();
})();
