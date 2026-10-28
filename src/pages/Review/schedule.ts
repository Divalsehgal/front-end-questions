import { ALL, type Entry } from '../../content/registry';
import { isDue, type Attempt } from '../../state/progress';

export const DAY = 24 * 60 * 60 * 1000;

/** What's due now (most overdue first) and how many come back tomorrow / this week / later. */
export function reviewSchedule(progress: Record<string, Attempt>, now: number, entries: Entry[] = ALL) {
  const due = entries.filter((e) => isDue(progress[e.key], now)).sort((a, b) => progress[a.key].due - progress[b.key].due);
  const ahead = entries.filter((e) => progress[e.key] && !isDue(progress[e.key], now)).map((e) => progress[e.key].due - now);
  const buckets = [
    { label: 'Tomorrow', n: ahead.filter((d) => d <= DAY).length },
    { label: 'This week', n: ahead.filter((d) => d > DAY && d <= 7 * DAY).length },
    { label: 'Later', n: ahead.filter((d) => d > 7 * DAY).length },
  ];
  return { due, buckets };
}
