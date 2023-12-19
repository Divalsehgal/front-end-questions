var x = 23;

(function () {
  var x = 43;
  (function random() {
    // x++;
    console.log(x);
    var x = 21;
  })();
})();
