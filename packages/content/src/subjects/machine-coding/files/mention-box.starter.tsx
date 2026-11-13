import { useState } from 'react';

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
  // your code
  return <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type @ to mention someone" />;
}
