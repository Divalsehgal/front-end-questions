import { useRef, useState } from 'react';

type User = { id: number; first_name: string; last_name: string };

const DATA = [
  { id: 1, first_name: "Merell", last_name: "Covert" },
  { id: 2, first_name: "Sandy", last_name: "Maunton" },
  { id: 3, first_name: "Dix", last_name: "Lunney" },
  { id: 4, first_name: "Sammie", last_name: "Longworthy" },
  { id: 5, first_name: "Lavinie", last_name: "Dayer" },
  { id: 6, first_name: "Rodie", last_name: "Dumbar" },
  { id: 7, first_name: "Claudius", last_name: "Stansby" },
  { id: 8, first_name: "Cary", last_name: "Donnan" },
  { id: 9, first_name: "Vicky", last_name: "Mattiazzo" },
  { id: 10, first_name: "Velma", last_name: "Ranklin" },
  { id: 11, first_name: "Juditha", last_name: "Boldt" },
  { id: 12, first_name: "Cordie", last_name: "Alexander" },
];

export default function MentionBox() {
  const [text, setText] = useState('');
  const [options, setOptions] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setText(value);

    // Look at the last word. If it starts with @, show the users that match it.
    const words = value.split(' ');
    const lastWord = words[words.length - 1];
    if (lastWord.startsWith('@')) {
      const query = lastWord.slice(1).toLowerCase();
      const matches = DATA.filter(
        (user) => user.first_name.toLowerCase().includes(query) || user.last_name.toLowerCase().includes(query),
      );
      setOptions(matches);
      setOpen(matches.length > 0);
    } else {
      setOpen(false);
    }
  };

  const selectUser = (user: User) => {
    // Replace the @word with the mention.
    const words = text.split(' ');
    words[words.length - 1] = `@${user.first_name} `;
    setText(words.join(' '));
    setOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="mx-auto max-w-md space-y-3 p-6">
      <h2 className="text-xl font-bold text-text-main">Mention box</h2>
      <div className="relative">
        <input
          ref={inputRef}
          value={text}
          onChange={handleChange}
          onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
          placeholder="Type @ to mention someone"
          aria-label="Message"
          className="w-full rounded-lg border border-border-subtle bg-surface p-3 text-text-main"
        />
        {open && (
          <ul className="absolute top-full left-0 z-10 mt-1 w-64 rounded-lg border border-border-subtle bg-surface p-1 shadow-soft">
            {options.map((user) => (
              <li key={user.id}>
                <button
                  onClick={() => selectUser(user)}
                  className="w-full rounded px-3 py-2 text-left text-sm text-text-main hover:bg-surface-muted"
                >
                  {user.first_name} {user.last_name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
