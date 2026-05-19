function paintDiagonal(p, q) {

    document.querySelectorAll(`.box`).forEach((b) => {
        b.style.backgroundColor = ''
    })

    function color(i, j) {
        const cur = document.querySelector(`[data-key="${i}-${j}"]`)
        if (cur) cur.style.backgroundColor = 'red';
    }

    color(p, q)


    let i = p + 1, j = q + 1;

    while (i < 8 && j < 8) {
        color(i, j);
        i++; j++;
    }

    i = p + 1, j = q - 1;

    while (i <= 8 && j > 0) {
        color(i, j);
        i++; j--;
    }

    i = p - 1, j = q - 1;

    while (i >= 0 && j >= 0) {
        color(i, j);
        i--; j--;
    }


    i = p - 1, j = q + 1;

    while (i >= 0 && j < 8) {
        color(i, j);
        i--; j++;
    }


    /*

0 <= i ,j <= 8

    i+1,j-1
    i-1,j-1   0 0 
    i+1,j+1  
    i-1,j+1

    */



}
let board;

function createBoard() {
    board = document.createElement('div');
    board.classList.add('board')
    for (let i = 0; i < 8; i++) {
        const row = document.createElement('div');
        row.classList.add('row')
        row.setAttribute("data-row", `${i}`)
        for (let j = 0; j < 8; j++) {
            const check = (i + j) % 2 === 0 ? 'white' : 'black';
            const box = document.createElement('div');
            box.classList.add('box', check)
            box.setAttribute("data-box", `${j}`)
            box.setAttribute("data-key", `${i}-${j}`)
            box.addEventListener('click', () => paintDiagonal(i, j))
            row.appendChild(box)
        }
        board.appendChild(row)

    }
}
createBoard()
const parent = document.querySelector('#root')
parent.append(board)