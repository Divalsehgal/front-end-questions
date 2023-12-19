function AllTargetSum(target,wordBank,memo={}) {
  let res=[]
  if(target in memo) return memo[target]
  if(target === "") return [[]];
  for(let word of wordBank) {
    if(target.indexOf(word) === 0){
      const newTarget=target.slice(word.length);
      const result=AllTargetSum(newTarget,wordBank,memo)
      const temp=result?.map(f=>[...f,word])
      res.push(...temp)
    }
  }
  memo[target]=res
  return res

}

console.log(AllTargetSum("abcdef", ["ab", "abc", "cd", "def", "abcd"]));

console.log(AllTargetSum("purple", ["purp", "p", "ur", "le", "purpl"]));



