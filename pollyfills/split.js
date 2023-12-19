const word = "dival.a.b.c";

String.prototype.mySplit = function mySplit(char) {
  let array = [...this],
    res = [],
    str = "";
  for (let i = 0; i < array.length; i++) {

    if(array[i]===char ||char=="" && str){
      res.push(str);
      str=""
    }
    if (array[i] !== char) {
      str = str + array[i];
    }

  }

  if(str){
    res.push(str)
    str=""
  }
  return res;
};

console.log("split", word.split(""));

console.log("mysplit", word.mySplit(""));
