function captilise(str) {
  const arr = str.split(" ");
  let res = [];

  for (let i = 0; i < arr.length; i++) {
    res = res + " " + arr[i][0].toUpperCase() + arr[i].slice(1);
  }
  return res;
}

console.log(captilise("my name is dival"));

// My Name Is Dival

String.prototype.capitalise = function captilise() {
  const arr = this.split(" ");
  let res = [];

  for (let i = 0; i < arr.length; i++) {
    res = res + " " + arr[i][0].toUpperCase() + arr[i].slice(1);
  }
  return res;
};

const str = "my name is david";

console.log(str.capitalise());
