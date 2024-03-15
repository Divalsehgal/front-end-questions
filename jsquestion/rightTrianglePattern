// function pattern(n) {
//     let res = ""
//     for (let i = 1; i <= n; i++) {
//         let temp = ""
        
//         for (let j = 1; j < i; j++) {
//             temp += "#"
//         }
//         temp += "#\n"
//         res += temp
//     }
//     console.log(res)

// }

// const n = 5
// console.log(pattern(n))


function pattern1(n) {
    let res = "";
    for (let i = 1; i <= n; i++) {
        let temp = "";
        for (let k = 1; k <= n - i; k++) {
            temp += " ";
        }
        for (let j = 1; j <= 2 * i - 1; j++) {
            temp += "#";
        }
        temp += "\n";
        res += temp;
    }
    return res;
}

const n = 5;
console.log(pattern1(n));
