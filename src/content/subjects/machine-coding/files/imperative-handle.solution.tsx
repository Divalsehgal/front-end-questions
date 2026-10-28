import { useId, useImperativeHandle, useRef, useState, type ReactNode, type Ref } from "react";
import { Eraser, MousePointer2, Zap } from "lucide-react";

export interface CustomInputRef {
  focus: () => void;
  clear: () => void;
  shake: () => void;
}

const SHAKE_CSS = `
@keyframes input-shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-8px); }
  40%, 80% { transform: translateX(8px); }
}
.input-shake { animation: input-shake 0.4s ease-in-out; }
`;

// --- Child ---

// React 19: `ref` is a regular prop on function components (no forwardRef needed).
function CustomInput({ label, placeholder, ref }: Readonly<{ label: string; placeholder?: string; ref: Ref<CustomInputRef> }>) {
  const id = useId();
  const [value, setValue] = useState("");
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // The parent gets this object, not the <input>: three methods and nothing else.
  useImperativeHandle(
    ref,
    () => ({
      focus: () => inputRef.current?.focus(),
      clear: () => setValue(""),
      shake: () => setShaking(true),
    }),
    [],
  );

  return (
    <div className="space-y-2">
      <style>{SHAKE_CSS}</style>
      <label htmlFor={id} className="text-sm font-semibold text-text-main">
        {label}
      </label>
      <input
        id={id}
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        onAnimationEnd={() => setShaking(false)}
        className={`w-full rounded-xl border-2 border-border-subtle bg-surface px-4 py-3 text-text-main outline-none focus:border-brand-500 ${
          shaking ? "input-shake border-error" : ""
        }`}
      />
    </div>
  );
}

// --- Parent ---

export default function ImperativeHandleExample() {
  const inputRef = useRef<CustomInputRef>(null);

  return (
    <div className="mx-auto max-w-xl space-y-6 p-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-text-main">useImperativeHandle</h2>
        <p className="text-sm text-text-muted">The parent calls focus, clear and shake through a ref.</p>
      </div>

      <div className="space-y-6 rounded-2xl border border-border-subtle bg-surface p-6">
        <CustomInput ref={inputRef} label="Input" placeholder="Type something…" />

        <div className="grid grid-cols-3 gap-3">
          <ControlButton onClick={() => inputRef.current?.focus()} icon={<MousePointer2 className="size-5" />} label="Focus" />
          <ControlButton onClick={() => inputRef.current?.shake()} icon={<Zap className="size-5" />} label="Shake" />
          <ControlButton onClick={() => inputRef.current?.clear()} icon={<Eraser className="size-5" />} label="Clear" />
        </div>
      </div>

      <div className="space-y-2 rounded-2xl bg-muted p-5 text-sm text-text-main">
        <p>Only focus, shake and clear are exposed; the parent never gets the DOM node.</p>
        <p className="text-text-muted">
          Use it sparingly: imperative calls bypass React's data flow, so the parent can't see or render the
          state they change. Prefer props (e.g. <code>value</code>, <code>error</code>) and reach for a handle only
          for things props can't express well, like focus, scroll or playing an animation.
        </p>
      </div>
    </div>
  );
}

function ControlButton({ onClick, icon, label }: Readonly<{ onClick: () => void; icon: ReactNode; label: string }>) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 rounded-xl bg-brand-500 p-3 text-sm font-semibold text-text-inverted hover:bg-brand-600"
    >
      {icon}
      {label}
    </button>
  );
}
