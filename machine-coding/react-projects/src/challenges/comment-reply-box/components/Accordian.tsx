import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type ChildrenProps = {
  title: string;
};

type AccordianProps = {
  children: React.ReactNode;
  childrenProps: ChildrenProps;
};

function Accordian({ children, childrenProps }: AccordianProps) {
  const { title } = childrenProps;
  const [show, setShow] = useState(false);

  const toggleHandler = () => {
    setShow(!show);
  };

  return (
    <div className="accordion-container">
      <button
        onClick={toggleHandler}
        className={`accordion-button ${show ? "active" : ""}`}
      >
        {show ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {title}
            <ChevronUp />
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {title}
            <ChevronDown />
          </div>
        )}
      </button>
      <div className={`accordion-content ${show ? "show" : ""}`}>
        {children}
      </div>
    </div>
  );
}

export default Accordian;
