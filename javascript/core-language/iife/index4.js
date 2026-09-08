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
// Inside IIFE → console.log("2", this.name); this is undefined in strict mode (bare function call), so this.name
// THROWS "TypeError: Cannot read properties of undefined (reading 'name')" - it does NOT log "2 undefined".
// In non-strict mode this defaults to the global object (window in browsers), so this.name would log undefined/window.name
// depending on the environment, without throwing.
// Inside IIFE → console.log("3", self.name); b(self stored from f)	b	"3 Vivek"