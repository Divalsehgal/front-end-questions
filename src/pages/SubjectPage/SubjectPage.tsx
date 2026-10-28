import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ALL, getSubject, hrefOf, type Entry } from '../../content/registry';
import { KIND_ORDER, KIND_META } from '../../questions/kinds';
import { useProgress } from '../../state/progress';
import { buttonClass, Chips, inline, Page, PageHeader } from '../../ui';
import { TopicCard } from './TopicCard';
import type { Kind } from '../../content/types';

function kindOptions(entries: Entry[]) {
  const kinds = KIND_ORDER.filter((k) => entries.some((e) => e.q.kind === k));
  return [
    { value: 'all' as const, label: `All · ${entries.length}` },
    ...kinds.map((k) => {
      const Icon = KIND_META[k].icon;
      return {
        value: k,
        label: (
          <>
            <Icon size={12} aria-hidden /> {KIND_META[k].plural} · {entries.filter((e) => e.q.kind === k).length}
          </>
        ),
      };
    }),
  ];
}

export function SubjectPage() {
  const { subject: slug } = useParams<{ subject: string }>();
  const subject = getSubject(slug ?? '');
  const progress = useProgress();
  const [kind, setKind] = useState<Kind | 'all'>('all');
  if (!subject) return <Navigate to="/" replace />;

  const entries = ALL.filter((e) => e.subject.slug === subject.slug);
  const solved = entries.filter((e) => progress[e.key]?.status === 'correct').length;
  const visible = entries.filter((e) => kind === 'all' || e.q.kind === kind);
  const firstOpen = visible.find((e) => progress[e.key]?.status !== 'correct') ?? visible[0];
  const options = kindOptions(entries);

  return (
    <Page width="narrow">
      <PageHeader
        title={subject.title}
        description={
          <>
            <p>{inline(subject.blurb)}</p>
            <p className="mt-2 text-sm">
              {solved} of {entries.length} solved
            </p>
          </>
        }
        actions={
          firstOpen && (
            <Link to={hrefOf(firstOpen.key)} className={buttonClass('primary')}>
              {solved ? 'Continue' : 'Start'} <ArrowRight size={16} aria-hidden />
            </Link>
          )
        }
      />

      {options.length > 2 && (
        <div className="mb-5">
          <Chips label="Filter by question type" value={kind} onChange={setKind} options={options} />
        </div>
      )}

      <div className="space-y-5">
        {subject.topics.map((topic) => {
          const questions = topic.questions.filter((q) => kind === 'all' || q.kind === kind);
          if (!questions.length) return null;
          return <TopicCard key={topic.slug} subject={subject.slug} topic={topic} questions={questions} progress={progress} />;
        })}
      </div>
    </Page>
  );
}
