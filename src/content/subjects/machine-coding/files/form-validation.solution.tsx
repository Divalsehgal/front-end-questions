import React, { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CheckCircle2, Loader2 } from "lucide-react";

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

interface FormState {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type Field = keyof FormState;
type Errors = Partial<Record<Field, string>>;

const EMPTY: FormState = { username: "", email: "", password: "", confirmPassword: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Errors are derived from the whole form, so changing the password re-checks
// the confirmation automatically.
function validate(form: FormState): Errors {
  const errors: Errors = {};
  if (form.username.trim().length < 3) errors.username = "Username must be at least 3 characters";
  if (!EMAIL_RE.test(form.email)) errors.email = "Enter a valid email address";
  if (form.password.length < 8) errors.password = "Password must be at least 8 characters";
  if (!form.confirmPassword) errors.confirmPassword = "Confirm your password";
  else if (form.confirmPassword !== form.password) errors.confirmPassword = "Passwords do not match";
  return errors;
}

const STRENGTH_LABELS = ["Too weak", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = ["bg-red-500", "bg-red-500", "bg-amber-500", "bg-lime-500", "bg-green-600"];

/** 0–4: one point each for length >= 8, mixed case, a digit, a symbol. */
function passwordStrength(pw: string): number {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const FIELDS: { name: Field; label: string; type: string; autoComplete: string }[] = [
  { name: "username", label: "Username", type: "text", autoComplete: "username" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "password", label: "Password", type: "password", autoComplete: "new-password" },
  { name: "confirmPassword", label: "Confirm password", type: "password", autoComplete: "new-password" },
];

export default function FormValidation() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const errors = validate(form);
  const hasErrors = Object.keys(errors).length > 0;
  const strength = passwordStrength(form.password);
  const showError = (name: Field) => (touched[name] || submitted) && errors[name];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (hasErrors) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const startOver = () => {
    setForm(EMPTY);
    setTouched({});
    setSubmitted(false);
    setIsSuccess(false);
  };

  if (isSuccess) {
    return (
      <div className="mx-auto max-w-md space-y-4 p-8 text-center" role="status">
        <CheckCircle2 className="mx-auto size-12 text-green-600" />
        <h2 className="text-2xl font-bold text-text-main">Account created</h2>
        <p className="text-sm text-text-muted">Signed up as {form.username}.</p>
        <button
          type="button"
          onClick={startOver}
          className="rounded-lg bg-brand-500 px-6 py-2.5 font-semibold text-white hover:bg-brand-600"
        >
          Start over
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold text-text-main">Sign up</h2>
        <p className="text-sm text-text-muted">Create an account.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {FIELDS.map(({ name, label, type, autoComplete }) => {
          const id = `signup-${name}`;
          const errorId = `${id}-error`;
          const error = showError(name);
          return (
            <div key={name} className="space-y-1">
              <label htmlFor={id} className="text-sm font-medium text-text-main">
                {label}
              </label>
              <input
                id={id}
                name={name}
                type={type}
                autoComplete={autoComplete}
                value={form[name]}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : name === "password" ? `${id}-strength` : undefined}
                className={cn(
                  "w-full rounded-lg border-2 bg-surface px-3 py-2 text-text-main outline-none",
                  error ? "border-red-500" : "border-border-subtle focus:border-brand-500"
                )}
              />
              {name === "password" && form.password && (
                <div id={`${id}-strength`} className="space-y-1" aria-live="polite">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className={cn("h-1.5 flex-1 rounded-full", i < strength ? STRENGTH_COLORS[strength] : "bg-muted")}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-text-muted">Strength: {STRENGTH_LABELS[strength]}</p>
                </div>
              )}
              {error && (
                <p id={errorId} className="text-sm text-red-600">
                  {error}
                </p>
              )}
            </div>
          );
        })}

        <button
          type="submit"
          disabled={isSubmitting || (submitted && hasErrors)}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 py-2.5 font-semibold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {isSubmitting ? "Creating account…" : "Create account"}
        </button>
      </form>
    </div>
  );
}
