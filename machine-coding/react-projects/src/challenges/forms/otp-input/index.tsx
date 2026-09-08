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
    <div className="flex min-h-[450px] flex-col items-center justify-center rounded-3xl bg-muted p-12">
      <div className="mb-12 space-y-3 text-center">
        <div className="flex items-center justify-center gap-2 text-brand-500">
          <ShieldCheck size={32} strokeWidth={2.5} />
        </div>
        <h2 className="font-display text-4xl font-black tracking-tighter text-text-main">Verify Identity</h2>
        <p className="mx-auto max-w-sm text-text-muted">
          We've sent a 6-digit code to your secure device. Enter it below to proceed.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 md:gap-4">
        {otp.map((value, index) => (
          <div key={index} className="group relative">
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
                "border-strong h-16 w-12 rounded-2xl border-2 bg-surface text-center font-mono text-3xl font-black md:h-20 md:w-16",
                "transition-all duration-300 outline-none focus:border-brand-500 focus:ring-8 focus:ring-brand-500/10",
                value && "border-brand-500 bg-brand-500/5 text-brand-500",
                "group-hover:border-brand-500/50"
              )}
            />
            {/* Visual focus underline */}
            <div className={cn(
               "absolute bottom-2 left-1/2 h-1 w-4 -translate-x-1/2 rounded-full transition-all duration-300",
               value ? "w-8 bg-brand-500" : "bg-strong group-hover:bg-brand-500/30"
            )} />
          </div>
        ))}
      </div>

      <div className="group mt-16">
        <button 
          disabled={!isComplete}
          className={cn(
            "flex items-center gap-3 rounded-2xl px-12 py-4 text-lg font-black transition-all duration-500",
            isComplete 
              ? "cursor-pointer bg-brand-500 text-text-inverted shadow-hard shadow-brand-500/30 hover:scale-105 active:scale-95" 
              : "border-strong cursor-not-allowed border-2 bg-surface text-text-muted opacity-50"
          )}
        >
          <Lock size={20} className={cn(isComplete ? "animate-bounce" : "")} /> 
          Authorize Access
        </button>
      </div>

      <p className="mt-8 cursor-pointer text-sm text-text-muted transition-colors hover:text-brand-500">
        Didn't receive code? <span className="font-bold underline decoration-brand-500/30 underline-offset-4">Resend OTP</span>
      </p>
    </div>
  );
};

export default Otp;
export const hint = "Premium OTP input with auto-focus, keyboard navigation, and production Tailwind v4 patterns";
