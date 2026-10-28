import { useState } from 'react';

interface User {
  id: string;
  name: { first: string; last: string };
  email: string;
  picture: { thumbnail: string; large: string };
  location: { country: string };
}

export default function InfiniteReloading() {
  // your code
  return <div className="p-6">Start building here</div>;
}
