import { Link } from 'react-router-dom';
import { ALL, hrefOf, subjectHref, type Entry } from '../../content/registry';
import { KIND_META } from '../../questions/kinds';
import { Card, DifficultyBadge, inline, List } from '../../ui';

/** Up to `limit` other questions from the same topic, starting after this one (wrapping around). */
export function relatedTo(entry: Entry, limit = 5) {
  const list = ALL.filter((e) => e.subject.slug === entry.subject.slug && e.topic.slug === entry.topic.slug);
  const i = list.findIndex((e) => e.key === entry.key);
  return [...list.slice(i + 1), ...list.slice(0, i)].slice(0, limit);
}

/** Crawlable internal links (real <a href>s) to other questions in the topic. */
export function RelatedQuestions({ entry }: Readonly<{ entry: Entry }>) {
  const related = relatedTo(entry);
  return (
    <nav aria-labelledby="related-questions" className="mt-12 border-t border-line pt-6">
      <h2 id="related-questions" className="mb-3 text-lg font-semibold">
        Related questions: {inline(entry.topic.title)}
      </h2>
      {related.length > 0 && (
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
      )}
      <p className="mt-4 text-sm">
        <Link to={subjectHref(entry.subject.slug)} className="text-brand-strong underline underline-offset-2">
          All {entry.subject.title} interview questions
        </Link>
      </p>
    </nav>
  );
}
