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
