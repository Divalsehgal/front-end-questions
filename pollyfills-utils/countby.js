function countBy(array, iteratee) {
  let obj = {};
  for (let i = 0; i < array.length; i++) {
    const value = iteratee.call(this, array[i]);
    if (!obj[value]) {
      obj[value] = 1;
    } else {
      obj[value]++;
    }
  }
  return obj;
}

const arr = [6.1, 4.2, 6.3];
const iteratee = Math.floor;

console.log(countBy(["one"], "length"));
