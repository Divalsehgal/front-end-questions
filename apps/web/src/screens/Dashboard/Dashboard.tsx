'use client';
import { ALL, hrefOf } from '@fe-grind/content/registry';
import { buttonClass, Card, inline, Page, PageHeader, SectionTitle, Stat, useNow } from '@fe-grind/ui';
import { ArrowRight, RotateCcw, Timer } from 'lucide-react';
import Link from 'next/link';
import { ArchitectureWidget } from '../../architecture/ArchitectureWidget';
import { useProfile } from '../../state/profile';
import { isDue, useProgress } from '../../state/progress';
import { SubjectStrip } from './SubjectRow';
import { weakTopics } from './weakTopics';

function greeting(started: boolean, name: string) {
  if (started) return name ? `Keep the streak going, ${name}` : 'Keep the streak going';
  return name ? `Let's get started, ${name}` : 'Front End Grind: frontend interview practice';
}

export function Dashboard() {
  const progress = useProgress();
  const attempted = ALL.filter((e) => progress[e.key]);
  const solved = attempted.filter((e) => progress[e.key].status === 'correct');
  const firstTry = attempted.filter((e) => progress[e.key].firstTry).length;
  const now = useNow(60_000);
  const due = ALL.filter((e) => isDue(progress[e.key], now)).length;
  const nextUp = ALL.find((e) => !progress[e.key]) ?? ALL.find((e) => progress[e.key]?.status === 'wrong');
  const weak = weakTopics(progress);
  const name = useProfile().name.trim();

  return (
    <Page>
      <PageHeader
        title={greeting(attempted.length > 0, name)}
        description="Front End Grind is free frontend interview practice with no login: JavaScript, TypeScript, React, Next.js, CSS, accessibility, DSA, system design, security, testing and Node.js. Output questions are marked by the real JS engine, coding drills by test suites, and anything you miss comes back in Review."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat value={`${solved.length} / ${ALL.length}`} label="Solved" />
        <Stat value={attempted.length ? `${Math.round((firstTry / attempted.length) * 100)}%` : '–'} label="First-try accuracy" />
        <Stat value={due} label="Due for review" />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {nextUp && (
          <Link href={hrefOf(nextUp.key)} className={buttonClass('primary')}>
            {attempted.length ? 'Continue where you left off' : 'Start with the first question'} <ArrowRight size={16} aria-hidden />
          </Link>
        )}
        {due > 0 && (
          <Link href="/review" className={buttonClass('secondary')}>
            <RotateCcw size={16} aria-hidden /> Review {due} due
          </Link>
        )}
        <Link href="/mock" className={buttonClass('secondary')}>
          <Timer size={16} aria-hidden /> Mock round
        </Link>
      </div>

      <SectionTitle id="subjects">Subjects</SectionTitle>
      <SubjectStrip progress={progress} labelledBy="subjects" />

      {weak.length > 0 && (
        <>
          <SectionTitle id="weak-topics">Weakest topics</SectionTitle>
          <Card>
            <ul className="divide-y divide-line" aria-labelledby="weak-topics">
              {weak.map((w) => (
                <li key={`${w.subject.slug}-${w.topic.slug}`}>
                  <Link href={hrefOf(w.first)} className="flex items-center gap-3 px-5 py-3 text-sm hover:bg-surface-muted">
                    <span className="font-medium">{inline(w.topic.title)}</span>
                    <span className="text-text-muted">· {w.subject.title}</span>
                    <span className="ml-auto rounded-full bg-error-soft px-2 py-0.5 text-xs font-medium text-error">{w.wrong} missed</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}

      <SectionTitle>Under the hood</SectionTitle>
      <ArchitectureWidget />
    </Page>
  );
}
