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
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-12">
        <h2 className="text-4xl font-display font-black tracking-tighter text-text-main">Checkout Flow</h2>
        <p className="text-text-muted mt-2">Smooth, multi-step navigation ported to production-ready Tailwind utilities.</p>
      </div>

      <div className="bg-surface p-12 rounded-3xl border border-border-strong shadow-soft space-y-16">
        {/* Stepper Visualization */}
        <div className="relative flex justify-between items-center max-w-3xl mx-auto">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 z-0 rounded-full overflow-hidden">
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
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-4 group">
                <div 
                  className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-4",
                    isCompleted && "bg-brand-500 border-brand-500 text-text-inverted scale-110",
                    isActive && "bg-surface border-brand-500 text-brand-500 shadow-hard shadow-brand-500/20 scale-125",
                    !isCompleted && !isActive && "bg-muted border-border-subtle text-text-muted opacity-50"
                  )}
                >
                  {isCompleted ? <Check className="w-6 h-6" strokeWidth={3} /> : <Icon className="w-6 h-6" />}
                </div>
                
                <span className={cn(
                  "absolute -bottom-10 whitespace-nowrap font-bold text-sm tracking-tight transition-all duration-300",
                  isActive ? "text-brand-500 translate-y-0 opacity-100" : "text-text-muted -translate-y-2 opacity-100"
                )}>
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="pt-8 h-48 flex items-center justify-center bg-muted rounded-3xl border border-border-subtle animate-in zoom-in-95 duration-500">
           <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-text-main uppercase tracking-widest">
                 {stepperData.find(s => s.id === currentStep)?.name} Phase
              </h3>
              <p className="text-text-muted">Fill out your information for the {stepperData.find(s => s.id === currentStep)?.name.toLowerCase()} step.</p>
           </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button 
            onClick={prevHandler} 
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-8 py-4 bg-surface border border-border-strong rounded-2xl font-bold text-text-main hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronLeft size={20} /> Preview
          </button>
          
          <button 
            onClick={nextHandler} 
            disabled={currentStep === stepperData.length}
            className="flex items-center gap-2 px-8 py-4 bg-brand-500 text-text-inverted rounded-2xl font-bold hover:scale-105 active:scale-95 disabled:opacity-30 transition-all shadow-hard shadow-brand-500/20 cursor-pointer"
          >
            {currentStep === stepperData.length ? "Complete Purchase" : "Continue"} <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export const hint = "Interactive multi-step navigation flow with production tailwind v4 patterns";
