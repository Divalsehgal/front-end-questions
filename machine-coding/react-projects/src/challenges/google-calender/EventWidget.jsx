import React from "react";

function EventWidget({ title, startTime, endTime, color, count }) {
  const timeToMinutes = (str) => {
    const [hour, minutes] = str.split(":").map(Number);
    return hour * 60 + minutes;
  };

  return (
    <div
      className="event-widget"
      style={{
        background: color,
        width:"100%",
        top: `${timeToMinutes(startTime)}px`, // Correct top position
        height: `${timeToMinutes(endTime) - timeToMinutes(startTime)}px`, // Dynamic height
        left: `${count * 10}px`, // Offset overlapping events
      }}
    >
      <div>{title}</div>
      <div>
        {startTime} - {endTime}
      </div>
    </div>
  );
}

export default EventWidget;
