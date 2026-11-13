import { SUBJECTS } from '../../content/registry';
import type { SubjectMeta, TopicMeta } from '../../content/types';
import type { Attempt } from '../../state/progress';

export type WeakTopic = { subject: SubjectMeta; topic: TopicMeta; wrong: number; first: string };

/** Topics where you've missed the most, so you know what to revise. */
export function weakTopics(progress: Record<string, Attempt>, limit = 5): WeakTopic[] {
  return SUBJECTS.flatMap((subject) =>
    subject.topics.flatMap((topic) => {
      const missed = topic.questions.map((q) => `${subject.slug}:${q.id}`).filter((k) => progress[k]?.status === 'wrong');
      return missed.length ? [{ subject, topic, wrong: missed.length, first: missed[0] }] : [];
    }),
  )
    .sort((a, b) => b.wrong - a.wrong)
    .slice(0, limit);
}
