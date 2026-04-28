"use client";

import { useState, useEffect } from "react";

export default function HydrationSafeTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    // Only set the time after the client has mounted
    // This avoids "Server HTML doesn't match Client" errors
    setTime(new Date().toLocaleTimeString());
  }, []);

  if (!time) return <span className="text-gray-300">Loading time...</span>;

  return <span className="text-gray-500 text-xs">Viewed at: {time}</span>;
}
