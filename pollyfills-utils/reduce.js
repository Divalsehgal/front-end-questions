// Array.prototype.myReduce=function myReduce(a,b){

//     let temp=b;
//     for(let i=0;i<this.length;i++){
//        if(temp){
//         temp=a.call(null, temp, this[i]);
//        }else{
//         temp=this[i]
//        }
//     }
//     return temp

// }

const arr = [1, 2, 3, 3, 5]

function sum(a, b) {
    return a + b
}
// console.log(arr.myReduce(sum, 0));

// console.log(arr.reduce(sum,0));



Array.prototype.myReduce = function (a, b) {


    let temp = b;
    for (let i = 0; i < this.length; i++) {
        if (temp) {
            temp = a.call(this, temp, this[i])
        } else {
            temp = this[i]
        }



    }
    return temp

}


console.log(arr.myReduce(sum, 0));