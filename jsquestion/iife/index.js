//iife closure

const r = "Dival";

(function () {
  const r = "minal";
  console.log(typeof r, r);
  if (typeof r === undefined) {
    console.log(`hello ${r}`);
  } else {
    console.log("hello world");
  }
})();


(() => {
  let x, y;
  try {
    throw new Error();
  } catch (x) {
    (x = 1), (y = 2);
    console.log(x);
  }
  console.log(x);
  console.log(y);
})();




(function (a) {
  return (function () {
    console.log(a)
    a = 6;
  })()
})(21)






