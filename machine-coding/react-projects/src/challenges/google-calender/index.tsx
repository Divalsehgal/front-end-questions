import React, { useMemo } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { cn } from "../../utils/cn";
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
  for (let event of events) {
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
        "absolute right-2 rounded-lg border-l-4 p-2 shadow-soft transition-all hover:shadow-hard hover:z-10 group cursor-pointer overflow-hidden backdrop-blur-sm"
      )}
      style={{
        backgroundColor: `${event.color}15`,
        borderColor: event.color,
        top: `${start}px`,
        height: `${duration}px`,
        left: `${leftOffset + 60}px`, // 60px is the width of the time label column
      }}
    >
      <div className="flex justify-between items-start">
        <h5 className="text-tiny font-bold truncate text-text-main" style={{ color: event.color }}>
          {event.title}
        </h5>
        <MoreVertical className="w-2.5 h-2.5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
      </div>
      <div className="flex items-center gap-1 mt-0.5 text-tiny font-medium text-text-muted">
        <Clock className="w-2 h-2" />
        {event.startTime} - {event.endTime}
      </div>
    </div>
  );
}

export default function GoogleCalendar() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-500 text-text-inverted rounded-xl shadow-hard shadow-brand-500/20">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text-main">Day Planner</h2>
            <p className="text-sm text-text-muted font-medium">Monday, Jan 24, 2026</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-surface border border-subtle rounded-xl hover:bg-muted transition-all font-semibold text-sm shadow-soft">
          <Plus className="w-4 h-4 text-brand-500" />
          Add Event
        </button>
      </div>

      <div className="bg-surface rounded-3xl border border-subtle shadow-hard overflow-hidden">
        <div className="relative h-[1440px] select-none">
          {/* Hour Grid Lines */}
          <div className="absolute inset-0">
            {HOURS.map((hour) => (
              <div 
                key={hour.minutes} 
                className="absolute w-full border-t border-subtle flex"
                style={{ top: `${hour.minutes}px`, height: '60px' }}
              >
                <div className="w-[60px] pr-2 text-right -translate-y-2">
                  <span className="text-tiny font-bold text-text-muted uppercase tracking-tighter">
                    {hour.label.split(' ')[0]}
                    <span className="text-tiny opacity-50 ml-0.5">{hour.label.split(' ')[1]}</span>
                  </span>
                </div>
                <div className="flex-1 border-l border-subtle" />
              </div>
            ))}
          </div>

          {/* Events Layer */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="relative h-full pointer-events-auto">
              {processedEvents.map((event, idx) => (
                <EventWidget key={`${event.title}-${idx}`} event={event} />
              ))}
            </div>
          </div>
          
          {/* Current Time Indicator (Dummy Example) */}
          <div 
            className="absolute left-[60px] right-0 border-t-2 border-error z-20 pointer-events-none flex items-center"
            style={{ top: '650px' }}
          >
            <div className="w-2 h-2 rounded-full bg-error -ml-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
