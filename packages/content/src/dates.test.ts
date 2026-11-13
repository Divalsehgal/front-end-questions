import { describe, expect, it } from 'vitest';
import { contentDates } from './dates';

const log = [
  '@2026-01-01',
  'diff --git a/src/content/subjects/js/a.ts b/src/content/subjects/js/a.ts',
  '--- /dev/null',
  '+++ b/src/content/subjects/js/a.ts',
  '@@ -0,0 +1,2 @@',
  '+  {',
  "+    id: 'one',",
  "+    id: 'two',",
  '@2026-02-01',
  '+++ b/src/content/subjects/js/b.ts',
  "+    id: 'one',", // moved to b.ts: still published on its first day
  "+    id: 'three',",
  '@2026-03-01',
  '+++ b/src/content/subjects/js/a.ts',
  "-    id: 'one',",
  '+    title: "edit"',
  '@2026-04-01',
  '+++ /dev/null',
  "+    id: 'gone',",
].join('\n');

describe('contentDates', () => {
  it('dates each question by the commit that added its id and the last commit to its current file', () => {
    const files = {
      'packages/content/src/subjects/js/a.ts': "id: 'two'",
      'packages/content/src/subjects/js/b.ts': "  id: 'one'\n  id: 'three'\n  id: 'unknown'",
    };
    expect(contentDates(log, files)).toEqual({
      'js:two': { published: '2026-01-01', modified: '2026-03-01' },
      'js:one': { published: '2026-01-01', modified: '2026-02-01' },
      'js:three': { published: '2026-02-01', modified: '2026-02-01' },
    });
  });

  it('carries history across the move to packages/content: a pure rename is not an edit', () => {
    const moved = `${log}\n@2026-05-01\nrename from src/content/subjects/js/a.ts\nrename to packages/content/src/subjects/js/a.ts\n@2026-06-01\n+++ b/packages/content/src/subjects/js/b.ts\n+    title: "edit"`;
    const files = { 'packages/content/src/subjects/js/a.ts': "id: 'two'", 'packages/content/src/subjects/js/b.ts': "id: 'one'" };
    expect(contentDates(moved, files)).toEqual({
      'js:two': { published: '2026-01-01', modified: '2026-03-01' },
      'js:one': { published: '2026-01-01', modified: '2026-06-01' },
    });
  });

  it('gives nothing without history', () => {
    expect(contentDates('', { 'packages/content/src/subjects/js/a.ts': "id: 'x'" })).toEqual({});
  });
});
