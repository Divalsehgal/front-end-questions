import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { subjectForPath, useSubject } from '../content/loader';
import { applyHead } from './head';
import { pageMeta } from './meta';

/** Keeps <title>, meta description, canonical, Open Graph and JSON-LD in sync with the route. */
export function Seo() {
  const { pathname } = useLocation();
  // A question page's meta comes from its full question: wait until its subject has loaded.
  const needs = subjectForPath(pathname);
  const subject = useSubject(needs);
  const waiting = !!needs && !subject;
  useEffect(() => {
    if (!waiting) applyHead(pageMeta(pathname));
  }, [pathname, waiting]);
  return null;
}
