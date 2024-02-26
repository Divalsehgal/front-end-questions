let ar = [1, 2, 3, 4, 5, 6]; 
let k = 4;

let temp = [],
  temp1 = [],
  res = [],
  res1;

for (let i = 0; i < ar.length; i++) {
  if (i < ar.length - k) {
    temp.push(ar[i]);
  } else {
    temp1.push(ar[i]);
  }
  res = [...temp1, ...temp];
}

const temp3 = ar.slice(ar.length - k);

res1 = [...temp3, ...ar.splice(0, ar.length - k)];

console.log(res1,res);
