// write a fibonnaci function which return the nth number from the series.
// */
// FIBONACCI
// //1, 1, 2, 3, 5, 8, 13, 21

function fibonnaciFunction(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 2) {
    return 1;
  }
  memo[n] = fibonnaciFunction(n - 1, memo) + fibonnaciFunction(n - 2, memo);
  return memo[n];
}
console.log("start fibonnaci function");
console.log(fibonnaciFunction(8));













