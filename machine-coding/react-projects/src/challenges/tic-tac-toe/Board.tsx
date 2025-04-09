import React, { useEffect, useState, useRef } from "react";
import "./Board.scss";
import { useFlags } from "../../context/featureFlagProvider";

const createCell = (row, col) => ({
  id: `${row}-${col}`,
  symbol: "",
});

const initialState = () =>
  Array.from({ length: 3 }, (_, row) =>
    Array.from({ length: 3 }, (_, col) => createCell(row, col))
  );

function Board() {
  const [player, setPlayer] = useState({ sign: "", no: 1 });
  const [winner, setWinner] = useState(0);
  const [data, setData] = useState(initialState());

  const features = useFlags();

  const playerSign = useRef({
    1: null,
    2: null,
  });

  const hideRadioButton = !playerSign.current[1] || !playerSign.current[2];

  const clickHandler = (r, c) => {
    if (!player.sign || data[r][c].symbol || winner) return;

    setData((prev) =>
      prev.map((row, rowIndex) =>
        row.map((cell, colIndex) =>
          rowIndex === r && colIndex === c
            ? { ...cell, symbol: player.sign }
            : cell
        )
      )
    );

    setPlayer((prev) => ({
      sign: player.sign === "O" ? "X" : "O",
      no: prev.no === 1 ? 2 : 1,
    }));
  };

  const radioButtonClickHandler = (e) => {
    if (!playerSign.current[1]) {
      playerSign.current[1] = e.target.value;
      playerSign.current[2] = e.target.value === "X" ? "O" : "X";
    }
    setPlayer({ sign: e.target.value, no: 1 });
  };

  const restartGame = () => {
    setData(initialState());
    setWinner(0);
    setPlayer({ sign: "", no: 1 });
  };

  useEffect(() => {
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

    for (let condition of winningConditions) {
      const [a, b, c] = condition;
      const symbolA = data[a[0]][a[1]].symbol;
      const symbolB = data[b[0]][b[1]].symbol;
      const symbolC = data[c[0]][c[1]].symbol;

      if (symbolA && symbolA === symbolB && symbolA === symbolC) {
        console.log(`Winner: ${symbolA}`);

        if (playerSign.current[1] === symbolA) {
          setWinner(1);
        } else {
          setWinner(2);
        }
        return;
      }
    }
  }, [data]);

  console.log("playerSign", playerSign, features);

  return (
    <div>
      <div className="board-container">
        <div className="board-boxes">
          <h3>Choose Your Symbol</h3>
          {hideRadioButton && (
            <fieldset>
              <label>
                <input
                  type="radio"
                  className="radio"
                  checked={player.sign === "X"}
                  value="X"
                  onChange={radioButtonClickHandler}
                />
                X
              </label>
              <label>
                <input
                  type="radio"
                  className="radio"
                  checked={player.sign === "O"}
                  value="O"
                  onChange={radioButtonClickHandler}
                />
              </label>
            </fieldset>
          )}
          <h3>Current Player: {player.no}</h3>
          {winner && <h2>Winner: {winner} 🎉</h2>}
        </div>
        <div className="board-grid">
          {data.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((col, colIndex) => (
                <div
                  key={col.id}
                  className="box"
                  onClick={() => clickHandler(rowIndex, colIndex)}
                >
                  {col.symbol}
                </div>
              ))}
            </div>
          ))}
        </div>
        <button onClick={restartGame}>Restart</button>
      </div>
    </div>
  );
}

export default Board;
