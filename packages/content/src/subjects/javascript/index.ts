import { closures } from './closures-scope';
import { coercion } from './coercion';
import { eventLoop } from './event-loop';
import { generators } from './generators-iterators';
import { hoisting } from './hoisting-tdz';
import { objects } from './objects-prototypes';
import { performance } from './performance-memory';
import { thisBinding } from './this';
import { utilities } from './utilities';
import type { Subject } from '../../types';

export const javascript: Subject = {
  slug: 'javascript',
  title: 'JavaScript',
  blurb: 'The language itself: event loop, closures, `this`, coercion, prototypes, and the classic utilities interviewers ask you to write.',
  icon: 'braces',
  topics: [eventLoop, closures, thisBinding, hoisting, coercion, objects, generators, performance, utilities],
};
