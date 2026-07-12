import React, { useState, useRef } from "react";
import DATA from "./data.json";
import { cn } from "../../utils/cn";
import { useDummyState, useDummyActions } from "../../context/DummyProvider";
import { AtSign, User as UserIcon, LogIn } from "lucide-react";
import { Popover } from "@base-ui/react/popover";

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
};

export const hint = "Mention Box with suggestions starting with @";

export default function MentionBox() {
  const { value: dummyValue } = useDummyState();
  const { setValue: setDummyValue } = useDummyActions();

  const [inputValue, setInputValue] = useState("");
  const [mentionOptions, setMentionOptions] = useState<User[]>(DATA);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputValue(text);

    // Simplistic detection: check if last word starts with @
    const words = text.split(" ");
    const lastWord = words[words.length - 1];

    if (lastWord.startsWith("@")) {
      const query = lastWord.substring(1).toLowerCase();
      const filtered = DATA.filter((user: any) =>
        user.first_name.toLowerCase().includes(query) ||
        user.last_name.toLowerCase().includes(query)
      ).slice(0, 10); // Limit to 10 for performance/UI
      
      setMentionOptions(filtered);
      setOpen(filtered.length > 0);
    } else {
      setOpen(false);
    }
  };

  const handleSelectUser = (user: User) => {
    const words = inputValue.split(" ");
    words[words.length - 1] = `@${user.first_name} `;
    setInputValue(words.join(" "));
    setOpen(false);
    inputRef.current?.focus();
  };

  const handleDummyChange = () => {
    const temp = {
      id: 22,
      name: "Minal Sehgal",
      age: 10000,
    };
    setDummyValue(temp);
    localStorage.setItem("name", JSON.stringify(temp));
  };

  return (
    <div className="mx-auto max-w-xl space-y-8 p-6">
      <div className="space-y-2 text-center md:text-left">
        <h2 className="flex items-center justify-center gap-2 text-2xl font-black tracking-tight text-text-main uppercase md:justify-start">
          <AtSign className="size-7 text-brand-500" />
          Mention Box
        </h2>
        <p className="text-sm font-medium text-text-muted">
          Type <span className="font-mono font-black text-brand-500">@</span> to see intelligence suggestions.
        </p>
      </div>

      <div className="relative">
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <div className="group relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleChange}
                placeholder="Start typing @name..."
                className="border-subtle group-hover:border-strong w-full rounded-2xl border-2 bg-surface p-4 font-medium text-text-main transition-all outline-none placeholder:text-text-muted/30 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
              />
            </div>
          </Popover.Trigger>

          <Popover.Portal>
            <Popover.Positioner side="bottom" align="start" sideOffset={8}>
              <Popover.Popup className="border-subtle animate-in fade-in zoom-in z-50 w-64 overflow-hidden rounded-3xl border bg-surface p-2 shadow-hard duration-200">
                <div className="space-y-1">
                  {mentionOptions.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      className="group flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left transition-colors hover:bg-muted"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-brand-500">
                        <UserIcon className="size-4" />
                      </div>
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-black text-text-main">
                          {user.first_name} {user.last_name}
                        </span>
                        <span className="text-tiny truncate font-black tracking-widest text-text-muted/50 uppercase">
                          @{user.first_name.toLowerCase()}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      </div>

      {/* Context State Demo Section */}
      <div className="border-subtle space-y-4 rounded-3xl border bg-muted p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-2xl bg-brand-500/10 p-3 text-brand-500">
              <LogIn className="size-6" />
            </div>
            <div>
              <p className="text-tiny font-black tracking-widest text-text-muted/50 uppercase">Active User (Context)</p>
              <p className="text-lg font-black tracking-tight text-text-main uppercase">{dummyValue.name}</p>
            </div>
          </div>
          <button
            onClick={handleDummyChange}
            className="text-tiny rounded-xl bg-brand-500 px-6 py-2.5 font-black tracking-widest text-text-inverted uppercase shadow-soft transition-all hover:bg-brand-600 active:scale-95"
          >
            Update Context
          </button>
        </div>
        <div className="text-tiny px-1 font-medium text-text-muted/60 italic">
          This section demonstrates state sharing across components via the DummyProvider system.
        </div>
      </div>
    </div>
  );
}
