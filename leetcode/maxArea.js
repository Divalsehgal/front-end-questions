var maxArea = function (height) {
  let max = 0;
  for (let i = 0; i < height.length; i++) {
    for (let j = i + 1; j < height.length; j++) {
      let area = Math.min(height[j], height[i]) * (j - i);
      max = Math.max(area, max);
    }
  }
  return max;
};
const arr = [4, 2];

console.log(maxArea(arr));
