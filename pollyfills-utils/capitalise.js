function captilise(str) {
  const arr = str.split(" ");
  let res = [];

  for (let item of arr) {
    res = res + " " + item[0].toUpperCase() + item.slice(1);
  }
  return res;
}

console.log(captilise("my name is dival"));

// My Name Is Dival

String.prototype.capitalise = function captilise() {
  const arr = this.split(" ");
  let res = [];

  for (let item of arr) {
    res = res + " " + item[0].toUpperCase() + item.slice(1);
  }
  return res;
};

const str = "my name is david";

console.log(str.capitalise());
