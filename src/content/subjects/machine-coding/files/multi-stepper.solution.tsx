import { useState } from 'react';

const STEPS = ['Profile', 'Shipping', 'Billing', 'Delivery'];

export default function MultiStepper() {
  const [currentStep, setCurrentStep] = useState(0); // index into STEPS
  const [isDone, setIsDone] = useState(false);

  const isFirst = currentStep === 0;
  const isLast = currentStep === STEPS.length - 1;

  const next = () => {
    if (isLast) setIsDone(true);
    else setCurrentStep((prev) => prev + 1);
  };

  const back = () => {
    if (!isFirst) setCurrentStep((prev) => prev - 1);
  };

  // How much of the line between the first and last circle is filled.
  const progress = isDone ? 100 : (currentStep / (STEPS.length - 1)) * 100;

  return (
    <div className="mx-auto max-w-xl space-y-8 p-6">
      <div className="relative flex justify-between">
        {/* the grey line, and the coloured part on top of it */}
        <div className="absolute top-5 right-5 left-5 h-1 bg-muted">
          <div className="h-full bg-brand-500 transition-all" style={{ width: `${progress}%` }} />
        </div>

        {STEPS.map((name, i) => {
          const isCompleted = isDone || i < currentStep;
          const isActive = !isDone && i === currentStep;
          return (
            <div key={name} className="relative flex flex-col items-center gap-2">
              <span
                className={`flex size-10 items-center justify-center rounded-full border-2 font-bold ${
                  isCompleted
                    ? 'border-brand-500 bg-brand-500 text-text-inverted'
                    : isActive
                      ? 'border-brand-500 bg-surface text-brand-500'
                      : 'border-border-subtle bg-surface text-text-muted'
                }`}
              >
                {isCompleted ? '✓' : i + 1}
              </span>
              <span className={`text-sm ${isActive ? 'font-semibold text-text-main' : 'text-text-muted'}`}>{name}</span>
            </div>
          );
        })}
      </div>

      {isDone ? (
        <p className="rounded-lg bg-success-50 p-4 text-center font-semibold text-success-700">Order placed!</p>
      ) : (
        <>
          <p className="rounded-lg border border-border-subtle bg-surface p-6 text-text-main">{STEPS[currentStep]} details go here.</p>
          <div className="flex justify-between">
            <button onClick={back} disabled={isFirst} className="rounded-lg border border-border-subtle px-4 py-2 text-text-main disabled:opacity-40">
              Back
            </button>
            <button onClick={next} className="rounded-lg bg-brand-500 px-4 py-2 font-semibold text-text-inverted">
              {isLast ? 'Complete purchase' : 'Next'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
