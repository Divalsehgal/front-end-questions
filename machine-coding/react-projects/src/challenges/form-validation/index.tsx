import React, { useState } from "react";
import { cn } from "../../utils/cn";
import { 
  User, 
  Mail, 
  Lock, 
  AlertCircle, 
  CheckCircle2, 
  Send,
  Loader2,
  ShieldCheck
} from "lucide-react";

export const hint = "Advanced form with real-time validation, password strength, and error handling";

interface FormState {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface Errors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function FormValidation() {
  const [form, setForm] = useState<FormState>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (name: string, value: string) => {
    let error = "";
    if (name === "username") {
      if (value.length < 3) error = "Username must be at least 3 characters";
    } else if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) error = "Please enter a valid email address";
    } else if (name === "password") {
      if (value.length < 8) error = "Password must be at least 8 characters";
    } else if (name === "confirmPassword") {
      if (value !== form.password) error = "Passwords do not match";
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    const error = validate(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Errors = {};
    Object.keys(form).forEach(key => {
      const error = validate(key, form[key as keyof FormState]);
      if (error) (newErrors as any)[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="animate-in fade-in zoom-in mx-auto max-w-md space-y-6 p-8 text-center duration-500">
        <div className="bg-success-500/10 text-success-500 mx-auto flex size-20 items-center justify-center rounded-full">
          <CheckCircle2 className="size-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black tracking-tight text-text-main uppercase">Account Created</h3>
          <p className="text-sm font-medium text-text-muted">Your registration was successful. Welcome aboard!</p>
        </div>
        <button 
          onClick={() => setIsSuccess(false)}
          className="rounded-2xl bg-brand-500 px-8 py-3 font-bold text-text-inverted shadow-hard transition-all hover:bg-brand-600 active:scale-95"
        >
          Back to Start
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-8 p-6">
      <div className="space-y-1 text-center">
        <div className="mb-2 inline-flex rounded-2xl bg-brand-500/10 p-3 text-brand-500">
          <ShieldCheck className="size-8" />
        </div>
        <h2 className="text-3xl font-black tracking-tighter text-text-main uppercase">Join Us</h2>
        <p className="text-sm font-medium text-text-muted">Create your account to get started.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Username */}
        <div className="space-y-1.5 focus-within:z-10">
          <label className="text-tiny ml-1 font-black tracking-widest text-text-muted uppercase opacity-50">Username</label>
          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted/30 transition-colors group-focus-within:text-brand-500">
              <User className="size-5" />
            </div>
            <input
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              placeholder="johndoe"
              className={cn(
                "w-full rounded-2xl border-2 bg-surface py-4 pr-4 pl-11 text-text-main transition-all outline-none",
                errors.username ? "border-error-500 bg-error-500/5 ring-error-500/10" : "border-subtle focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
              )}
            />
          </div>
          {errors.username && (
            <div className="text-tiny text-error-500 animate-in slide-in-from-top-1 ml-1 flex items-center gap-1.5 font-black uppercase">
              <AlertCircle className="size-3.5" />
              {errors.username}
            </div>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-tiny ml-1 font-black tracking-widest text-text-muted uppercase opacity-50">Email Address</label>
          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted/30 transition-colors group-focus-within:text-brand-500">
              <Mail className="size-5" />
            </div>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className={cn(
                "w-full rounded-2xl border-2 bg-surface py-4 pr-4 pl-11 text-text-main transition-all outline-none",
                errors.email ? "border-error-500 bg-error-500/5 ring-error-500/10" : "border-subtle focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
              )}
            />
          </div>
          {errors.email && (
            <div className="text-tiny text-error-500 animate-in slide-in-from-top-1 ml-1 flex items-center gap-1.5 font-black uppercase">
              <AlertCircle className="size-3.5" />
              {errors.email}
            </div>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-tiny ml-1 font-black tracking-widest text-text-muted uppercase opacity-50">Password</label>
          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted/30 transition-colors group-focus-within:text-brand-500">
              <Lock className="size-5" />
            </div>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={cn(
                "w-full rounded-2xl border-2 bg-surface py-4 pr-4 pl-11 text-text-main transition-all outline-none",
                errors.password ? "border-error-500 bg-error-500/5 ring-error-500/10" : "border-subtle focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
              )}
            />
          </div>
          {errors.password && (
            <div className="text-tiny text-error-500 animate-in slide-in-from-top-1 ml-1 flex items-center gap-1.5 font-black uppercase">
              <AlertCircle className="size-3.5" />
              {errors.password}
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="text-tiny ml-1 font-black tracking-widest text-text-muted uppercase opacity-50">Confirm Password</label>
          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted/30 transition-colors group-focus-within:text-brand-500">
              <Lock className="size-5" />
            </div>
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className={cn(
                "w-full rounded-2xl border-2 bg-surface py-4 pr-4 pl-11 text-text-main transition-all outline-none",
                errors.confirmPassword ? "border-error-500 bg-error-500/5 ring-error-500/10" : "border-subtle focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
              )}
            />
          </div>
          {errors.confirmPassword && (
            <div className="text-tiny text-error-500 animate-in slide-in-from-top-1 ml-1 flex items-center gap-1.5 font-black uppercase">
              <AlertCircle className="size-3.5" />
              {errors.confirmPassword}
            </div>
          )}
        </div>

        <button
          disabled={isSubmitting}
          type="submit"
          className={cn(
            "group w-full rounded-2xl py-5 font-black tracking-widest text-text-inverted uppercase shadow-hard transition-all active:scale-95",
            isSubmitting ? "bg-muted" : "bg-brand-500 shadow-brand-500/20 hover:bg-brand-600"
          )}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="size-5 animate-spin" />
              Validating...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              Create Account
              <Send className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
          )}
        </button>
      </form>
    </div>
  );
}
