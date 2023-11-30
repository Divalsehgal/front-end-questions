//iife closure

// var r = "Dival";

// (function () {
//   var r = "minal";
//   console.log(typeof r, r);
//   if (typeof r === undefined) {
//     console.log(`hello ${r}`);
//   } else {
//     console.log("hello world");
//   }
// })();

// fetching async

// async function get() {
//   const res = await fetch("https://dummyjson.com/products");
//   const json = await res.json();

//   console.log(json);
// }

// get();

// same frequency anagram group them together

// const arr1 = [
//   "cat",
//   "dog",
//   "act",
//   "actt",
//   "god",
//   "fish",
//   "shif",
//   "a",
//   "a",
//   "bfcd",
// ];

// let temp = "";
// let temp2 = {};
// for (let i = 0; i < arr1.length; i++) {
//   temp = [...arr1[i]].sort((a, b) => (a > b ? 1 : -1)).join("");

//   if (!temp2[temp]) {
//     temp2[temp] = [arr1[i]];
//   } else {
//     temp2[temp].push(arr1[i]);
//   }
// }

/*

Solution :
{
0: ["cat","act"],
1: ["dog","god"],
2: ["fish","shif],
3: ["a","a]
}
*/

// function groupAnagrams(words) {
//   const anagramGroups = {};

//   for (const word of words) {
//     const sortedWord = word.split("").sort().join("");
//       console.log(sortedWord,word)
//     if (!anagramGroups[sortedWord]) {
//       anagramGroups[sortedWord] = [word];
//     } else {
//       anagramGroups[sortedWord].push(word);
//     }
//   }

//   const result = Object.values(anagramGroups);

//   return result;
// }

// const words = ["eat", "tea", "tan", "ate", "nat", "bat"];
// const anagramGroups = groupAnagrams(words);
// console.log(anagramGroups);

//merge intervals

// var merge = function (intervals) {
//   let temp = [];

//   let r = intervals.sort((a, b) => a[0] - b[0]);
//   let start = intervals[0][0];
//   let end = intervals[0][1];

//   for (let i = 1; i < intervals.length; i++) {
//     if (intervals[i][0] <= end) {
//       end = Math.max(end, intervals[i][1]);
//     } else {
//       temp.push([start, end]);
//       start = intervals[i][0];
//       end = intervals[i][1];
//     }
//   }
//   console.log(start, end);

//   temp.push([start, end]);
//   return temp;
// };

// let intervals = [
//   [1, 4],
//   [2, 3],
// ];

// console.log(merge(intervals));

// function findFarthestSeat(layout) {
//   let farthestSeatIndex = -1;
//   let maxDistance = -1;
//   let prevOccupiedIndex = -1;

//   for (let i = 0; i < layout.length; i++) {
//     if (layout[i] === 1) {
//       prevOccupiedIndex = i;
//     } else if (i === layout.length - 1) {
//       const distance = i - prevOccupiedIndex;

//       if (distance > maxDistance) {
//         maxDistance = distance;
//         farthestSeatIndex = i;
//       }
//     } else if (prevOccupiedIndex === -1) {
//       const distance = layout.length - i;

//       if (distance > maxDistance) {
//         maxDistance = distance;
//         farthestSeatIndex = i;
//       }
//     }
//   }

//   return farthestSeatIndex;
// }

// const bestSeatIndex = findFarthestSeat([1, 0, 0, 0, 0, 0, 0, 0, 1, 0]);
// console.log(bestSeatIndex);

// shift array
// let ar = [1, 2, 3, 4, 5, 6]; // 0 1 2 3 4 5  //

// let k = 2;

// let temp = [],
//   temp1 = [],
//   res = [];

// for (let i = 0; i < ar.length; i++) {
//   if (i < ar.length - k) {
//     temp.push(ar[i]);
//   } else {
//     temp1.push(ar[i]);
//   }
//   res = [...temp1, ...temp];
// }

// console.log(res);

// const isPalindrome = (string) => {
//   const validCharacters = string.split("");
//   const stringCharacters = string
//     .toLowerCase()
//     .split("")
//     .reduce(
//       (characters, character) =>
//         validCharacters.indexOf(character) > -1
//           ? characters.concat(character)
//           : characters,
//       []
//     );
//   return stringCharacters.join("") === stringCharacters.reverse().join("");
// };

// console.log(isPalindrome());

// undefined to null
// undefinedToNull({a: undefined, b: 'BFE.dev'})

// // {a: null, b: 'BFE.dev'}

// undefinedToNull({a: ['BFE.dev', undefined, 'bigfrontend.dev']})
//  // {a: ['BFE.dev', null, 'bigfrontend.dev']}

//  function captilise(str){

//     const arr=str.split(" ");
//     let res=[]

//     for(let i=0;i <arr.length;i++){
//     res= res+ " "+arr[i][0].toUpperCase() + arr[i].slice(1)

//     }
//   return res

// }

// console.log(captilise("my name is dival"))

// // My Name Is Dival

// String.prototype.capitalise=function captilise(){
//     const arr=this.split(" ");
//     let res=[]

//     for(let i=0;i <arr.length;i++){
//     res= res+ " "+arr[i][0].toUpperCase() + arr[i].slice(1)

//     }
//   return res

// }

// const str="my name is david";

// console.log(str.capitalise())

// var threeSum = function (nums) {
//   let obj = {};
//   nums = nums.sort((a, b) => a - b);
//   // console.log(nums)
//   for (let start = 0; start < nums.length; start++) {
//     let right = nums.length - 1;
//     let left = start + 1;
//     while (left < right) {
//       if (nums[left] + nums[right] + nums[start] == 0) {
//         // console.log(start,left,right)
//         // arr.push([nums[start],nums[left],nums[right]])
//         obj[[nums[start], nums[left], nums[right]]] = [
//           nums[start],
//           nums[left],
//           nums[right],
//         ];
//         left++;
//         right--;
//       } else if (nums[left] + nums[right] + nums[start] > 0) {
//         right--;
//       } else if (nums[left] + nums[right] + nums[start] < 0) {
//         left++;
//       }
//     }
//   }
//   return Object.values(obj);
// };

// const nums = [-1, 0, 1, 2, -1, -4];
// console.log(threeSum(nums))

// var insert = function (intervals, newInterval) {
//   let temp = [],
//     temp1 = [],
//     first,
//     end,
//     f,
//     e;
//     f = newInterval[0];
//     e = newInterval[1];
//   for (let i of intervals) {
//     first = i[0];
//     end = i[1];
//     if (e < first) {
//       temp.push(i);
//     } else if (f > end) {
//       temp1.push(i);
//     } else {
//       e = Math.max(e, end);
//       f = Math.min(f, first);
//     }
//   }
//   console.log(temp,[f,e],temp1)
// console.log([...temp, [f, e], ...temp1]);
// };

// const intervals = [[1,3],[6,7]], newInterval = [6,13];

// console.log(insert(intervals,newInterval));

// function A() {
//   setTimeout(() => {
//     console.log(x);
//     console.log(y);
//   }, 3000);
// }

// let x = 10;
// var y = 20;

// A();

// var x = 23;

// (function () {
//   var x = 43;
//   (function random(){
//     x++;
//     console.log(x);
//     var x = 21;
//   })()
// })();

// function bindFunc() {
//   const a = "Dival";
//   return `my name is ${this.a ?? a}`;
// }
// const obj = {
//   a: "Minal",
// };
// const temp = bindFunc.bind(obj);
// console.log(bindFunc());
// console.log(temp());
// console.log(bindFunc());



// Array.prototype.myReduce=function myReduce(a,b){

//     let temp=b;
//     for(let i=0;i<this.length;i++){
//        if(temp){
//         temp=a.call(null, temp, this[i]);
//        }else{
//         temp=this[i]
//        }
//     }
//     return temp

// }

// const arr=[1,2,3,3,5]

// function sum(a,b){
//     return a+b
// }
// console.log(arr.myReduce(sum, 0));

//console.log(arr.reduce(sum,0));


// function* getIdGenerator(initialValue = 0) {
//   let id = initialValue;
//   while (true) {
//     yield id++;
//   }
// }

// const idGenerator = getIdGenerator();

// console.log(idGenerator.next().value); // 0
// console.log(idGenerator.next().value); // 1
// console.log(idGenerator.next().value); // 2
// console.log(idGenerator.next().value); // 3