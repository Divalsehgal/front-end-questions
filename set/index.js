// !----------------------------------------------------------------SET and MAP Behaviuor----------------------------------------------------------------

var set = new Set(["a", "b", "c", "d", "e"]);
var it = set.values();
console.log("1", it.next());
var it = set.keys();
console.log("2", it.next());
var map = new Map([
  [150, "abc"],
  [120, "def"],
]);
var it = map.entries();
console.log("3", it.next());
var it = map.values();
console.log("4", it.next());
var it = map.keys();
console.log("5", it.next());

