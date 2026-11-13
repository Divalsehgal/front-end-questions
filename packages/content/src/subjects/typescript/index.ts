import { additions } from './additions';
import { genericsUtility } from './generics-utility';
import { narrowing } from './narrowing';
import { reactTypescript } from './react-typescript';
import { reactTsQuestions } from './react-with-ts';
import { reactTsQuestions2 } from './react-with-ts-2';
import { reactTsCodeQuestions } from './react-with-ts-code';
import { typeSystem } from './type-system';
import type { Subject } from '../../types';

// Questions ported from the tsPractice repo are spread into the existing topics they belong to.
export const typescript: Subject = {
  slug: 'typescript',
  title: 'TypeScript',
  blurb: 'The type system interviewers probe: unknown vs any vs never, generics, utility and conditional types, narrowing, and typing React.',
  icon: 'file-type',
  topics: [
    { ...typeSystem, questions: [...typeSystem.questions, ...additions['type-system']] },
    { ...genericsUtility, questions: [...genericsUtility.questions, ...additions['generics-utility']] },
    narrowing,
    {
      ...reactTypescript,
      questions: [...reactTypescript.questions, ...reactTsQuestions, ...reactTsQuestions2, ...reactTsCodeQuestions],
    },
  ],
};
