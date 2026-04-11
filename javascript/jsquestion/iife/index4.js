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


// Execution Breakdown
// Line	this Value	self Value	Output
// console.log("1", this.name);	b	b	"1 Vivek"
// Inside IIFE → console.log("2", this.name); undefined(strict mode) or window(non - strict)	b	"2 undefined"(strict) / "2 [window.name]"(non - strict)
// Inside IIFE → console.log("3", self.name); b(self stored from f)	b	"3 Vivek"