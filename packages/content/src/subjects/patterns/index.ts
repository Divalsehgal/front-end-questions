import { creational } from './creational';
import { lld } from './lld';
import { principles } from './principles';
import { structuralBehavioral } from './structural-behavioral';
import type { Subject } from '../../types';

export const patterns: Subject = {
  slug: 'patterns',
  title: 'Design patterns & principles',
  blurb: 'GoF patterns the JavaScript way (creational, structural, behavioral), SOLID, DRY/KISS/YAGNI, and a low-level design exercise.',
  icon: 'puzzle',
  topics: [creational, structuralBehavioral, principles, lld],
};
