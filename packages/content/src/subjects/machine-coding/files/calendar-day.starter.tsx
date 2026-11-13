import { useState } from 'react';

interface EventData {
  startTime: string; // "HH:mm"
  endTime: string;
  color: string;
  title: string;
}

const EVENTS: EventData[] = [
  { startTime: "00:00", endTime: "01:30", color: "var(--color-brand-500)", title: "Team sync" },
  { startTime: "03:30", endTime: "07:30", color: "var(--color-brand-600)", title: "Project planning" },
  { startTime: "04:30", endTime: "08:30", color: "var(--color-brand-400)", title: "Focus time" },
  { startTime: "06:30", endTime: "09:00", color: "var(--color-brand-500)", title: "Client demo" },
  { startTime: "09:30", endTime: "10:30", color: "var(--color-brand-500)", title: "Status update" },
  { startTime: "11:00", endTime: "13:30", color: "var(--color-brand-600)", title: "Lunch" },
  { startTime: "12:00", endTime: "13:30", color: "var(--color-brand-400)", title: "Interview" },
  { startTime: "15:00", endTime: "17:00", color: "var(--color-brand-600)", title: "All hands" },
  { startTime: "16:00", endTime: "17:00", color: "var(--color-brand-500)", title: "Design review" },
  { startTime: "18:00", endTime: "19:00", color: "var(--color-brand-700)", title: "Product sync" },
  { startTime: "20:30", endTime: "22:30", color: "var(--color-brand-500)", title: "Evening call" },
];

export default function GoogleCalendar() {
  // your code
  return <div className="p-6">Start building here</div>;
}
