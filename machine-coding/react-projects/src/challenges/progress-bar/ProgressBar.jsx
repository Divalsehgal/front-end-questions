import React, { useState, useId } from "react";
import "./ProgressBar.scss";
import { useEffect } from "react";
function ProgressBar() {
  const [progressArray, setProgressArray] = useState([]);
  const id = useId();

  const clickHandler = () => {
    const newItem = { id: id, value: `bar1${Math.round(id)}` };
    setProgressArray((prev) => [...prev, newItem]);
  };

  // remove the completed progress bar
  const onComplete = (id) => {
    setProgressArray((prev) => {
      return prev.filter((item) => item.id !== id);
    });
  };

  return (
    <div className="progress-bar-container">
      <div className="bar">
        {progressArray.map((progress) => {
          return (
            <ProgressBarItem
              {...progress}
              key={progress.id}
              onComplete={onComplete}
            />
          );
        })}
      </div>
      <button onClick={clickHandler}>start</button>
    </div>
  );
}

const ProgressBarItem = ({ id, onComplete }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWidth((prev) => {
        if (prev < 100) {
          return prev + 20;
        } else {
          onComplete(id);
          return 100;
        }
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [id]);

  return (
    <div className="progress">
      <div
        className="inner"
        style={{
          width: `${width}%`,
        }}
      ></div>
    </div>
  );
};
export default ProgressBar;
