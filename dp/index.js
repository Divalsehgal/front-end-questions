// //DATE 17-August-23

// // Dynamic Programming
// const QUESTIONS = ["Fibonacci", "Grid Travserse", "Can Sum"];
// const arrayListElement = document.getElementById("arrayList");

// // Loop through the array and create <li> elements to display each item
// console.log(arrayListElement);
// QUESTIONS.forEach((item) => {
//   const li = document.createElement("li");
//   li.textContent = item;
//   arrayListElement.appendChild(li);
// });
// ----------------------------------------------------------------
//
// /*
// write a fibonnaci function which return the nth number from the series.
// */
// FIBONACCI
// //1, 1, 2, 3, 5, 8, 13, 21

// function fibonnaciFunction(n, memo = {}) {
//   if (n in memo) return memo[n];
//   if (n <= 2) {
//     return 1;
//   }
//   memo[n] = fibonnaciFunction(n - 1, memo) + fibonnaciFunction(n - 2, memo);
//   return memo[n];
// }
// console.log("start fibonnaci function");
// console.log(fibonnaciFunction(50));

// ------------------------------------------------------------------------------------------------
// // GRID
// // always try to calculate and then reduced it to base case
// let point={
//     x:1,y:2
// }
// const grid = (x, y,memo={point}) => {
//   const key=`${x},${y}`;
//   if(key in memo) {
//   return memo[key];
//   }
//   if (x === 1 && y == 1) return 1;
//   if (x === 0 || y == 0) return 0;
//   memo[key]= grid(x, y - 1,memo) + grid(x - 1, y,memo);
//   return memo[key]
// };

// console.log(grid(2, 3));

// console.log(grid(40, 10));

// ------------------------------------------------------------------------------------------------
// CANSUM
// function canSum(targetSum, array, memo = {}) {
//   if (targetSum in memo) return memo[targetSum];
//   if (targetSum === 0) return true;
//   if (targetSum < 0) return false;
//   for (let i = 0; i < array.length; i++) {
//     const rem = targetSum - array[i];
//     if (canSum(rem, array, memo) === true) {
//       memo[targetSum] = true;
//       return true;
//     }
//   }
//   memo[targetSum] = false;
//   return false;
// }

// console.log(canSum(7, [2, 4, 2]));

// ------------------------------------------------------------------------------------------------
//HOWSUM

// const howSum = (targetSum, array, memo = {}) => {
//   if (targetSum in memo) return memo[targetSum];
//   if (targetSum === 0) return [];
//   if (targetSum < 0) return null;
//   for (let i = 0; i < array.length; i++) {
//     const rem = targetSum - array[i];
//     const res = howSum(rem, array, memo);
//     if (res !== null) {
//       //  !res.includes(array[i]) this addition will it make it unique.
//       memo[targetSum] = [...res, array[i]];

//       return memo[targetSum];
//     }
//   }
//   memo[targetSum] = null;

//   return memo[targetSum];
// };

// console.log(howSum(8, [5, 3, 7, 1]));

//BESTSUM
//--- =------------------------------------------------------------------------------ ----------------- --------------------------------
// const bestSum = (targetSum, array, memo = {}) => {
//   let shortestNodes = null;
//   if (targetSum in memo) return memo[targetSum];
//   if (targetSum === 0) return [];
//   if (targetSum < 0) return null;
//   for (let i = 0; i < array.length; i++) {
//     const rem = targetSum - array[i];
//     const res = bestSum(rem, array, memo);
//     if (res !== null) {
//       //  !res.includes(array[i]) this addition will it make it unique.
//       const combination = [...res, array[i]];
//       // if the current combination is shortest with the current then need to update
//       if (shortestNodes === null || combination.length < shortestNodes.length) {
//         shortestNodes = combination;
//       }
//     }
//   }
//   memo[targetSum] = shortestNodes;
//   return memo[targetSum];
// };

// console.log(bestSum(8, [5, 3, 7, 1]));

//!----------------------------------------------------------------!----------------------------------------------------------

//CAN TARGET SUM

// function canTargetSum(target, wordBank,memo={}) {
//   if (target in memo) return memo[target];
//   if (target === "") return true;
//   for (let word of wordBank) {
//     if (target.indexOf(word) === 0) {
//       const remaining = target.slice(word.length);
//        memo[target]=true
//       if (canTargetSum(remaining, wordBank,memo) === true) {
//         return true;
//       }
//     }
//   }
//    memo[target]=false
//   return false;
// }

// console.log(canTargetSum("abcdef", ["ab", "abc", "cd", "def", "abcd"]));

// console.log(canTargetSum("skateboard", ["bo", "rd", "ate", "t", "ska","sk","boar"]));

//!----------------------------------------------------------------!----------------------------------------------------------

//ALL TARGET SUM----------------------------------------------------------------

// function AllTargetSum(target,wordBank,memo={}) {
//   let res=[]
//   if(target in memo) return memo[target]
//   if(target === "") return [[]];
//   for(let word of wordBank) {
//     if(target.indexOf(word) === 0){
//       const newTarget=target.slice(word.length);
//       const result=AllTargetSum(newTarget,wordBank,memo)
//       const temp=result?.map(f=>[...f,word])
//       res.push(...temp)
//     }
//   }
//   memo[target]=res
//   return res

// }

//console.log(AllTargetSum("abcdef", ["ab", "abc", "cd", "def", "abcd"]));

//console.log(AllTargetSum("purple", ["purp", "p", "ur", "le", "purpl"]));

//!----------------------------------------------------------------!----------------------------------------------------------

// COUNT TARGET SUM

// function countTargetSum(target, wordBank,memo={}) {
//   let count = 0;
//   if(target in memo) return memo[target];
//   if (target === "") return 1;
//   for (let word of wordBank) {
//     if (target.indexOf(word) === 0) {
//       const newTarget = target.slice(word.length);
//       const result= countTargetSum(newTarget, wordBank,memo);
//       count += result;
//     }
//   }
//   memo[target] = count;
//   return count;
// }

// console.log(countTargetSum("abcdef", ["ab", "abc", "cd", "def", "abcd"]));

//!----------------------------------------------------------------!----------------------------------------------------------


// Get references to the sidebar, sidebar width display, and resize icon elements
const sidebar = document.getElementById('sidebar');
const resizeIcon = document.getElementById('resizeIcon');

// Variables to keep track of the drag state
let isDragging = false;
let startX = 0;
let startWidth = 0;

// Function to update the sidebar width
function updateSidebarWidth(newWidth) {
    sidebar.style.width = `${newWidth}px`;
}

// Mouse move event listener for showing the resize icon and dragging
document.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX;
    const sidebarRightEdge = sidebar.getBoundingClientRect().right;

    if (Math.abs(mouseX - sidebarRightEdge) < 10) {
        resizeIcon.style.display = 'block';
    } else {
        resizeIcon.style.display = 'none';
    }

    if (!isDragging) return;

    const dragX = mouseX - startX;
    updateSidebarWidth(startWidth + dragX);
});

// Mouse up event listener to stop dragging
document.addEventListener('mouseup', () => {
    isDragging = false;
    resizeIcon.style.display = 'none';
});

// Mouse down event listener for starting the drag
resizeIcon.addEventListener('mousedown', (event) => {
    isDragging = true;
    startX = event.clientX;
    startWidth = parseFloat(getComputedStyle(sidebar).width);
});

// Button click event listener
const resizeButton = document.getElementById('resizeButton');

resizeButton.addEventListener('click', () => {
    updateSidebarWidth(100); // Adjust width as needed
});
