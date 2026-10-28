import { ArrowRight, Flame, RotateCcw, Target, Timer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ALL, hrefOf, SUBJECTS } from '../../content/registry';
import { isDue, useProgress } from '../../state/progress';
import { buttonClass, Card, inline, Page, PageHeader, SectionTitle, Stat } from '../../ui';
import { SubjectCard } from './SubjectCard';
import { weakTopics } from './weakTopics';

export function Dashboard() {
  const progress = useProgress();
  const attempted = ALL.filter((e) => progress[e.key]);
  const solved = attempted.filter((e) => progress[e.key].status === 'correct');
  const firstTry = attempted.filter((e) => progress[e.key].firstTry).length;
  const due = ALL.filter((e) => isDue(progress[e.key])).length;
  const nextUp = ALL.find((e) => !progress[e.key]) ?? ALL.find((e) => progress[e.key]?.status === 'wrong');
  const weak = weakTopics(progress);

  return (
    <Page>
      <PageHeader
        title={attempted.length ? 'Keep the streak going' : 'Frontend interview grind'}
        description="Output questions are marked by the real JS engine, coding drills by test suites, and anything you miss comes back in Review."
      />
      <p className="-mt-4 mb-8 max-w-3xl text-sm leading-6 text-text-muted">
        FE Grind is free frontend interview practice with no login required. Explore questions across JavaScript, TypeScript, React, Next.js, CSS,
        accessibility, DSA, system design, security, testing, and Node.js. Practise with quizzes, coding challenges, flashcards, and machine coding rounds. Your
        progress stays in your browser.{' '}
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat icon={<Target size={18} />} value={`${solved.length} / ${ALL.length}`} label="Solved" />
        <Stat icon={<Flame size={18} />} value={attempted.length ? `${Math.round((firstTry / attempted.length) * 100)}%` : '–'} label="First-try accuracy" />
        <Stat icon={<RotateCcw size={18} />} value={due} label="Due for review" />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {nextUp && (
          <Link to={hrefOf(nextUp.key)} className={buttonClass('primary')}>
            {attempted.length ? 'Continue where you left off' : 'Start with the first question'} <ArrowRight size={16} aria-hidden />
          </Link>
        )}
        {due > 0 && (
          <Link to="/review" className={buttonClass('secondary')}>
            <RotateCcw size={16} aria-hidden /> Review {due} due
          </Link>
        )}
        <Link to="/mock" className={buttonClass('secondary')}>
          <Timer size={16} aria-hidden /> Mock round
        </Link>
      </div>

      <SectionTitle>Subjects</SectionTitle>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SUBJECTS.map((s) => (
          <SubjectCard key={s.slug} subject={s} progress={progress} />
        ))}
      </div>

      {weak.length > 0 && (
        <>
          <SectionTitle id="weak-topics">Weakest topics</SectionTitle>
          <Card>
            <ul className="divide-y divide-line" aria-labelledby="weak-topics">
              {weak.map((w) => (
                <li key={`${w.subject.slug}-${w.topic.slug}`}>
                  <Link to={hrefOf(w.first)} className="flex items-center gap-3 px-5 py-3 text-sm hover:bg-surface-muted">
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
    </Page>
  );
}
