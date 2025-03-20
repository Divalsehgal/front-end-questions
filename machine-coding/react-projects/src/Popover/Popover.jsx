import React, { useState, useEffect, useRef } from "react";
import "./Popover.scss";
function Popover() {
  const [open, setOpen] = useState(false);
  const popover = useRef(null);
  function clickOutside(e) {
    if (popover.current && !popover.current.contains(e.target)) {
      setOpen(false);
    }
  }
  useEffect(() => {
    document.addEventListener("click", clickOutside);
    return () => {
      document.removeEventListener("click", clickOutside);
    };
  }, []);

  const clickHandler = (e) => {
    e.stopPropagation();
    setOpen(true);
  };
  return (
    <div className="popover-container">
      <button onClick={clickHandler}>click me</button>
      <div className="popover-inner">
        {open && (
          <div className="popover" ref={popover}>
            Hi this is Pop over component its get close if you click outside
          </div>
        )}
      </div>
    </div>
  );
}

export default Popover;
