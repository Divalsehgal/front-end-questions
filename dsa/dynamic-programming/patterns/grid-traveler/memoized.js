// // GRID
// // always try to calculate and then reduced it to base case
let point={
    x:1,y:2
}
const gridTraveler = (x, y,memo={point}) => {
  const key=`${x},${y}`;
  if(key in memo) {
  return memo[key];
  }
  if (x === 1 && y == 1) return 1;
  if (x === 0 || y == 0) return 0;
  memo[key]= gridTraveler(x, y - 1,memo) + gridTraveler(x - 1, y,memo);
  return memo[key]
};

console.log(gridTraveler(2, 3));

console.log(gridTraveler(40, 10));
