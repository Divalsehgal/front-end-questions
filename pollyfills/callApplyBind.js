const person = {
  name: "dival",
  id: 1,
};
function bio(location) {
  console.log(
    "hello" +
      " " +
      "my name is " +
      this.name +
      " " +
      "and id is " +
      this.id +
      " " +
      " " +
      "from" +
      " " +
      location
  );
}

Function.prototype.myCall = function (context = {}, ...args) {
  if (typeof this !== "function") {
    throw new Error("function is not callable");
  }

  context.fn = this;
  context.fn(...args);
};

Function.prototype.myApply = function (context = {}, args = []) {
  if (typeof this !== "function") {
    throw new Error("function is not callable");
  }
  if (Array.isArray(...args)) {
    throw new TypeError("Args are not array");
  }

  context.fn = this;
  context.fn(...args);
};

Function.prototype.myBind = function (context = {}, ...args) {
  if (typeof this !== "function") {
    throw new Error("can not be bound is not callable");
  }

  context.fn = this;

  return function (...args2) {
    return context.fn(...args, ...args2);
  };
};

bio.myCall(person, "chamba");

bio.myApply(person, ["chamba"]);

const temp = bio.bind(person, "chamba");
temp();

const temp2 = bio.myBind(person, "chamba");
temp2();

