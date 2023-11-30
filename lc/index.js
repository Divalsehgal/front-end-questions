//VALID PARETHESES
// var isValid = function (s) {
//   let ctomap = {
//     "]": "[",
//     "}": "{",
//     ")": "(",
//   };

//   let stack = [];

//   for (let i of s) {
//     if (i in ctomap) {
//       if (stack.length !== 0 && stack[stack.length - 1] === ctomap[i]) {
//         stack.pop();
//       } else {
//         return false;
//       }
//     } else {
//       stack.push(i);
//     }
//     console.log(stack);
//   }

//   if (stack.length === 0) {
//     return true;
//   }else{
//     return false
//   }
// };
// console.log(isValid("["));

// var minimumDifference = function (nums, k) {
//   let arr = nums.sort((a,b)=>a-b),
//     diff = Infinity,
//     temp = 0,
//     l = 0,
//     r = k - 1;
//     console.log(arr)
//   while (l < arr.length || r < arr.length) {
//     temp = 0;
//     temp = arr[r] - arr[l];
//     console.log(arr[r], arr[l]);
//     if (temp < diff) {
//       diff = temp;
//     }
//     l++;
//     r++;
//   }
//   return diff
// };

// console.log(minimumDifference([87063,61094,44530,21297,95857,93551,9918], 6));

// function shuffle(arr){

// for(let i=0;i<arr.length;i++){
//   const id=Math.floor(Math.random()*(i+1));
//   const temp=arr[i];
//   arr[i]=arr[id];
//   arr[id]=temp;
//   return arr
// }

// }
// const arr=[1,2,3,46,5]
// console.log(shuffle(arr));

// var longestCommonPrefix = function (strs) {
// for(let i=0;i<strs.length;i++){
//   for(let j=0;j<strs[i].length;j++){
//     if(j[i].length==j) return
//     console.log(strs[i][j])
//   }
// }
// };

// console.log(longestCommonPrefix(["ab", "a"]));

// var groupAnagrams = function (strs) {
//   let temp = [],
//     temp1 = {};
//   for (let i = 0; i < strs.length; i++) {
//     let word = [strs[i].split("").sort().join("")];
//     console.log([strs[i]]);
//     if (!temp1[word]) {
//       temp1[word] = [strs[i]];
//     } else {
//       temp1[word] = temp1[word].concat([strs[i]]);
//     }
//   }

//   console.log(temp1);
// };

// console.log(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]));

// var containsNearbyDuplicate = function (nums, k) {
//   let obj = {};

//   for (let i = 0; i < nums.length; i++) {
//     if (!obj[nums[i]]) {
//       obj[nums[i]] = [i];
//     } else {
//       obj[nums[i]] = obj[nums[i]].concat([i]);
//     }
//   }

//   for (let [index, item] of Object.entries(obj)) {
//     console.log(index, item);
//     if (item.length > 1) {
//       if (item.length > 2) {
//         for (let i = 0; i < item.length; i++) {
//           if (Math.abs(item[i] - item[i + 1]) <= k) {
//             return true;
//           }
//         }
//       } else {
//         if (Math.abs(item[0] - item[1]) <= k) {
//           return true;
//         }
//       }
//     }
//   }
//   return false;
// };

//var containsNearbyDuplicate = function (nums, k) {
//   let set = new Set();

//   for (let i = 0; i < nums.length; i++) {
//     if (set.has(nums[i])) {
//       return true;
//     } else {
//       set.add(nums[i]);
//       if (set.size > k) return set.delete(nums[i-k]);
//     }
//   }
//   return false
// };

//   let obj = {};
//   for (let idx = 0; idx < nums.length; idx++) {
//     if (obj[nums[idx]] !== undefined && ((idx - obj[nums[idx]]) <= k)) {
//       return true;
//     }

//     obj[nums[idx]] = idx;
//   }

//   return false;
// };

// console.log(containsNearbyDuplicate([1, 2, 3, 1, 2, 3], 2));
// var maxProfit = function (prices) {
//   let i = 0,
//     maxProfit = 0;
//   let j = 1;
//   while (j <= prices.length - 1) {
//     if (prices[j] > prices[i]) {
//       let profit = prices[j] - prices[i];
//       maxProfit = Math.max(profit, maxProfit);
//     } else {
//       i = j;
//     }
//     j++;
//   }
//   return maxProfit;
// };

// console.log(maxProfit([2, 1, 4]));

// var moveZeroes = function (nums) {
//   function swap(a, b, prices) {
//     let temp;
//     temp = prices[a];
//     prices[a] = prices[b];
//     prices[b] = temp;
//   }
//   let i = 0,
//     j = 0;
//   while (j < nums.length) {
//     if (nums[i] === 0) {
//       swap(i, j, nums);
//       j++;
//     } else {
//       i++;
//     }
//   }
// };

//console.log(moveZeroes([2, 1, 4,0]));

// var removeDuplicates = function (nums) {
//   if (nums.length === 0) {
//     return 0;
//   }

//   let k = 2
//   for (let i = 2; i < nums.length; i++) {

//     if (nums[i] !== nums[k - 2] ) {
//       nums[k] = nums[i];
//       k++;
//     }
//   }

//   return k;
// };

// const arr = [0, 0,0, 1, 1, 1, 2, 2, 3, 3, 4];
// console.log(removeDuplicates(arr));
// console.log(arr)

// 0 0 1 1 2 2 3 3

//var maxArea = function (height) {
//   let max = 0;
//   for (let i = 0; i < height.length; i++) {
//     for (let j = i + 1; j < height.length; j++) {
//       let area = Math.min(height[j], height[i]) * (j - i);
//       max = Math.max(area, max);
//     }
//   }
//   return max;

//   let max = 0,
//     l = 0;
//   r = height.length - 1;
//   while (l < r) {
//     let area = Math.min(height[l], height[r]) * (l - r);
//     max = Math.max(area, max);
//     if (height[l] < height[r]) {
//       l++;
//     }else{
//         r--
//     }

//   }
//   return max
// };
// const arr = [0, 2];

// console.log(maxArea(arr));

// var gcdOfStrings = function (str1, str2) {
//  let [len1, len2] = [str1.length, str2.length];

//  function isDivisor(l) {
//    if (len1 % l || len2 % l) {
//     console.log(l)
//      return false;
//    }

//    let [f1, f2] = [Math.floor(len1 / l), Math.floor(len2 / l)];
//   //console.log(f1, f2);
//    return (
//      str1.slice(0, l).repeat(f1) == str1 && str2.slice(0, l).repeat(f2) == str2
//    );
//  }

//  for (let l = Math.min(len1, len2); l > 0; l--) {
//    if (isDivisor(l)) {
//      return str1.slice(0, l);
//    }
//  }

//  return "";
// };

// console.log(gcdOfStrings("ABABAB", "ABAB"));

//  function isDivisor(len1,len2) {
//   const l=Math.min(len1,len2);
//    if (len1 % l || len2 % l) {
//      return false;
//    }
//    return true
//   }

//   console.log(isDivisor(3,3));

// 100 101 102 103
// 1 2 3 4 5

// var threeSum = function(nums) {
//     let res=[]
//  if(nums.length<3){
//   return res
//  }

//  for(let i=1;i<nums.length;i++){
//  for (let j = 1; j < nums.length; j++) {
//     let a=nums[i-1][j-1],b=nums[i][j],c=nums[i+1][j+1];
// if(a+b+c ===0 ){

// res.push([a,b,c])

//    }else{
//     continue
//    }

//  }

//  }
//   return res;

// }

// const arr=[-1,0,1,2,-1,-4];

// console.log(threeSum(arr))

// function rotate(arr,k){
//  arr=[ ...arr.splice(k-1, arr.length - 1),...arr.splice(0, k-1) ];
//  return arr
// }

// const arr=[0, 1, 2, 4, 5, 6, 7];
// console.log(rotate(arr,4));

// var createCounter = function (init) {
//   let no = init;
//   this.increment = function increment() {
//     return (no += 1);
//   };

//   this.decrement = function decrement() {
//     return (no -= 1);
//   };

//   this.reset = function reset() {
//     return (no = init);
//   };

//   return this;
// };

// const counter = createCounter(5);
// console.log(counter.increment()); // 6
// console.log(counter.reset()); // 5
// console.log(counter.decrement()); // 4
// console.log(counter.reset()); // 5

// var removeElement = function (nums, val) {
//   let left = 0;
//   let right = nums.length - 1;

//   while (left <= right) {
//     if (nums[left] === val) {
//       nums[left] = nums[right];
//       right--;
//     } else {
//       left++;
//     }
//   }

//   return left;
// };
// const nums = [3, 2, 2, 3], val = 3;

// console.log(removeElement(nums,val),nums);

//const threeSum = (nums) => {

// obj[[nums[i],nums[l],nums[r]]]=[nums[i],nums[l],nums[r]];
// l++;
// r--;
// }else if(nums[i]+nums[l]+nums[r]>0){
// r--;
// }else if(nums[i]+nums[l]+nums[r]<0){
// l++;
// }
// }

// }
// return  (Object.values(obj))

//-4 -1 -1 0 1 2
//   let obj = {};
//   nums.sort((a, b) => a - b);

//   for (let i = 0; i < nums.length; i++) {
//     let l = i + 1;
//     let r = nums.length - 1;
//     while (l < r) {
//       if (nums[i] + nums[l] + nums[r] === 0) {
//         obj[(nums[i], nums[l], nums[r])] = [nums[i], nums[l], nums[r]];
//         l++;
//         r--;
//       } else if (nums[i] + nums[l] + nums[r] > 0) {
//         r--;
//       } else if (nums[i] + nums[l] + nums[r] < 0) {
//         l++;
//       }
//     }
//   }
//   return Object.values(obj);
// };

// var nextGreaterElement = function (nums1, nums2) {
//   let temp = [];
//   for (let i = 0; i < nums1.length; i++) {
//     const index = nums2.indexOf(nums1[i]);
//     let max = nums2[index];
//     console.log("index", index);

//     if (nums2[index + 1]) {
//       for (let j = index + 1; j < nums2.length; j++) {
//         max = Math.max(max, nums2[j]);
//         if(max > nums2[index]){
//           break;
//         }
//       }
//       if (max === nums2[index]) {
//         temp.push(-1);
//       } else {
//         temp.push(max);
//       }
//     } else {
//       temp.push(-1);
//       continue;
//     }
//   }
//   return temp;
// };

// var nextGreaterElement = function (nums1, nums2) {
//   const stack = [];
//   const map = new Map();

//   for (let num of nums2) {
//     while (stack.length > 0 && num > stack[stack.length - 1]) {
//       map.set(stack.pop(), num);
//     }
//     stack.push(num);
//   }

//   while (stack.length > 0) {
//     map.set(stack.pop(), -1);
//   }

//   const result = nums1.map((num) => map.get(num));
//   return result;
// };

// const nums1 = [4, 1, 2],
//   nums2 = [1, 3, 4, 2];

// console.log(nextGreaterElement(nums1, nums2));

// var pivotIndex = function (nums) {
//   let i = 0,
//     j = nums.length - 1,
//     s1 = 0;
//    const sum= nums.reduce((acc,d)=>acc+d,0);
//    const mid=Math.ceil(sum/2);
//    while(s1!==mid){
//     s1+=nums[i];
//     i++
//    }
//    console.log(i)
// };

// const nums = [-1, -1, -1, -1, -1, 0];
// console.log(pivotIndex(nums));

/*
1 6 if true 
1 + 7 = 8 , 6  false
1 + 7 = 8 , 6 + 5 = 11 true
1 + 7 + 3 = 11 , 6 + 5 == true 



*/

  var twoSum = function (numbers, target) {
    // for (let i = 0; i < numbers.length ; i++) {
    //   const rem = target - numbers[i];
    //   for (let j = i +1; j < numbers.length ; j++) {
    //     if (numbers[j] === rem) {
    //       return [i+1, j+1];
    //     }
    //   }
    // }
    // return [-1,-1]
  


    
}
const nums = [3, 2, 4],
  target = 6;
console.log(twoSum(nums, target));
