import { idsStoresRulesQuestions } from './ids-stores-rules';
import { layoutAndConcurrencyQuestions } from './layout-and-concurrency';
import type { Topic } from '../../../../types';

export const hooksAdvanced: Topic = {
  slug: 'hooks-advanced',
  title: 'Hooks: layout, concurrent & rules',
  questions: [...layoutAndConcurrencyQuestions, ...idsStoresRulesQuestions],
};
