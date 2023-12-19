const arr = [1, 2, 3, 4, 5, 622, 3, 4, 5, 5, 6];

const index = 3; 

Array.prototype.myAt = function myAt(index) {
  for (let i = 0; i < this.length; i++) {
    if (i == index) {
      return this[i];
    }
  }
};

console.log(arr.at(6));
console.log(arr.myAt(6));
