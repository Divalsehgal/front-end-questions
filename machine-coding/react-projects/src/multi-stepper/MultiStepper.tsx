import React, { useState } from "react";
import "./MultiStepper.scss";

const stepperData = [
  { id: 1, name: "Step 1", status: "notcompleted" },
  { id: 2, name: "Step 2", status: "notcompleted" },
  { id: 3, name: "Step 3", status: "notcompleted" },
  { id: 4, name: "Step 4", status: "notcompleted" },
];

function MultiStepper() {
  const [data, setData] = useState(stepperData);
  const [currentStep, setCurrentStep] = useState(1);

  const nextHandler = () => {
    if (currentStep < data.length) {
      setCurrentStep((prev) => prev + 1);
      updateStepStatus(currentStep, "completed");
    }
  };

  const prevHandler = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      updateStepStatus(currentStep - 1, "notcompleted");
    }
  };

  const updateStepStatus = (step, status) => {
    setData((prev) =>
      prev.map((item) => (item.id === step ? { ...item, status } : item))
    );
  };

  return (
    <div className="container">
      <div className="stepper">
        {data.map((d, index) => {
          const isActive = d.id === currentStep;
          return (
            <React.Fragment key={d.id}>
              <div
                className={`step ${
                  d.status === "completed" ? "completed" : ""
                } ${isActive ? "active" : ""}`}
              >
                {d.name}
              </div>
              {index !== data.length - 1 && <div className="step-line"></div>}
            </React.Fragment>
          );
        })}
      </div>

      <div className="buttons">
        <button onClick={prevHandler} disabled={currentStep === 1}>
          Prev
        </button>
        <button onClick={nextHandler} disabled={currentStep === data.length}>
          Next
        </button>
      </div>
    </div>
  );
}

export default MultiStepper;
