import React, { useEffect, useState, useRef } from "react";
import { ShieldCheck, Lock } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface OtpProps {
  length?: number;
}

const Otp: React.FC<OtpProps> = ({ length = 6 }) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRef = useRef<HTMLInputElement[] | null[]>(Array(length).fill(null));

  useEffect(() => {
    inputRef.current[0]?.focus();
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const input = e.target.value;
    if (isNaN(Number(input))) return; // Only allow numbers

    const newOTP = [...otp];
    // Use only the last character if multiple are entered (pasting handled separately if needed)
    newOTP[index] = input.substring(input.length - 1);
    setOtp(newOTP);

    // Auto focus next input
    if (input && index < length - 1) {
      inputRef.current[index + 1]?.focus();
    }
  };

  const handlerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRef.current[index - 1]?.focus();
    }
  };

  const isComplete = otp.every(v => v !== "");

  return (
    <div className="flex flex-col items-center justify-center p-12 bg-muted rounded-3xl min-h-[450px]">
      <div className="mb-12 text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-brand-500">
          <ShieldCheck size={32} strokeWidth={2.5} />
        </div>
        <h2 className="text-4xl font-display font-black tracking-tighter text-text-main">Verify Identity</h2>
        <p className="text-text-muted max-w-sm mx-auto">
          We've sent a 6-digit code to your secure device. Enter it below to proceed.
        </p>
      </div>

      <div className="flex gap-3 md:gap-4 justify-center items-center">
        {otp.map((value, index) => (
          <div key={index} className="relative group">
             <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              onKeyDown={(e) => handlerKeyDown(e, index)}
              onChange={(e) => handleTextChange(e, index)}
              ref={(r) => (inputRef.current[index] = r)}
              value={value}
              className={cn(
                "w-12 h-16 md:w-16 md:h-20 bg-surface border-2 border-strong rounded-2xl text-center text-3xl font-mono font-black",
                "focus:border-brand-500 focus:ring-8 focus:ring-brand-500/10 outline-none transition-all duration-300",
                value && "border-brand-500 bg-brand-500/5 text-brand-500",
                "group-hover:border-brand-500/50"
              )}
            />
            {/* Visual focus underline */}
            <div className={cn(
               "absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full transition-all duration-300",
               value ? "bg-brand-500 w-8" : "bg-strong group-hover:bg-brand-500/30"
            )} />
          </div>
        ))}
      </div>

      <div className="mt-16 group">
        <button 
          disabled={!isComplete}
          className={cn(
            "flex items-center gap-3 px-12 py-4 rounded-2xl font-black text-lg transition-all duration-500",
            isComplete 
              ? "bg-brand-500 text-text-inverted shadow-hard shadow-brand-500/30 hover:scale-105 active:scale-95 cursor-pointer" 
              : "bg-surface border-2 border-strong text-text-muted opacity-50 cursor-not-allowed"
          )}
        >
          <Lock size={20} className={cn(isComplete ? "animate-bounce" : "")} /> 
          Authorize Access
        </button>
      </div>

      <p className="mt-8 text-sm text-text-muted hover:text-brand-500 transition-colors cursor-pointer">
        Didn't receive code? <span className="font-bold underline decoration-brand-500/30 underline-offset-4">Resend OTP</span>
      </p>
    </div>
  );
};

export default Otp;
export const hint = "Premium OTP input with auto-focus, keyboard navigation, and production Tailwind v4 patterns";
