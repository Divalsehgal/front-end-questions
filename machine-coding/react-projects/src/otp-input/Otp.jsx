import React, { useEffect, useState, useRef } from "react";

function Otp({ length = 4 }) {
  const [otp, setOtp] = useState(Array(length).fill(""));

  const inputRef = useRef(Array(length).fill(""));

  useEffect(() => {
    inputRef.current[0].focus();
  }, []);

  const handleTextChange = (e, index) => {
    const input = e.target.value;
    const newOTP = [...otp];
    newOTP[index] = input;
    setOtp(newOTP);

    if (input.length === 1 && input < length - 1) {
      inputRef.current[index + 1].focus();
    }
  };

  const handlerKeyDown = (e, index) => {
    console.log(e.key === "Backspace" , !otp[index] , index > 0);
   if (e.key === "Backspace" && !otp[index] && index > 0) {
     inputRef.current[index - 1]?.focus(); 
   }
  };

  return (
    <div>
      {otp.map((m, index) => {
        return (
          <input
            key={index}
            maxLength={1}
            onKeyDown={(e)=>handlerKeyDown(e,index)}
            onChange={(e) => handleTextChange(e, index)}
            ref={(r) => (inputRef.current[index] = r)}
            value={otp[index]}
          />
        );
      })}
    </div>
  );
}

export default Otp;
