const students = new Map([
  ["stu1", "maths"],
  ["stu2", "science"],
  ["stu3", "english"],
  ["stu4", "hindi"],
  ["stu5", "social"],
  ["stu6", "IT"],
]);
for (const i of students.entries()) console.log(i[0], i[1]);


const map = new Map([
  [150, "abc"],
  [120, "def"],
]);
console.log("here",map.values());
let it = map.entries();
console.log("3", it.next());
it = map.values();
console.log("4", it.next());
it = map.keys();
console.log("5", it.next());