const b = {
  name: "Vivek",
  f: function () {
    var self = this;
    console.log("1",this.name);
    (function () {
      console.log("2",this.name);
      console.log("3",self.name);
    })();
  },
};
b.f();
