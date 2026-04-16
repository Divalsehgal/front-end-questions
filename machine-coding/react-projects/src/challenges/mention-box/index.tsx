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
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <AtSign className="w-6 h-6 text-brand-500" />
          Mention Box
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Type <span className="font-mono text-brand-500">@</span> to see suggestions.
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
                className="w-full px-4 py-3 bg-white dark:bg-surface-800 border-2 border-surface-200 dark:border-surface-700 rounded-xl focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none text-gray-900 dark:text-white placeholder:text-gray-400 group-hover:border-surface-300 dark:group-hover:border-surface-600"
              />
            </div>
          </Popover.Trigger>

          <Popover.Portal>
            <Popover.Positioner side="bottom" align="start" sideOffset={8}>
              <Popover.Popup className="w-64 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 z-50">
                <div className="p-2 space-y-1">
                  {mentionOptions.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors text-left group"
                    >
                      <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {user.first_name} {user.last_name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
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
      <div className="p-6 bg-surface-50 dark:bg-surface-900/50 rounded-2xl border border-surface-200 dark:border-surface-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-brand-100 dark:bg-brand-900/30 rounded-lg text-brand-600">
              <LogIn className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Active User (Context)</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{dummyValue.name}</p>
            </div>
          </div>
          <button
            onClick={handleDummyChange}
            className="px-4 py-2 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-medium rounded-lg transition-all shadow-lg shadow-brand-500/20"
          >
            Update Context
          </button>
        </div>
        <div className="text-xs text-gray-400 dark:text-gray-500 italic">
          This section demonstrates state sharing across components via the DummyProvider.
        </div>
      </div>
    </div>
  );
}
