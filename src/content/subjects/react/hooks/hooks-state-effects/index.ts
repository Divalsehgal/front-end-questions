import { useEffectQuestions } from './use-effect';
import { useStateQuestions } from './use-state';
import type { Topic } from '../../../../types';

export const hooksStateEffects: Topic = {
  slug: 'hooks-state-effects',
  title: 'Hooks: useState & useEffect',
  questions: [...useStateQuestions, ...useEffectQuestions],
};
