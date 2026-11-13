import { useMemoCallbackQuestions } from './use-memo-callback';
import { useRefQuestions } from './use-ref';
import type { Topic } from '../../../../types';

export const hooksRefsMemo: Topic = {
  slug: 'hooks-refs-memo',
  title: 'Hooks: useRef, useMemo & useCallback',
  questions: [...useRefQuestions, ...useMemoCallbackQuestions],
};
