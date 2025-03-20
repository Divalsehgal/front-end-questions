import React from "react";
import { ConflictingData, generateTimeData, NonConflictingData } from "./Data";
import "./Calender.scss";
import EventWidget from "./EventWidget";
import dayjs from "dayjs";

import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat); // Enable custom parsing

const convertTo12HourFormat = (time) => {
  return dayjs(time, "H:mm").format("h:mmA"); //
};
function Calender() {
  const timeData = generateTimeData();
  console.log(ConflictingData);
  return (
    <div className="calender-container">
      <div className="time">
        {timeData.map((timeD) => {
          const { id, time } = timeD;
          return (
            <div key={id} className="time-item">
              {time}
                <div className="block"/>
            </div>
          );
        })}
      </div>
      <hr />

      <div className="events">
        {ConflictingData.map((nd) => {
         
          const sTime = convertTo12HourFormat(nd.startTime);
          const eTime = convertTo12HourFormat(nd.endTime);
          console.log(sTime, eTime);
          return (
            <EventWidget key={nd.startTime} {...nd} sTime={sTime} eTime={eTime} />
          );
        })}
      </div>
    </div>
  );
}

export default Calender;
