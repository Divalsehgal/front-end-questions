import React, { useState } from "react";
import { data } from "./data";
export type TransferListProps = {
  title: string;
  id: number;
  checked: boolean;
};
export const TransferList = () => {
  const [array, setArray] = useState<TransferListProps[]>(data);

  const [array1, setArray1] = useState<TransferListProps[]>([]);

  const leftChecked = array.some((f) => f?.checked);
  const rightChecked = array1.some((f) => f?.checked);

  const selectHandler = (id: number) => {
    return function (e: React.MouseEvent) {
      let target = e.target as HTMLButtonElement;
      if (target.classList.contains("table1") && !rightChecked) {
        const temp = array.map((f) => {
          if (f.id === id) {
            f.checked = !f.checked;
          }
          return f;
        });

        setArray(temp);
      } else if (target.classList.contains("table2") && !leftChecked) {
        const temp = array1.map((f) => {
          if (f.id === id) {
            f.checked = !f.checked;
          }
          return f;
        });

        setArray1(temp);
      }
    };
  };

  const buttonHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;
    const name = target.name;
    if (name === "left" && rightChecked) {
      let selected: TransferListProps[] = [],
        notSelected: TransferListProps[] = [];
      array1.forEach((f) => {
        if (f.checked) {
          f.checked = false;
          selected.push(f);
        } else {
          notSelected.push(f);
        }
      });

      setArray1(notSelected);

      setArray((prev: TransferListProps[]) => [...selected, ...prev]);
    } else if (leftChecked && name === "right") {
      let selected: TransferListProps[] = [],
        notSelected: TransferListProps[] = [];
      array.forEach((f) => {
        if (f.checked) {
          f.checked = false;
          selected.push(f);
        } else {
          notSelected.push(f);
        }
      });

      setArray1((prev) => [...selected, ...prev]);

      setArray(notSelected);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "30px",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "30px",
          flexDirection: "column",
        }}
      >
        <h1>Table 1</h1>
        <div>
          {array.map((m) => {
            return (
              <div
                key={m.id}
                style={{
                  border: "1px solid gray",
                  padding: "10px",
                  backgroundColor: m.checked ? "green" : "",
                }}
                className={"table1"}
                onClick={selectHandler(m.id)}
              >
                {m.title}
              </div>
            );
          })}
        </div>
      </div>

      <button onClick={buttonHandler} disabled={leftChecked} name="left">
        left
      </button>

      <button onClick={buttonHandler} disabled={rightChecked} name="right">
        right
      </button>

      <div
        style={{
          display: "flex",
          gap: "30px",
          flexDirection: "column",
        }}
      >
        <h1>Table 2</h1>
        <div className="table2">
          {" "}
          {array1.map((m) => {
            return (
              <div
                key={m.id}
                style={{
                  border: "1px solid gray",
                  padding: "10px",
                  backgroundColor: m.checked ? "green" : "",
                }}
                className={"table2"}
                onClick={selectHandler(m.id)}
              >
                {m.title}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
