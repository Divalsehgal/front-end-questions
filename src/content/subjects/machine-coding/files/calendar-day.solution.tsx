export interface EventData {
  startTime: string; // "HH:mm"
  endTime: string;
  title: string;
}

const EVENTS: EventData[] = [
  { startTime: '00:00', endTime: '01:30', title: 'Team sync' },
  { startTime: '03:30', endTime: '07:30', title: 'Project planning' },
  { startTime: '04:30', endTime: '08:30', title: 'Focus time' },
  { startTime: '06:30', endTime: '09:00', title: 'Client demo' },
  { startTime: '09:30', endTime: '10:30', title: 'Status update' },
  { startTime: '11:00', endTime: '13:30', title: 'Lunch' },
  { startTime: '12:00', endTime: '13:30', title: 'Interview' },
  { startTime: '15:00', endTime: '17:00', title: 'All hands' },
  { startTime: '16:00', endTime: '17:00', title: 'Design review' },
  { startTime: '18:00', endTime: '19:00', title: 'Product sync' },
  { startTime: '20:30', endTime: '22:30', title: 'Evening call' },
];

const COLUMN_OFFSET = 90; // px each overlapping event moves to the right

const timeToMinutes = (time: string) => {
  const [hour, minutes] = time.split(':').map(Number);
  return hour * 60 + minutes;
};

// Give every event a column. Walk the events in start order and put each one in the first
// column whose last event has already ended. Events that overlap end up in different columns.
function addColumns(events: EventData[]) {
  const sorted = events
    .map((event) => ({ ...event, start: timeToMinutes(event.startTime), end: timeToMinutes(event.endTime), column: 0 }))
    .sort((a, b) => a.start - b.start);

  const columnEnds: number[] = []; // when the last event in each column ends
  for (const event of sorted) {
    let column = 0;
    while (columnEnds[column] > event.start) {
      column++; // this column is still busy
    }
    columnEnds[column] = event.end;
    event.column = column;
  }
  return sorted;
}

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 === 0 ? 12 : i % 12;
  return { label: `${hour} ${i < 12 ? 'AM' : 'PM'}`, minutes: i * 60 };
});

export default function CalendarDay() {
  const events = addColumns(EVENTS);

  return (
    <div className="mx-auto max-w-2xl p-6">
      {/* 1 minute = 1px, so the day is 1440px tall */}
      <div className="relative h-[1440px] rounded-lg border border-border-subtle bg-surface">
        {HOURS.map((hour) => (
          <div key={hour.minutes} className="absolute inset-x-0 border-t border-border-subtle" style={{ top: hour.minutes }}>
            <span className="ml-2 text-xs text-text-muted">{hour.label}</span>
          </div>
        ))}

        {events.map((event) => (
          <div
            key={event.title}
            className="absolute right-2 overflow-hidden rounded-md border-l-4 border-brand-500 bg-brand-50 p-1.5 shadow-soft"
            style={{
              top: event.start,
              height: event.end - event.start,
              left: 60 + event.column * COLUMN_OFFSET, // 60px for the hour labels
            }}
          >
            <p className="truncate text-xs font-semibold text-brand-700">{event.title}</p>
            <p className="text-xs text-text-muted">
              {event.startTime} – {event.endTime}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
