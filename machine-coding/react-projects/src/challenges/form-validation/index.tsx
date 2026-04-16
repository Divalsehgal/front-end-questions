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
      <div className="max-w-md mx-auto p-8 text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-success-500/10 rounded-full flex items-center justify-center mx-auto text-success-500">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-text-main tracking-tight uppercase">Account Created</h3>
          <p className="text-sm text-text-muted font-medium">Your registration was successful. Welcome aboard!</p>
        </div>
        <button 
          onClick={() => setIsSuccess(false)}
          className="px-8 py-3 bg-brand-500 text-text-inverted font-bold rounded-2xl hover:bg-brand-600 transition-all shadow-hard active:scale-95"
        >
          Back to Start
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-8">
      <div className="space-y-1 text-center">
        <div className="inline-flex p-3 bg-brand-500/10 rounded-2xl text-brand-500 mb-2">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black text-text-main tracking-tighter uppercase">Join Us</h2>
        <p className="text-sm font-medium text-text-muted">Create your account to get started.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Username */}
        <div className="space-y-1.5 focus-within:z-10">
          <label className="text-tiny font-black text-text-muted uppercase tracking-widest ml-1 opacity-50">Username</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted/30 group-focus-within:text-brand-500 transition-colors">
              <User className="w-5 h-5" />
            </div>
            <input
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              placeholder="johndoe"
              className={cn(
                "w-full pl-11 pr-4 py-4 bg-surface border-2 rounded-2xl outline-none transition-all text-text-main",
                errors.username ? "border-error-500 bg-error-500/5 ring-error-500/10" : "border-subtle focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
              )}
            />
          </div>
          {errors.username && (
            <div className="flex items-center gap-1.5 text-tiny font-black uppercase text-error-500 ml-1 animate-in slide-in-from-top-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.username}
            </div>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-tiny font-black text-text-muted uppercase tracking-widest ml-1 opacity-50">Email Address</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted/30 group-focus-within:text-brand-500 transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className={cn(
                "w-full pl-11 pr-4 py-4 bg-surface border-2 rounded-2xl outline-none transition-all text-text-main",
                errors.email ? "border-error-500 bg-error-500/5 ring-error-500/10" : "border-subtle focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
              )}
            />
          </div>
          {errors.email && (
            <div className="flex items-center gap-1.5 text-tiny font-black uppercase text-error-500 ml-1 animate-in slide-in-from-top-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.email}
            </div>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-tiny font-black text-text-muted uppercase tracking-widest ml-1 opacity-50">Password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted/30 group-focus-within:text-brand-500 transition-colors">
              <Lock className="w-5 h-5" />
            </div>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={cn(
                "w-full pl-11 pr-4 py-4 bg-surface border-2 rounded-2xl outline-none transition-all text-text-main",
                errors.password ? "border-error-500 bg-error-500/5 ring-error-500/10" : "border-subtle focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
              )}
            />
          </div>
          {errors.password && (
            <div className="flex items-center gap-1.5 text-tiny font-black uppercase text-error-500 ml-1 animate-in slide-in-from-top-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.password}
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="text-tiny font-black text-text-muted uppercase tracking-widest ml-1 opacity-50">Confirm Password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted/30 group-focus-within:text-brand-500 transition-colors">
              <Lock className="w-5 h-5" />
            </div>
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className={cn(
                "w-full pl-11 pr-4 py-4 bg-surface border-2 rounded-2xl outline-none transition-all text-text-main",
                errors.confirmPassword ? "border-error-500 bg-error-500/5 ring-error-500/10" : "border-subtle focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
              )}
            />
          </div>
          {errors.confirmPassword && (
            <div className="flex items-center gap-1.5 text-tiny font-black uppercase text-error-500 ml-1 animate-in slide-in-from-top-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.confirmPassword}
            </div>
          )}
        </div>

        <button
          disabled={isSubmitting}
          type="submit"
          className={cn(
            "w-full py-5 rounded-2xl font-black uppercase tracking-widest text-text-inverted transition-all shadow-hard active:scale-95 group",
            isSubmitting ? "bg-muted" : "bg-brand-500 hover:bg-brand-600 shadow-brand-500/20"
          )}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Validating...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              Create Account
              <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          )}
        </button>
      </form>
    </div>
  );
}
