import  React from "react";

import "./style.css";
import { TransferList } from "./TransferList";

export default function TransferBox() {
  return (
    <div className="text-teritary-light dark:text-tertiary-dark">
      <div className="container">
        <h1 className="text-xl font-bold">Transfer List</h1>
        <TransferList />
      </div>
    </div>
  );
}
