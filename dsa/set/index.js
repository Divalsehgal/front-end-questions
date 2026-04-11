// !----------------------------------------------------------------SET  Behaviuor----------------------------------------------------------------

const set = new Set(["a", "b", "c", "d", "e"]);
let it = set.values();

console.log("1", it.next());
it = set.keys();
console.log(set.has("a"))
console.log(set.keys())
console.log("2", it.next());


