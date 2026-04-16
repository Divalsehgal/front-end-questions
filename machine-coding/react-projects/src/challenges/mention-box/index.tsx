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
    <div className="max-w-xl mx-auto space-y-8 p-6">
      <div className="space-y-2 text-center md:text-left">
        <h2 className="text-2xl font-black text-text-main flex items-center gap-2 tracking-tight uppercase justify-center md:justify-start">
          <AtSign className="w-7 h-7 text-brand-500" />
          Mention Box
        </h2>
        <p className="text-sm font-medium text-text-muted">
          Type <span className="font-mono text-brand-500 font-black">@</span> to see intelligence suggestions.
        </p>
      </div>

      <div className="relative">
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <div className="relative group">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleChange}
                placeholder="Start typing @name..."
                className="w-full px-4 py-4 bg-surface border-2 border-subtle rounded-2xl focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none text-text-main placeholder:text-text-muted/30 group-hover:border-strong font-medium"
              />
            </div>
          </Popover.Trigger>

          <Popover.Portal>
            <Popover.Positioner side="bottom" align="start" sideOffset={8}>
              <Popover.Popup className="w-64 bg-surface border border-subtle rounded-3xl shadow-hard overflow-hidden animate-in fade-in zoom-in duration-200 z-50 p-2">
                <div className="space-y-1">
                  {mentionOptions.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-muted transition-colors text-left group"
                    >
                      <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-500 shrink-0">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-black text-text-main truncate">
                          {user.first_name} {user.last_name}
                        </span>
                        <span className="text-tiny font-black text-text-muted/50 uppercase tracking-widest truncate">
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
      <div className="p-6 bg-muted rounded-3xl border border-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-3 bg-brand-500/10 rounded-2xl text-brand-500">
              <LogIn className="w-6 h-6" />
            </div>
            <div>
              <p className="text-tiny font-black uppercase tracking-widest text-text-muted/50">Active User (Context)</p>
              <p className="text-lg font-black text-text-main tracking-tight uppercase">{dummyValue.name}</p>
            </div>
          </div>
          <button
            onClick={handleDummyChange}
            className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 active:scale-95 text-text-inverted text-tiny font-black uppercase tracking-widest rounded-xl transition-all shadow-soft"
          >
            Update Context
          </button>
        </div>
        <div className="text-tiny font-medium text-text-muted/60 italic px-1">
          This section demonstrates state sharing across components via the DummyProvider system.
        </div>
      </div>
    </div>
  );
}
