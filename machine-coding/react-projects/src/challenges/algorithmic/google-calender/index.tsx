import React, { useMemo } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { cn } from "../../../utils/cn";
import { Calendar as CalendarIcon, Clock, MoreVertical, Plus } from "lucide-react";

dayjs.extend(customParseFormat);

export const hint = "Interactive calendar with overlapping event detection and collision logic";

// Types
export interface EventData {
  startTime: string;
  endTime: string;
  color: string;
  title: string;
  count?: number;
}

// Data Handling logic
const ConflictingData: EventData[] = [
  { startTime: "00:00", endTime: "01:30", color: "var(--color-brand-500)", title: "Team Sync" },
  { startTime: "03:30", endTime: "07:30", color: "var(--color-brand-600)", title: "Project Alpha" },
  { startTime: "04:30", endTime: "08:30", color: "var(--color-brand-400)", title: "Deep Work" },
  { startTime: "06:30", endTime: "09:00", color: "var(--color-brand-500)", title: "Client Demo" },
  { startTime: "11:00", endTime: "13:30", color: "var(--color-brand-600)", title: "Lunch Break" },
  { startTime: "12:00", endTime: "13:30", color: "var(--color-brand-400)", title: "Hiring Interview" },
  { startTime: "09:30", endTime: "10:30", color: "var(--color-brand-500)", title: "Status Update" },
  { startTime: "16:00", endTime: "17:00", color: "var(--color-brand-500)", title: "Design Review" },
  { startTime: "15:00", endTime: "17:00", color: "var(--color-brand-600)", title: "All Hands" },
  { startTime: "18:00", endTime: "19:00", color: "var(--color-brand-700)", title: "Product Sync" },
  { startTime: "20:30", endTime: "22:30", color: "var(--color-brand-500)", title: "Night Owls" },
];

const timeToMinutes = (str: string) => {
  const [hour, minutes] = str.split(":").map(Number);
  return hour * 60 + minutes;
};

const processedEvents = (() => {
  const events: { time: number; type: number; index: number }[] = [];
  ConflictingData.forEach((item, index) => {
    events.push({ time: timeToMinutes(item.startTime), type: 1, index });
    events.push({ time: timeToMinutes(item.endTime), type: -1, index });
  });

  events.sort((a, b) => a.time - b.time || a.type - b.type);

  let active_meetings = 0;
  const meetingCount = new Map();
  for (const event of events) {
    active_meetings += event.type;
    if (event.type === 1) {
      meetingCount.set(event.index, active_meetings);
    }
  }

  return ConflictingData.map((item, index) => ({
    ...item,
    count: meetingCount.get(index) || 0,
  }));
})();

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 === 0 ? 12 : i % 12;
  const period = i < 12 ? "AM" : "PM";
  return { label: `${hour}:00 ${period}`, minutes: i * 60 };
});

function EventWidget({ event }: { event: EventData }) {
  const start = timeToMinutes(event.startTime);
  const end = timeToMinutes(event.endTime);
  const duration = end - start;
  
  // Offset logic for overlap
  const offsetMultiplier = 20;
  const leftOffset = ((event.count || 1) - 1) * offsetMultiplier;

  return (
    <div
      className={cn(
        "group absolute right-2 cursor-pointer overflow-hidden rounded-lg border-l-4 p-2 shadow-soft backdrop-blur-sm transition-all hover:z-10 hover:shadow-hard"
      )}
      style={{
        backgroundColor: `${event.color}15`,
        borderColor: event.color,
        top: `${start}px`,
        height: `${duration}px`,
        left: `${leftOffset + 60}px`, // 60px is the width of the time label column
      }}
    >
      <div className="flex items-start justify-between">
        <h5 className="text-tiny truncate font-bold text-text-main" style={{ color: event.color }}>
          {event.title}
        </h5>
        <MoreVertical className="size-2.5 shrink-0 text-text-muted opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="text-tiny mt-0.5 flex items-center gap-1 font-medium text-text-muted">
        <Clock className="size-2" />
        {event.startTime} - {event.endTime}
      </div>
    </div>
  );
}

export default function GoogleCalendar() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-brand-500 p-2 text-text-inverted shadow-hard shadow-brand-500/20">
            <CalendarIcon className="size-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text-main">Day Planner</h2>
            <p className="text-sm font-medium text-text-muted">Monday, Jan 24, 2026</p>
          </div>
        </div>
        <button className="border-subtle flex items-center gap-2 rounded-xl border bg-surface px-4 py-2 text-sm font-semibold shadow-soft transition-all hover:bg-muted">
          <Plus className="size-4 text-brand-500" />
          Add Event
        </button>
      </div>

      <div className="border-subtle overflow-hidden rounded-3xl border bg-surface shadow-hard">
        <div className="relative h-[1440px] select-none">
          {/* Hour Grid Lines */}
          <div className="absolute inset-0">
            {HOURS.map((hour) => (
              <div 
                key={hour.minutes} 
                className="border-subtle absolute flex w-full border-t"
                style={{ top: `${hour.minutes}px`, height: '60px' }}
              >
                <div className="w-[60px] -translate-y-2 pr-2 text-right">
                  <span className="text-tiny font-bold tracking-tighter text-text-muted uppercase">
                    {hour.label.split(' ')[0]}
                    <span className="text-tiny ml-0.5 opacity-50">{hour.label.split(' ')[1]}</span>
                  </span>
                </div>
                <div className="border-subtle flex-1 border-l" />
              </div>
            ))}
          </div>

          {/* Events Layer */}
          <div className="pointer-events-none absolute inset-0 z-10">
            <div className="pointer-events-auto relative h-full">
              {processedEvents.map((event, idx) => (
                <EventWidget key={`${event.title}-${idx}`} event={event} />
              ))}
            </div>
          </div>
          
          {/* Current Time Indicator (Dummy Example) */}
          <div 
            className="pointer-events-none absolute right-0 left-[60px] z-20 flex items-center border-t-2 border-error"
            style={{ top: '650px' }}
          >
            <div className="-ml-1 size-2 rounded-full bg-error" />
          </div>
        </div>
      </div>
    </div>
  );
}
