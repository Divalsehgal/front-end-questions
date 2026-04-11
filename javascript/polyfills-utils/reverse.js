function reverse(value) {
    const type = Object.prototype.toString.call(value)
    console.log("type",type)
    if (type === "[object String]") {
        let temp = []
        for (let i = value.length - 1; i >= 0; i--) {
            temp += value[i]
        }
        return temp
    }

    if (type === "[object Number]") {

        let tempValue=value,str="";
        let rem ="";
        while (tempValue !=0){
            rem = tempValue % 10;
            tempValue = parseInt(tempValue / 10);
            str+=rem;
        }
        return parseInt(str)

    }
}
const str = "dival";
const num=1342;
console.log(reverse(str))



