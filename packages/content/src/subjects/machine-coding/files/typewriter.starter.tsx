import { useState } from 'react';

const SAMPLE_CODE = `async function fetchUser(id) {
  const res = await fetch(\`/api/users/\${id}\`);
  if (!res.ok) {
    throw new Error(\`Request failed: \${res.status}\`);
  }
  return res.json();
}`;

export default function TypeWriterEffect() {
  // your code
  return <div className="p-6">Start building here</div>;
}
