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







