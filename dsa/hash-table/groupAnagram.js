const arr1 = [
  "cat",
  "dog",
  "act",
  "actt",
  "god",
  "fish",
  "shif",
  "a",
  "a",
  "bfcd",
];

let temp = "";
let temp2 = {};
for (let i = 0; i < arr1.length; i++) {
  temp = [...arr1[i]].sort((a, b) => (a > b ? 1 : -1)).join("");

  if (temp2[temp]) {
    temp2[temp].push(arr1[i]);
  } else {
    temp2[temp] = [arr1[i]];
  }
}

console.log(temp2)

/*

Solution :
{
0: ["cat","act"],
1: ["dog","god"],
2: ["fish","shif],
3: ["a","a]
}

*/

function groupAnagrams(words) {
  const anagramGroups = {};

  for (const word of words) {
    const sortedWord = word.split("").sort().join("");
    if (!anagramGroups[sortedWord]) {
      anagramGroups[sortedWord] = [word];
    } else {
      anagramGroups[sortedWord].push(word);
    }
  }

  const result = Object.values(anagramGroups);

  return result;
}

const words = ["eat", "tea", "tan", "ate", "nat", "bat"];
const anagramGroups = groupAnagrams(words);
console.log(anagramGroups);
