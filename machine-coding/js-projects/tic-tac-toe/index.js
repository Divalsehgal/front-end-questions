
const length = 3;

const winningConditions = [
    [
        [0, 0],
        [0, 1],
        [0, 2],
    ], // Rows
    [
        [1, 0],
        [1, 1],
        [1, 2],
    ],
    [
        [2, 0],
        [2, 1],
        [2, 2],
    ],
    [
        [0, 0],
        [1, 0],
        [2, 0],
    ], // Columns
    [
        [0, 1],
        [1, 1],
        [2, 1],
    ],
    [
        [0, 2],
        [1, 2],
        [2, 2],
    ],
    [
        [0, 0],
        [1, 1],
        [2, 2],
    ], // Diagonals
    [
        [0, 2],
        [1, 1],
        [2, 0],
    ],
];
const createCell = (row, col) => {
    return {
        key: `${row}-${col}`,
        value: '',
    };
};

let player = { sign: '', no: 1 }

const board = document.querySelector('.board');
const radio1 = document.querySelector('.radio1');
const radio2 = document.querySelector('.radio2');

radio1.addEventListener('click', function () {
    radio1.checked = true;
    radio2.checked = false;
    player.sign = 'X'
    console.log('Player sign set to:', player.sign);
});

radio2.addEventListener('click', function () {
    radio2.checked = true;
    radio1.checked = false;
    player.sign = 'O'
    console.log('Player sign set to:', player.sign);
});

function checkWinner() {
    for (const condition of winningConditions) {
        const [a, b, c] = condition;

        const valA = arrayB[a[0]][a[1]].value;
        const valB = arrayB[b[0]][b[1]].value;
        const valC = arrayB[c[0]][c[1]].value;

        if (valA && valA === valB && valB === valC) {
            alert(`Player ${valA} wins!`);
            return true;
        }
    }

    // Optional: Check for draw
    const allFilled = arrayB.flat().every(cell => cell.value !== '');
    if (allFilled) {
        alert("It's a draw!");
        return true;
    }

    return false;
}


let arrayB = Array.from({ length: length }, (_, Rindex) =>
    Array.from({ length: length }, (_, Cindex) => createCell(Rindex, Cindex))
);

function changePlayer() {
    if (player.sign === 'O') {
        player.sign = 'X';
        if (player.no === 2) {
            player.no = 1
        }
        radio2.checked = true;
        radio1.checked = false;
    } else {
        player.sign = 'O';
        if (player.no === 1) {
            player.no = 2
        }

        radio1.checked = true;
        radio2.checked = false;
    }


    console.log('Player sign changed to:', player);
}

function addSign(i, j) {
    if (player.sign) {
        arrayB = arrayB.map((row, rindex) => {
            return row.map((col, cindex) => {
                if (rindex === i && cindex === j && !col.val) {
                    return { ...col, value: player.sign }
                } else {
                    return col
                }
            })
        })



        renderBoard()
        if (!checkWinner()) {
            changePlayer()
        }
    }

}


function renderBoard() {
    board.innerHTML = ''
    arrayB.forEach((row, i) => {
        let divRow = document.createElement('div');
        divRow.setAttribute('class', 'row');

        row.forEach((col, j) => {
            let divCol = document.createElement('div');
            divCol.setAttribute('class', 'col');
            divCol.setAttribute('key', `${i}-${j}`);
            divCol.addEventListener('click', () => addSign(i, j))
            divCol.textContent = col.value;
            divRow.appendChild(divCol);
        })
        board.appendChild(divRow);
    })

}


renderBoard()