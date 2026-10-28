import { useActionState } from "react";

type FormState = {
  name: string;
  email: string;
  submittedAt: string | null;
};

const initialState: FormState = { name: "", email: "", submittedAt: null };

async function submitAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  // Simulate a network request.
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { name, email, submittedAt: new Date().toLocaleTimeString() };
}

export default function MyForm() {
  const [state, action, pending] = useActionState(submitAction, initialState);

  return (
    <div className="mx-auto max-w-sm space-y-6 p-6">
      <form action={action} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="af-name" className="text-sm font-medium text-text-main">Name</label>
          <input
            id="af-name"
            type="text"
            name="name"
            required
            defaultValue={state.name}
            className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="af-email" className="text-sm font-medium text-text-main">Email</label>
          <input
            id="af-email"
            type="email"
            name="email"
            required
            defaultValue={state.email}
            className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-brand-500 py-2.5 font-semibold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Submitting…" : "Submit"}
        </button>
      </form>

      {state.submittedAt && (
        <div className="rounded-lg border border-border-subtle bg-muted p-4 text-sm" aria-live="polite">
          <p className="font-semibold text-text-main">Submitted at {state.submittedAt}</p>
          <p className="text-text-muted">Name: {state.name}</p>
          <p className="text-text-muted">Email: {state.email}</p>
        </div>
      )}
    </div>
  );
}
