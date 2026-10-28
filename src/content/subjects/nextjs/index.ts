import { architecture } from './architecture';
import { caching } from './caching';
import { mutations } from './mutations';
import { renderingTopic } from './rendering';
import { routingState } from './routing-state';
import type { Subject } from '../../types';

export const nextjs: Subject = {
  slug: 'nextjs',
  title: 'Next.js',
  blurb:
    'Server Components and hydration, App Router layouts, Server Actions, caching (HTTP, Data Cache, Full Route Cache, Router Cache), and per-component rendering decisions.',
  icon: 'layers',
  topics: [renderingTopic, routingState, mutations, caching, architecture],
};
