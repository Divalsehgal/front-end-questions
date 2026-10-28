import { Link } from 'react-router-dom';
import { hrefOf, keyOf } from '../../content/registry';
import { KIND_META } from '../../questions/kinds';
import { Card, DifficultyBadge, inline, List, ProgressBar, StatusDot } from '../../ui';
import type { QuestionMeta, TopicMeta } from '../../content/types';
import type { Attempt } from '../../state/progress';

export function TopicCard({
  subject,
  topic,
  questions,
  progress,
}: Readonly<{
  subject: string;
  topic: TopicMeta;
  questions: QuestionMeta[];
  progress: Record<string, Attempt>;
}>) {
  const keys = questions.map((q) => keyOf(subject, q.id));
  const done = keys.filter((k) => progress[k]?.status === 'correct').length;
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-4 px-5 pt-4 pb-3">
        <h2 className="font-semibold">{inline(topic.title)}</h2>
        <span className="ml-auto shrink-0 text-sm text-text-muted">
          {done} / {keys.length}
        </span>
      </div>
      <div className="px-5 pb-3">
        <ProgressBar value={done} total={keys.length} label={`${topic.title} progress`} />
      </div>
      <div className="border-t border-line">
        <List>
          {questions.map((q) => {
            const key = keyOf(subject, q.id);
            const Icon = KIND_META[q.kind].icon;
            return (
              <li key={q.id}>
                <Link to={hrefOf(key)} className="flex items-center gap-3 px-5 py-3 text-sm hover:bg-surface-muted">
                  <StatusDot attempt={progress[key]} />
                  <Icon size={14} role="img" className="shrink-0 text-text-muted" aria-label={KIND_META[q.kind].label} />
                  <span className="min-w-0 flex-1 truncate">{inline(q.title)}</span>
                  <DifficultyBadge difficulty={q.difficulty} />
                </Link>
              </li>
            );
          })}
        </List>
      </div>
    </Card>
  );
}
