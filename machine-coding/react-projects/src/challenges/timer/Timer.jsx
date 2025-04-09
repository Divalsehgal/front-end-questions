import React, { useState } from "react";
import "./Timer.scss";
import { useEffect } from "react";
import { useRef } from "react";
function Timer() {
  const [time, setTime] = useState({ hour: 2, minute: 2, second: 5 });
  const [isStart, setIsStart] = useState(false);
  const intervalRef=useRef(0);
  const startHandler = () => {
    setIsStart(!isStart);
  };

  useEffect(() => {
    if (isStart) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          let totalTime = prev.hour * 3600 + prev.minute * 60 + prev.second;
          totalTime--;
          const nhour = Math.floor(totalTime / 3600);
          const nmin = Math.floor((totalTime % 3600) / 60);
          const nsec = Math.floor(totalTime % 60);
          return {
            hour: nhour,
            minute: nmin,
            second: nsec,
          };
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isStart]);

  return (
    <div className="timer-container">
      <button onClick={startHandler}>{!isStart ? "Start" : "Pause"}</button>
      <div className="time">
        <div className="hour">{time.hour}:</div>
        <div className="minute">{time.minute}:</div>
        <div className="second">{time.second}</div>
      </div>
    </div>
  );
}

export default Timer;
