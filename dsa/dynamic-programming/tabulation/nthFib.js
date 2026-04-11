const fib=(n)=>{
let temp=[];
for(let i=0; i<=n; i++){
  if(i==0 || i==1){
    temp.push(i)
  }else{
    temp[i]=temp[i-1]+temp[i-2]
  }
}
return temp[n]
}

console.log(fib(6));
