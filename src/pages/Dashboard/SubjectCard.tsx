import { Link } from 'react-router-dom';
import { ALL, subjectHref } from '../../content/registry';
import { KIND_ORDER, KIND_META } from '../../questions/kinds';
import { Card, inline, ProgressBar, SubjectIcon } from '../../ui';
import type { SubjectMeta } from '../../content/types';
import type { Attempt } from '../../state/progress';

export function SubjectCard({ subject, progress }: Readonly<{ subject: SubjectMeta; progress: Record<string, Attempt> }>) {
  const items = ALL.filter((e) => e.subject.slug === subject.slug);
  const done = items.filter((e) => progress[e.key]?.status === 'correct').length;
  const kinds = KIND_ORDER.filter((k) => items.some((e) => e.q.kind === k));
  return (
    <Link to={subjectHref(subject.slug)} className="group rounded-xl">
      <Card interactive className="flex h-full flex-col p-5">
        <div className="mb-4 flex items-start justify-between">
          <span aria-hidden className="grid size-10 place-items-center rounded-lg bg-brand-soft text-brand-strong">
            <SubjectIcon name={subject.icon} size={18} />
          </span>
          <span className="flex gap-1 text-text-muted" role="img" aria-label={`Question types: ${kinds.map((k) => KIND_META[k].label).join(', ')}`}>
            {kinds.map((k) => {
              const KIcon = KIND_META[k].icon;
              return <KIcon key={k} size={14} aria-hidden />;
            })}
          </span>
        </div>
        <h3 className="font-semibold">{subject.title}</h3>
        <p className="mt-1 mb-5 flex-1 text-sm leading-6 text-text-muted">{inline(subject.blurb)}</p>
        <div className="mb-2 flex justify-between text-xs text-text-muted">
          <span>{items.length} questions</span>
          <span>{done} solved</span>
        </div>
        <ProgressBar value={done} total={items.length} label={`${subject.title} progress`} />
      </Card>
    </Link>
  );
}
