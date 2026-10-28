import { authTopic } from './auth';
import { csrfHeaders } from './csrf-headers';
import { layersTopic } from './layers';
import { serverAbuse } from './server-abuse';
import { xssInjection } from './xss-injection';
import type { Subject } from '../../types';

export const security: Subject = {
  slug: 'security',
  title: 'Web security',
  blurb: 'XSS, token storage, IDOR, CSRF, security headers, SSRF and rate limiting: one attack and one defence per layer.',
  icon: 'shield',
  topics: [layersTopic, xssInjection, authTopic, csrfHeaders, serverAbuse],
};
