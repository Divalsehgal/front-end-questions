var students = new Map([
  ["stu1", "maths"],
  ["stu2", "science"],
  ["stu3", "english"],
  ["stu4", "hindi"],
  ["stu5", "social"],
  ["stu6", "IT"],
]);
for (let i of students.entries()) console.log(i[0], i[1]);
