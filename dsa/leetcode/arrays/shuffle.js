function shuffle(arr){

for(let i=0;i<arr.length;i++){
  const id=Math.floor(Math.random()*(i+1));
  const temp=arr[i];
  arr[i]=arr[id];
  arr[id]=temp;
  return arr
}

}
const arr=[1,2,3,46,5]
console.log(shuffle(arr));
