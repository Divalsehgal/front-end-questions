var isValid = function (s) {
  let ctomap = {
    "]": "[",
    "}": "{",
    ")": "(",
  };

  let stack = [];

  for (let i of s) {
    if (i in ctomap) {
      if (stack.length !== 0 && stack[stack.length - 1] === ctomap[i]) {
        stack.pop();
      } else {
        return false;
      }
    } else {
      stack.push(i);
    }
    console.log(stack);
  }

  if (stack.length === 0) {
    return true;
  }else{
    return false
  }
};
console.log(isValid("["));
