function anagram(str1, str2) {
    str1 = str1.toLowerCase().replaceAll(/\s/g, '');
    const f1 = ffreq(str1)
    const f2 = ffreq(str2)

    if (Object.keys(f1).length !== Object.keys(f2).length) {
        return false
    }
    let temp = Object.keys(f1);
    for (let i = 0; i < temp.length; i++) {

        if (f1[temp[i]] !== f2[temp[i]]) {
            return false
        }

    }
    return true

}

const ffreq = (str1) => {
    let obj = {

    }
    for (let i of str1) {
        if (obj[i]) {
            obj[i] = obj[i] + 1;
        } else {
            obj[i] = 1
        }
    }
    return obj
}
const str1 = "abcd";
const str2 = "dabc";
console.log(anagram(str1, str2))