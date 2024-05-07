function sm(n) {
    let temp = [];
    let count = 0;
    let startR = 0, endR = n - 1, startC = 0, endC = n - 1
    for (let i = 0; i < n; i++) {
        temp[i] = []
    }
    // top right bottom left

    while (startR <= endR && startC <= endC) {
        //top
        for (let j = startC; j <= endC; j++) {
            count++
            temp[startR][j] = count
        }
        startR++

        //right
        for (let j = startR; j <= endR; j++) {
            count++
            temp[j][endC] = count

        }
        endC--

        //bottom
        for (let j = endC; j >= startC; j--) {
            count++
            temp[endR][j] = count
        }
        endR--

        //left
        for (let j = endR; j >= startR; j--) {
            count++
            temp[j][startC] = count

        }
        startC++
    }


    console.log(temp)
}
const m = 4


/*
1 2 3
8 9 4
7 6 5
*/

console.log(sm(m))