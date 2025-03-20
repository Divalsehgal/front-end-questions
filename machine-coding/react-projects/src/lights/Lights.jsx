import React, { useState } from "react";
import "./Lights.scss";
function Lights() {
  const [grid, setGrid] = useState(
    new Array(5).fill(0).map(() => new Array(5).fill(false))
  );

  const clickHandler = (r, c) => {
    setGrid((prev) => {
      return prev.map((row, rid) => {
        return row.map((cell, cid) => {
          return rid === r && c === cid ? true : cell;
        });
      });
    });

    setTimeout(() => {
      setGrid((prev) => {
        return prev.map((row, rid) => {
          return row.map((cell, cid) => {
            return rid === r && c === cid ? false : cell;
          });
        });
      });
    }, 1000);
  };

  const renderCells = () => {
    return grid.map(function (row, rid) {
      return (
        <div className="row">
          {row.map(function (col, cid) {
            return (
              <div
                className={`cell ${col ? "active" : ""}`}
                onClick={() => clickHandler(rid, cid)}
              ></div>
            );
          })}
        </div>
      );
    });
  };
  return <div>{renderCells()}</div>;
}

export default Lights;
