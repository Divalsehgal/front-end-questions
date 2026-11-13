import { closuresQuestions } from './closures';
import { scopeTrapsQuestions } from './scope-traps';
import type { Topic } from '../../../types';

export const closures: Topic = {
  slug: 'closures-scope',
  title: 'Closures & scope',
  questions: [...closuresQuestions, ...scopeTrapsQuestions],
};
