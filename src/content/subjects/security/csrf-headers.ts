import type { Topic } from '../../types';

export const csrfHeaders: Topic = {
  slug: 'csrf-headers',
  title: 'CSRF & security headers',
  questions: [
    {
      kind: 'quiz',
      id: 'sec-q7',
      title: 'Who is exposed to CSRF?',
      prompt: 'Which apps are open to CSRF if they have no other protection?',
      options: ['Session id in a cookie', 'JWT stored in a cookie', 'JWT sent in an `Authorization: Bearer` header from memory', 'Any app with CORS enabled'],
      answer: [0, 1],
      why: 'CSRF works because the browser attaches cookies automatically, even to requests started by evil.com, so any cookie-based auth is exposed, whether the cookie holds a session id or a JWT. **Not Bearer header from memory:** the browser never adds an Authorization header on its own, so a forged cross-site request arrives unauthenticated. **Not any app with CORS:** CORS controls reading responses; it neither causes nor prevents CSRF.',
    },
    {
      kind: 'quiz',
      id: 'sec-q8',
      title: 'CORS is not CSRF protection',
      prompt: '"We set a strict CORS policy, so we are safe from CSRF." Why is this wrong?',
      options: [
        'CORS controls who can READ the response; a CSRF attack only needs the request to be SENT',
        'CORS only works in Chrome',
        'CORS only applies to GET requests',
        'It is not wrong: strict CORS blocks CSRF',
      ],
      answer: 0,
      why: "CORS decides whether a cross-origin script may READ the response; a CSRF attack only needs the request to be SENT with the cookie, and form posts or `<img>` GETs go out without any CORS check. **Not Chrome-only:** every modern browser enforces CORS. **Not GET-only:** CORS applies to all methods, it just doesn't block simple requests from being sent. **Not 'it is right':** the state change happens even though evil.com can't read the answer. Use SameSite cookies plus a CSRF token.",
    },
    {
      kind: 'quiz',
      id: 'sec-q9',
      title: 'Match the header',
      prompt: 'Which header stops another site from loading your page in an iframe (clickjacking)?',
      options: [
        "`Content-Security-Policy: frame-ancestors 'none'` (or the older `X-Frame-Options: DENY`)",
        '`X-Content-Type-Options: nosniff`',
        '`Strict-Transport-Security: max-age=31536000`',
        '`Referrer-Policy: strict-origin-when-cross-origin`',
      ],
      answer: 0,
      why: "`frame-ancestors 'none'` (or the legacy `X-Frame-Options: DENY`) tells the browser not to render your page inside any frame, which is what clickjacking needs. **Not nosniff:** stops MIME-type guessing. **Not HSTS:** forces HTTPS for future visits. **Not Referrer-Policy:** controls how much of the URL leaks to other sites. Headers turn off unsafe browser defaults; they don't fix bugs.",
    },
    {
      kind: 'flashcard',
      id: 'sec-f3',
      title: 'The header bundle',
      front: 'Name the five security headers you would add to every response and what each one does.',
      back: `- **Content-Security-Policy**: which scripts, styles and frames may load (\`frame-ancestors 'none'\` also stops clickjacking)
- **X-Content-Type-Options: nosniff**: the browser trusts the declared Content-Type instead of guessing
- **Strict-Transport-Security**: always use HTTPS for this site (and subdomains), no downgrade
- **Referrer-Policy: strict-origin-when-cross-origin**: send only the origin to other sites, not the full URL
- **Permissions-Policy: camera=(), microphone=(), geolocation=()**: turn off device APIs you do not use`,
    },
  ],
};
