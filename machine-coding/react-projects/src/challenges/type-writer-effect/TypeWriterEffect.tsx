import React, { useEffect, useState } from "react";
import { staticCode } from "./sampleCode";
export default function TypeWriterEffect() {
  const [pdata, setPdata] = useState("please start generating...");
  const [start, setStart] = useState(false);
  let timer: ReturnType<typeof setTimeout>;
  const clickHandler = () => {
    setStart(true);
  };

  const generating = () => {
    let count = 0;
    timer = setInterval(() => {
      count++;
      if (count === staticCode.length - 1) {
        clearInterval(timer);
      }

      setPdata((i) => i + staticCode[count]);
    }, 50);
  };

  useEffect(() => {
    if (start) {
      generating();
    }

    return () => {
      clearInterval(timer);
    };
  }, [start]);

  const resetHandler = () => {
    clearInterval(timer);
    setStart(false);
    setPdata("please start generating...");
  };
  

  return (
    <div className="text-tertiary-light dark:text-tertiary-dark">
      <button onClick={resetHandler}>reset</button>
      <button onClick={clickHandler}>start generating</button>

      <div className="h-96 w-full border  bg-primary-light dark:bg-primary-dark">
        {pdata}
      </div>
    </div>
  );
}
