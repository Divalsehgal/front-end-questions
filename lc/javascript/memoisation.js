function memo(func, resolver) {
  let cache = {};

  return function (...args) {
    const cacheKey = resolver ? resolver(...args) : args.join(",");

    if (cache[cacheKey]) {
      return cache[cacheKey];
    } else {
      const result = func.apply(this, args);
      cache[cacheKey] = result;
      return result;
    }
  };
}
const memo1=memo(sum)

function sum(a, b) {
  return a + b;
}
console.log(memo1(2, 3));
