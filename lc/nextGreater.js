var nextGreaterElement = function (nums1, nums2) {
  let temp = [];
  for (let i = 0; i < nums1.length; i++) {
    const index = nums2.indexOf(nums1[i]);
    let max = nums2[index];
    console.log("index", index);

    if (nums2[index + 1]) {
      for (let j = index + 1; j < nums2.length; j++) {
        max = Math.max(max, nums2[j]);
        if(max > nums2[index]){
          break;
        }
      }
      if (max === nums2[index]) {
        temp.push(-1);
      } else {
        temp.push(max);
      }
    } else {
      temp.push(-1);
      continue;
    }
  }
  return temp;
};

var nextGreaterElement = function (nums1, nums2) {
  const stack = [];
  const map = new Map();

  for (let num of nums2) {
    while (stack.length > 0 && num > stack[stack.length - 1]) {
      map.set(stack.pop(), num);
    }
    stack.push(num);
  }

  while (stack.length > 0) {
    map.set(stack.pop(), -1);
  }

  const result = nums1.map((num) => map.get(num));
  return result;
};

const nums1 = [4, 1, 2],
  nums2 = [1, 3, 4, 2];

console.log(nextGreaterElement(nums1, nums2));
