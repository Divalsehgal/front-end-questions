//iife closure - block scoping (const r is scoped to the IIFE, shadows outer r) + typeof always returns a string, so it must be compared to "undefined" not undefined

const r = "Dival";

(function () {
  const r = "minal";
  console.log(typeof r, r);
  if (typeof r === "undefined") {
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

//x is new and scoped to catch



(function (a) {
  return (function () {
    console.log(a)
    a = 6;
    console.log(a)
  })()
})(21)






