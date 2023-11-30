//
// JS Questions 1
// const curry=(func)=>{
//     return function curry(args){

//     }
// }
// console.log(curry(add(12,4)))

// const add = (a, b, c) => {
//   return a + b + c;
// };

// const curry=(func)=>{
//     return function inner(...args){
//         if(args.length>=func.length)  return func(...args)
//             return (...args2)=>  inner(...args,...args2);
//     }
// }

// function curry(fn) {
//   return function curryInner(...args) {
//     console.log(args,fn.length);
//     if (args.length >= fn.length) return fn.apply(this,args);
//      return function(...next) {
//         return curryInner(...args,...next);
//       }
//   };
// }

// const curriedAdd = curry(add);
// console.log(curriedAdd(1)(3)(4));




// JS Questions 1

