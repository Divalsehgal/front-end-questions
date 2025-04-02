Array.prototype.groupBy = function (fn) {
  let obj = {},
    self = this;
  for (let i = 0; i <= this.length - 1; i++) {
    if(obj[fn(this[i])]) {
        obj[fn(this[i])] = [this[i], ...obj[fn(this[i])]];
    }else{
        obj[fn(this[i])] = [this[i]];
    }

  }
    return obj
};

const array = [[1,2,3],[1,3,5],[1,5,9]];
const fn = function (list) {
  return String(list[1]);
};

console.log(array.groupBy(fn));
