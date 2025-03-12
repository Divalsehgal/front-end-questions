import React, { useState } from "react";
import "./ProgressBar.scss";
import { useEffect } from "react";
function ProgressBar() {
  const [progressArray, setProgressArray] = useState([]);

  const clickHandler = () => {
    const newItem = { id: Date.now(), value: `bar1${Math.round(Date.now())}` };
    setProgressArray((prev) => [...prev, newItem]);
  };

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
        if (prev < 300) {
          return prev + 30;
        } else {
          onComplete(id);
          return 300;
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
          width: width,
        }}
      ></div>
    </div>
  );
};
export default ProgressBar;
