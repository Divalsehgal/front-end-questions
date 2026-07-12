import React, { useState } from "react";
import { Check, ChevronRight, ChevronLeft, User, CreditCard, Ship, PackageCheck } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const stepperData = [
  { id: 1, name: "Profile", icon: User },
  { id: 2, name: "Billing", icon: CreditCard },
  { id: 3, name: "Shipping", icon: Ship },
  { id: 4, name: "Delivery", icon: PackageCheck },
];

export default function MultiStepper() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const nextHandler = () => {
    if (currentStep < stepperData.length) {
      setCompletedSteps((prev) => [...new Set([...prev, currentStep])]);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevHandler = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      // Optional: Remove from completed steps if going back
      setCompletedSteps((prev) => prev.filter(s => s !== currentStep - 1));
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-8">
      <div className="mb-12">
        <h2 className="font-display text-4xl font-black tracking-tighter text-text-main">Checkout Flow</h2>
        <p className="mt-2 text-text-muted">Smooth, multi-step navigation ported to production-ready Tailwind utilities.</p>
      </div>

      <div className="space-y-16 rounded-3xl border border-border-strong bg-surface p-12 shadow-soft">
        {/* Stepper Visualization */}
        <div className="relative mx-auto flex max-w-3xl items-center justify-between">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 z-0 h-1 w-full -translate-y-1/2 overflow-hidden rounded-full bg-muted">
            <div 
              className="h-full bg-brand-500 transition-all duration-700 ease-spring"
              style={{ width: `${((currentStep - 1) / (stepperData.length - 1)) * 100}%` }}
            />
          </div>

          {stepperData.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isActive = step.id === currentStep;
            const Icon = step.icon;

            return (
              <div key={step.id} className="group relative z-10 flex flex-col items-center gap-4">
                <div 
                  className={cn(
                    "flex size-14 items-center justify-center rounded-2xl border-4 transition-all duration-500",
                    isCompleted && "scale-110 border-brand-500 bg-brand-500 text-text-inverted",
                    isActive && "scale-125 border-brand-500 bg-surface text-brand-500 shadow-hard shadow-brand-500/20",
                    !isCompleted && !isActive && "border-border-subtle bg-muted text-text-muted opacity-50"
                  )}
                >
                  {isCompleted ? <Check className="size-6" strokeWidth={3} /> : <Icon className="size-6" />}
                </div>
                
                <span className={cn(
                  "absolute -bottom-10 text-sm font-bold tracking-tight whitespace-nowrap transition-all duration-300",
                  isActive ? "translate-y-0 text-brand-500 opacity-100" : "-translate-y-2 text-text-muted opacity-100"
                )}>
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="animate-in zoom-in-95 flex h-48 items-center justify-center rounded-3xl border border-border-subtle bg-muted pt-8 duration-500">
           <div className="space-y-2 text-center">
              <h3 className="text-2xl font-black tracking-widest text-text-main uppercase">
                 {stepperData.find(s => s.id === currentStep)?.name} Phase
              </h3>
              <p className="text-text-muted">Fill out your information for the {stepperData.find(s => s.id === currentStep)?.name.toLowerCase()} step.</p>
           </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button 
            onClick={prevHandler} 
            disabled={currentStep === 1}
            className="flex cursor-pointer items-center gap-2 rounded-2xl border border-border-strong bg-surface px-8 py-4 font-bold text-text-main transition-all hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft size={20} /> Preview
          </button>
          
          <button 
            onClick={nextHandler} 
            disabled={currentStep === stepperData.length}
            className="flex cursor-pointer items-center gap-2 rounded-2xl bg-brand-500 px-8 py-4 font-bold text-text-inverted shadow-hard shadow-brand-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-30"
          >
            {currentStep === stepperData.length ? "Complete Purchase" : "Continue"} <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export const hint = "Interactive multi-step navigation flow with production tailwind v4 patterns";
