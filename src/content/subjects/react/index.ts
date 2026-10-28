import { hooksAdvanced, hooksReducerContext, hooksRefsMemo, hooksStateEffects } from './hooks';
import { rendering, stateManagement } from './internals';
import type { Subject } from '../../types';

export const react: Subject = {
  slug: 'react',
  title: 'React',
  blurb: 'Hooks behaviour (50 predict-the-render questions), rendering and Fiber internals, and state architecture with Context and Redux.',
  icon: 'atom',
  topics: [hooksStateEffects, hooksRefsMemo, hooksReducerContext, hooksAdvanced, rendering, stateManagement],
};
