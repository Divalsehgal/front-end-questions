// const arr = [1, 2, 3, 4, 5, 622, 3, 4, 5, 5, 6];

// const index = 3; //4

// Array.prototype.myAt = function myAt(index) {
//   for (let i = 0; i < this.length; i++) {
//     if (i == index) {
//       return this[i];
//     }
//   }
// };

// console.log(arr.at(3));
// console.log(arr.myAt(3));

// const arr = [1, 2, 3];

// const arr1 = [4,5,6];

// Array.prototype.myConcat = function myConcat(array) {
//   let temp = [...this];

//   for (let i = 0; i < arguments.length; i++) {
//     const arg = arguments[i];
//     if (Array.isArray(arg)) {
//       for (let i = 0; i < arg.length; i++) {
//         temp.push(arg[i]);
//       }
//     } else {
//     temp.push(arg);

//     }
//   }
//   return temp;
// };

// console.log(arr.concat(arr1, [7, 8], [9, 19],"fd"));

// console.log(arr.myConcat(arr1, [7,8],[9,19],"fd"));
//   let temp = [];
// function product4(i) {

//    i = i * 4;
//   temp.push(i);
// }
//  const arr = [1, 2, 3];

// arr.forEach(product4);

// console.log(temp);

// Array.prototype.myForEach = function myForEach(fn) {
//   for (let i = 0; i < this.length; i++) {
//     if (this.indexOf(this[i]) > -1) {
//     fn.call(this,this[i]);
//   }
// }
// };

// arr.myForEach(product4);
// console.log(temp);

// !---------------------------------------------------------------- Bind polyfill ---

//object
// let obj1 = {
//   name: "Dival",
// };

// //function
// let temp = function greet() {
//   console.log( `my name is ${this.name}`);
// };

// // myBind
// Function.prototype.myBind = function (obj, ...args) {
//   let func = this;
//   return function (...newArgs) {
//     func.apply(obj, [...args, ...newArgs]);
//   };
// };

// // new func after bind
// const greet3 = temp.myBind(obj1);

// let myFunc = function (id, city) {
//   console.log(`${this.name}, ${id}, ${city}`);
// };

// newFunc = myFunc.myBind(obj1, "a_random_id");
// newFunc("New York");
// greet3();

//!---------------------------------------------------------------- Promise Polyfills ----------------------------------------------------------------

// Promise class 6 methods

// .all()  takes array of promses and returns a promise if any error then other promise ignore
// .settled()
// .any()
// .race()
// .resolve()
// .reject()

// async function asyncDemo() {
//   let a, b, c;

//   let promise = new Promise((res, rej) => {
//     a = setTimeout(() => res("hi"));
//     b = setTimeout(() => res("hello"));
//     c = res(3);
//   });

//   clearTimeout(b);
//   clearTimeout(a);

//   let res = await promise;
//   console.log("result", res);
// }

// asyncDemo();

//Promise for just checking whether two strings are eqaul or not

//  var promise= new Promise((res,rej)=>{
// const a ="String";
// const b ="string";
// if(a==b){
// res()
// }else{
// rej()
// }
// })

// promise.then(()=>console.log('string are equal')).catch(()=>console.log('string are not equal'))

// Promise class is simple
// consists of two .then .catch constructor function

// and resolve , reject function for execution

// three states

// fulfilled
// pending
// reject
// value

// function myPromise(executor) {
//   let onResolve,
//     onReject,
//     value,
//     isCalled = false,
//     error,
//     isFulfilled = false,
//     isRejected = false;

//   this.then = function (thenHandler) {
//     onResolve = thenHandler;
//     if (!isCalled && isFulfilled === true) {
//       onResolve(value);
//       isCalled = true;
//     }

//     return this;
//   };

//   this.catch = function (catchHandler) {
//     onReject = catchHandler;

//     if (!isCalled && isRejected === true) {
//       onReject(error);
//       isCalled = true;
//     }

//     return this;
//   };

//   function resolve(val) {
//     value = val;
//     isFulfilled = true;
//     if (typeof onResolve === "Function" && !isCalled) {
//       onResolve(value);
//       isCalled = true;
//     }
//   }

//   function reject(err) {
//     error = err;
//     isRejected = true;
//     if (typeof onReject === "Function" && !isCalled) {
//       onReject(error);
//       isCalled = true;
//     }
//   }

//   executor(resolve, reject);
// };

// const pro=new myPromise((res,rej)=>{
// //res(3)
// rej("bye")
// })

// pro.then((r)=>console.log(r)).catch((e)=>console.log(e))

//Promise.all

// const p1=new Promise((res,rej)=>{
// setTimeout(()=>res("hi i am resolved"),3000)
// })
// const p2 = new Promise((res, rej) => {
//   setTimeout(() => rej("hi this side dival"), 2000);
// });
// const p3 = new Promise((res, rej) => {
//   setTimeout(() => res("hi i am the fast"), 1000);
// });

//Promise.all([p1,p2,p3]).then((r)=>console.log(r)).catch((e)=>console.log(e))

//wait for all to complete in case of all successes and will return result array in  then block.
//if any one get failed will reject the promise and returns error promise in catch block .

// const p1 = new Promise((res, rej) => {
//   setTimeout(() => rej("hi i am resolved"), 3000);
// });
// const p2 = new Promise((res, rej) => {
//   setTimeout(() => rej("hi this side dival"), 2000);
// });
// const p3 = new Promise((res, rej) => {
//   setTimeout(() => rej("hi i am the fast"), 1000);
// });

// Promise.allSettled([p1,p2,p3]).then((r)=>console.log(r))

// it will return the result array will all the states of the promises

// const p1 = new Promise((res, rej) => {
//   setTimeout(() => rej("hi i am resolved"), 3000);
// });
// const p2 = new Promise((res, rej) => {
//   setTimeout(() => rej("hi this side dival"), 2000);
// });
// const p3 = new Promise((res, rej) => {
//   setTimeout(() => rej("hi i am the fast"), 1000);
// });

//  Promise.race([p1, p2, p3])
//    .then((r) => console.log(r))
//    .catch((err) => console.log("err",err));

// it will return the fastest promise whether its success or failure

//  const p1 = new Promise((res, rej) => {
//   setTimeout(() => rej("hi i am resolved"), 3000);
// });
// const p2 = new Promise((res, rej) => {
//   setTimeout(() => rej("hi this side dival"), 2000);
// });
// const p3 = new Promise((res, rej) => {
//   setTimeout(() => rej("hi i am the fast"), 1000);
// });

// Promise.any([p1,p2,p3]).then((r)=>console.log(r)).catch((err)=>console.log(err))

// if all fails return aggragate error in array
// otherwise return the first return promise success

//!---------------------------------------------------------------- Split Polyfill--------  //----------------------------------------------------------------

// const word = "dival.a.b.c";

// String.prototype.mySplit = function mySplit(char) {
//   let array = [...this],
//     res = [],
//     str = "";
//   for (let i = 0; i < array.length; i++) {

//     if(array[i]===char ||char=="" && str){
//       res.push(str);
//       str=""
//     }
//     if (array[i] !== char) {
//       str = str + array[i];
//     }

//   }

//   if(str){
//     res.push(str)
//     str=""
//   }
//   return res;
// };

// console.log("split", word.split(""));

// console.log("mysplit", word.mySplit(""));

// Array.prototype.groupBy = function (fn) {
//   let obj = {},
//     self = this;
//   for (let i = 0; i <= this.length - 1; i++) {
//     if(obj[fn(this[i])]) {
//         obj[fn(this[i])] = [this[i], ...obj[fn(this[i])]];
//     }else{
//         obj[fn(this[i])] = [this[i]];
//     }

//   }
//     return obj
// };

// const array = [[1,2,3],[1,3,5],[1,5,9]];
// const fn = function (list) {
//   return String(list[0]);
// };

// console.log(array.groupBy(fn));

// function PriorityQueue() {
//   this.collection = [
//     ["kitten", 2],
//     ["dog", 3],
//     ["rabbit", 4],
//   ];
//   this.printCollection = function () {
//     console.log(this.collection);
//   };
//   this.enqueue = function (item) {
//     let index = this.collection.findIndex((elem) => elem[1] > item[1]);
//     if (index !== -1) {
//       this.collection.splice(index, 0, item);
//     } else {
//       this.collection.push(item);
//     }
//   };

//   this.dequeue = function () {
//     return this.collection.shift()[0];
//   };

//   this.size = function () {
//     return this.collection.length;
//   };

//   this.front = function () {
//     return this.collection[0][0];
//   };

//   this.isEmpty = function () {
//     return this.collection.length === 0 ? true : false;
//   };

// }

// const temp = new PriorityQueue();
// temp.enqueue(["bjk", 3]);

// temp.printCollection();

