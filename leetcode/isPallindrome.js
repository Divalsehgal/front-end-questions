const isPalindrome = (string = "") => {
  if (string == "") return false;
  const validCharacters = string.split("");
  const stringCharacters = string.toLowerCase().split("");
let result="";

stringCharacters.reduce(
  (characters, character) =>
    validCharacters.indexOf(character) > -1
      ? characters.concat(character)
      : characters,
  []
);
  return stringCharacters.join("") === stringCharacters.reverse().join("");
};

console.log(isPalindrome("bob"));
