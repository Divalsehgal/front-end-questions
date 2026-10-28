import React, { useEffect, useState, useRef } from "react";
import { CheckCircle2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

interface OtpProps {
  length?: number;
}

const Otp: React.FC<OtpProps> = ({ length = 6 }) => {
  const [otp, setOtp] = useState<string[]>(() => Array(length).fill(""));
  const [verified, setVerified] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const focusAt = (index: number) => {
    const i = Math.max(0, Math.min(index, length - 1));
    inputRefs.current[i]?.focus();
    inputRefs.current[i]?.select();
  };

  useEffect(() => {
    focusAt(0);
  }, []);

  const isComplete = otp.every((d) => d !== "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const input = e.target.value;
    if (isNaN(Number(input))) return; // numbers only
    const newOtp = [...otp];
    newOtp[index] = input.slice(-1); // the last typed digit, so typing over a box replaces it
    setOtp(newOtp);
    setVerified(false);
    if (input && index < length - 1) focusAt(index + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      e.preventDefault();
      setOtp((prev) => prev.map((d, i) => (i === index - 1 ? "" : d)));
      focusAt(index - 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusAt(index - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusAt(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    const newOtp = [...otp];
    let next = index;
    for (const char of pasted) {
      if (next >= length) break;
      if (isNaN(Number(char)) || char === ' ') continue; // skip anything that isn't a digit
      newOtp[next] = char;
      next++;
    }
    setOtp(newOtp);
    setVerified(false);
    focusAt(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isComplete) setVerified(true);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-8 rounded-2xl bg-muted p-10">
      <div className="space-y-1 text-center">
        <h2 className="text-2xl font-bold text-text-main">Enter code</h2>
        <p id="otp-help" className="text-sm text-text-muted">Enter the 6-digit code.</p>
      </div>

      <div className="flex gap-2 md:gap-3" role="group" aria-describedby="otp-help">
        {otp.map((value, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            pattern="\d*"
            maxLength={1}
            aria-label={`Digit ${index + 1} of ${length}`}
            value={value}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={(e) => handlePaste(e, index)}
            onFocus={(e) => e.target.select()}
            className={cn(
              "h-14 w-11 rounded-xl border-2 bg-surface text-center font-mono text-2xl font-bold outline-none md:h-16 md:w-12",
              "border-border-strong focus:border-brand-500",
              value && "border-brand-500 text-brand-500",
              verified && "border-green-600 text-green-600"
            )}
          />
        ))}
      </div>

      {verified ? (
        <p role="status" className="flex items-center gap-2 font-semibold text-green-600">
          <CheckCircle2 className="size-5" /> Code verified
        </p>
      ) : (
        <button
          type="submit"
          disabled={!isComplete}
          className="rounded-lg bg-brand-500 px-8 py-2.5 font-semibold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Verify
        </button>
      )}
    </form>
  );
};

export default Otp;
