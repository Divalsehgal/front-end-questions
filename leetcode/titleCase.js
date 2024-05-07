function titleCase(str){
const temp=str.split(" ");
let res=""
    for (let i = 0; i < temp.length;i++){
        let first = [...temp[i]].splice(0,1)[0].toUpperCase();
        let second = [...temp[i]].splice(1).join("");

        res+=first+second+" ";
}
return res

}

const str="my name is dival sehgal"

console.log(titleCase(str))