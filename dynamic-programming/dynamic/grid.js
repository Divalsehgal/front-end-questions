// // GRID
// // always try to calculate and then reduced it to base case
let point={
    x:1,y:2
}
const grid = (x, y,memo={point}) => {
  const key=`${x},${y}`;
  if(key in memo) {
  return memo[key];
  }
  if (x === 1 && y == 1) return 1;
  if (x === 0 || y == 0) return 0;
  memo[key]= grid(x, y - 1,memo) + grid(x - 1, y,memo);
  return memo[key]
};

console.log(grid(2, 3));

console.log(grid(40, 10));
