import React, { useState } from "react";
import "./Board.scss";

const snakes = {
  16: 6,
  47: 26,
};

const ladders = {
  4: 14,
  9: 31,
};

function SnakeLadderBoard() {
  const [playerPositions, setPlayerPositions] = useState([0, 0]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [message, setMessage] = useState("");

  const rollDice = () => {
    const roll = Math.ceil(Math.random() * 6);
    let newPos = playerPositions[currentPlayer] + roll;

    if (newPos > 100) {
      newPos = playerPositions[currentPlayer]; // can't move
    } else if (snakes[newPos]) {
      setMessage(
        `🐍 Player ${currentPlayer + 1} got bitten! Falls to ${snakes[newPos]}`
      );
      newPos = snakes[newPos];
    } else if (ladders[newPos]) {
      setMessage(
        `🪜 Player ${currentPlayer + 1} climbs to ${ladders[newPos]}!`
      );
      newPos = ladders[newPos];
    } else {
      setMessage(`🎲 Player ${currentPlayer + 1} rolled a ${roll}`);
    }

    const newPositions = [...playerPositions];
    newPositions[currentPlayer] = newPos;
    setPlayerPositions(newPositions);

    if (newPos === 100) {
      setMessage(`🏆 Player ${currentPlayer + 1} wins!`);
    } else {
      setCurrentPlayer((currentPlayer + 1) % 2);
    }
  };

  const renderBoard = () => {
    return Array.from({ length: 10 }, (_, rowIndex) => {
      const row = 9 - rowIndex;

      return (
        <div className="row" key={row}>
          {Array.from({ length: 10 }, (_, colIndex) => {
            const col = row % 2 === 0 ? colIndex : 9 - colIndex;
            const number = row * 10 + col;
            const isSnake = snakes[number];
            const isLadder = ladders[number];
            const playersOnCell = playerPositions
              .map((pos, i) => (pos === number ? `P${i + 1}` : null))
              .filter(Boolean)
              .join(", ");
            const snakeIcon = isSnake && `🐍→${isSnake}`;
            const ladderIcon = isLadder && `🪜→${isLadder}`;
            const note = snakeIcon || ladderIcon;

            let cellClass = "cell";

            if (isSnake) {
              cellClass += " snake";
            } else if (isLadder) {
              cellClass += " ladder";
            }

            return (
              <div className={cellClass} key={number}>
                {number}&nbsp;
                <div className="note">{note}</div>
                <div className="num">{number}</div>
                <div className="player">{playersOnCell}</div>
              </div>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className="game-container">
      <h1>🎲 Snake and Ladder</h1>
      <div className="board">{renderBoard()}</div>
      <div className="controls">
        <button onClick={rollDice}>
          Roll Dice (Player {currentPlayer + 1})
        </button>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default SnakeLadderBoard;
