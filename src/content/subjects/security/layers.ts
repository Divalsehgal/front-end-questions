import type { Topic } from '../../types';

export const layersTopic: Topic = {
  slug: 'layers',
  title: 'The layered model',
  questions: [
    {
      kind: 'order',
      id: 'sec-o1',
      title: 'The security layers',
      prompt: 'Order the layers a request passes through, from first to last.',
      items: [
        'Input',
        'Authentication',
        'Authorization',
        'Request validation (CSRF)',
        'Browser controls (headers)',
        'Backend services (SSRF)',
        'Abuse prevention',
      ],
      why: 'Each layer exists because the one before it can fail. Escaping input does not stop IDOR, and auth does not stop CSRF, so no single control is enough.',
    },
    {
      kind: 'flashcard',
      id: 'sec-f1',
      title: 'Web security in one answer',
      front: '"How do you secure a web app?" Answer in under a minute, layer by layer.',
      back: `| Layer | Attack | Defence |
| --- | --- | --- |
| Input | XSS, SQL injection | Escaping, parameterized queries |
| Authentication | Token theft | Access token in memory, refresh token in an HttpOnly cookie |
| Authorization | IDOR | Server-side ownership check |
| Request trust | CSRF | SameSite cookies, CSRF token |
| Browser | Clickjacking, MIME sniffing | Security headers |
| Server | SSRF, misconfiguration | Host allowlist, secure defaults |
| System | Brute force, bad packages | Rate limiting, dependency scanning |

XSS comes first because once an attacker runs JavaScript on your page they can act as the user, and most other client-side protections stop mattering.`,
    },
  ],
};
