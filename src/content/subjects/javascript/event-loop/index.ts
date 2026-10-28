import { asyncPatternsQuestions } from './async-patterns';
import { combinatorsPolyfillsQuestions } from './combinators-polyfills';
import { promiseOutputQuestions } from './promise-output';
import type { Topic } from '../../../types';

export const eventLoop: Topic = {
  slug: 'event-loop',
  title: 'Event loop & async',
  questions: [...promiseOutputQuestions, ...asyncPatternsQuestions, ...combinatorsPolyfillsQuestions],
};
