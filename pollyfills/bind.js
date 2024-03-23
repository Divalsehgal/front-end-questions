let obj1 = {
  name: "Dival",
};

//function
let temp = function greet() {
  console.log( `my name is ${this.name}`);
};

// myBind
Function.prototype.myBind = function (obj, ...args) {
  let func = this;
  return function (...newArgs) {
    func.apply(obj, [...args, ...newArgs]);
  };
};

// new func after bind
const greet3 = temp.myBind(obj1);

let myFunc = function (id, city) {
  console.log(`${this.name}, ${id}, ${city}`);
};

const newFunc = myFunc.myBind(obj1, "a_random_id");
newFunc("New York");
greet3();
