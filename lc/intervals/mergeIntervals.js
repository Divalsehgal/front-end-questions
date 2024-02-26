var merge = function (intervals) {
  let temp = [];

  let r = intervals.sort((a, b) => a[0] - b[0]);
  let start = intervals[0][0];
  let end = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] <= end) {
      end = Math.max(end, intervals[i][1]);
    } else {
      temp.push([start, end]);
      start = intervals[i][0];
      end = intervals[i][1];
    }
  }
  console.log(start, end);

  temp.push([start, end]);
  return temp;
};

let intervals = [
  [1, 4],
  [2, 3],
];

console.log(merge(intervals));
