import { useState } from 'react';

interface Story {
  id: number;
  title: string;
  url?: string; // missing on Ask HN posts
  score: number;
  by: string;
  time: number;
  descendants?: number;
}

export default function HackerNews() {
  // your code
  return <div className="p-6">Start building here</div>;
}
