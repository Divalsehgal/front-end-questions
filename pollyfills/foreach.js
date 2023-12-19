  let temp = [];
function product4(i) {
   i = i * 4;
  temp.push(i);
}
 const arr = [1, 2, 3];

arr.forEach(product4);

Array.prototype.myForEach = function myForEach(fn) {
  for (let i = 0; i < this.length; i++) {
    if (this.indexOf(this[i]) > -1) {
    fn.call(this,this[i]);
  }
}
};

arr.myForEach(product4);
console.log(temp);
