const arr = [1, 2, 3];

const arr1 = [4,5,6];

Array.prototype.myConcat = function myConcat(array) {
  let temp = [...this];

  for (let i = 0; i < arguments.length; i++) {
    const arg = arguments[i];
    if (Array.isArray(arg)) {
      for (let i = 0; i < arg.length; i++) {
        temp.push(arg[i]);
      }
    } else {
    temp.push(arg);

    }
  }
  return temp;
};

console.log(arr.concat(arr1, [7, 8], [9, 19]));

console.log(arr.myConcat(arr1, [7,8],[9,19]));
