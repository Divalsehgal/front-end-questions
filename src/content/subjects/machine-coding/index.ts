import { algorithmic } from './algorithmic';
import { dataTopic } from './data';
import { domCoordinates } from './dom-coordinates';
import { followUps } from './follow-ups';
import { formsTopic } from './forms';
import { stateTopic } from './state';
import { vanilla } from './vanilla';
import { widgets } from './widgets';
import type { Subject } from '../../types';

export const machineCoding: Subject = {
  slug: 'machine-coding',
  title: 'Machine coding',
  blurb:
    'Build real UIs against a requirements checklist with a live preview: React widgets, forms, async data, state architecture and algorithmic UIs, plus vanilla JS projects. Each has a reference solution.',
  icon: 'hammer',
  topics: [widgets, formsTopic, dataTopic, stateTopic, algorithmic, vanilla, followUps, domCoordinates],
};
