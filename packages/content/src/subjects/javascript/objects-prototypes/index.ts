import { copyingQuestions } from './copying';
import { descriptorsClassesQuestions } from './descriptors-classes';
import { mutabilityDrillsQuestions } from './mutability-drills';
import { prototypesQuestions } from './prototypes';
import type { Topic } from '../../../types';

export const objects: Topic = {
  slug: 'objects-prototypes',
  title: 'Objects, prototypes & classes',
  questions: [...prototypesQuestions, ...copyingQuestions, ...descriptorsClassesQuestions, ...mutabilityDrillsQuestions],
};
