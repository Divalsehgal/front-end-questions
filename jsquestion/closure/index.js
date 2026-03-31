/*

import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return <button onClick={handleClick}>{count}</button>;
}


handleClick remembers count
Even though it runs later (on click)

👉 handleClick is a closure over count
*/



function outer(val) {
    const temp = 9;
    function inner() {
        return temp + val
    }
    return inner
}

console.log(outer(67)())
