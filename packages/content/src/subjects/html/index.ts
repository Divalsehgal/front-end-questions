import { accessibility } from './accessibility';
import { browserTopic } from './browser';
import { documentTopic } from './document';
import { formsTopic } from './forms';
import type { Subject } from '../../types';

export const html: Subject = {
  slug: 'html',
  title: 'HTML, DOM & accessibility',
  blurb:
    'Semantic HTML, the document head, forms, ARIA and keyboard access, and how the browser loads and renders a page. Includes build-it drills with a live preview.',
  icon: 'accessibility',
  topics: [documentTopic, accessibility, formsTopic, browserTopic],
};
