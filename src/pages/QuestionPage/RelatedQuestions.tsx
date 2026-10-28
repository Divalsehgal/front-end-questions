import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ALL, hrefOf, subjectHref, type Entry } from '../../content/registry';
import { KIND_META } from '../../questions/kinds';
import { Card, DifficultyBadge, inline, List } from '../../ui';

/** Previous / next question in the subject's order. */
export function neighbours(entry: Entry) {
  const list = ALL.filter((e) => e.subject.slug === entry.subject.slug);
  const i = list.findIndex((e) => e.key === entry.key);
  return { prev: list[i - 1] as Entry | undefined, next: list[i + 1] as Entry | undefined };
}

/** Up to `limit` other questions from the same topic, starting after this one (wrapping around). */
export function relatedTo(entry: Entry, limit = 5) {
  const list = ALL.filter((e) => e.subject.slug === entry.subject.slug && e.topic.slug === entry.topic.slug);
  const i = list.findIndex((e) => e.key === entry.key);
  return [...list.slice(i + 1), ...list.slice(0, i)].slice(0, limit);
}

const linkClass = 'flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-surface-muted';

/** Crawlable internal links: real <a href>s to neighbouring and related questions. */
export function RelatedQuestions({ entry }: { entry: Entry }) {
  const { prev, next } = neighbours(entry);
  const related = relatedTo(entry);
  return (
    <nav aria-labelledby="more-questions" className="mt-12 border-t border-line pt-6">
      <h2 id="more-questions" className="mb-3 text-lg font-semibold">
        More {entry.subject.title} questions
      </h2>
      <div className="mb-5 grid gap-2 sm:grid-cols-2">
        {prev && (
          <Link to={hrefOf(prev.key)} className={linkClass}>
            <ArrowLeft size={16} aria-hidden className="shrink-0" />
            <span className="min-w-0">
              <span className="block text-xs text-text-muted">Previous</span>
              {inline(prev.q.title)}
            </span>
          </Link>
        )}
        {next && (
          <Link to={hrefOf(next.key)} className={`${linkClass} sm:col-start-2 sm:justify-end sm:text-right`}>
            <span className="min-w-0">
              <span className="block text-xs text-text-muted">Next</span>
              {inline(next.q.title)}
            </span>
            <ArrowRight size={16} aria-hidden className="shrink-0" />
          </Link>
        )}
      </div>
      {related.length > 0 && (
        <>
          <h3 className="mb-2 text-sm font-semibold text-text-muted">Related: {inline(entry.topic.title)}</h3>
          <Card>
            <List label="Related questions">
              {related.map((e) => (
                <li key={e.key}>
                  <Link to={hrefOf(e.key)} className="flex min-h-11 items-center gap-3 px-5 py-2 text-sm hover:bg-surface-muted">
                    <span className="min-w-0 flex-1">{inline(e.q.title)}</span>
                    <span className="shrink-0 text-xs text-text-muted">{KIND_META[e.q.kind].label}</span>
                    <DifficultyBadge difficulty={e.q.difficulty} />
                  </Link>
                </li>
              ))}
            </List>
          </Card>
        </>
      )}
      <p className="mt-4 text-sm">
        <Link to={subjectHref(entry.subject.slug)} className="text-brand-strong underline underline-offset-2">
          All {entry.subject.title} interview questions
        </Link>
      </p>
    </nav>
  );
}
