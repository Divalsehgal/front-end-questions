// llms.txt (https://llmstxt.org) and llms-full.txt: plain-markdown views of the site for LLMs and
// answer engines. llms.txt is a short map of subjects and topics; llms-full.txt carries every
// question with its answer and explanation, the same text the prerendered pages show (answers sit in
// their collapsed disclosures). Built at build time from the full bank (src/entry-server.tsx).
import { fullEntry } from '../content/loader';
import { ALL, hrefOf, keyOf, SUBJECTS, subjectHref } from '../content/registry';
import { outputLead, questionCount } from './jsonld';
import { AUTHOR, AUTHOR_PROFILES, SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from './site';
import { SITEMAP_INDEX } from './sitemap';
import type { FullEntry } from '../content/registry';
import type { Question } from '../content/types';

export const LLMS_TXT = 'llms.txt';
export const LLMS_FULL_TXT = 'llms-full.txt';

/** A fenced code block whose fence is longer than any backtick run inside the code. */
export function fence(code: string, lang = '') {
  const longest = Math.max(2, ...[...code.matchAll(/`+/g)].map((m) => m[0].length));
  const ticks = '`'.repeat(longest + 1);
  return `${ticks}${lang}\n${code.trimEnd()}\n${ticks}`;
}

const count = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;
const letter = (i: number) => String.fromCodePoint(65 + i);

export function llmsTxt() {
  const lines = [
    `# ${SITE_NAME}`,
    '',
    `> ${SITE_DESCRIPTION}`,
    '',
    `Free, no login, by ${AUTHOR} (${AUTHOR_PROFILES[0]}). ${count(ALL.length, 'question')} across ${count(SUBJECTS.length, 'subject')}. ` +
      'Every question has its own page with the question, the answer and an explanation in the HTML.',
    '',
  ];
  for (const s of SUBJECTS) {
    lines.push(`## ${s.title}`, '', s.blurb, '');
    lines.push(`- [${s.title} interview questions](${absoluteUrl(subjectHref(s.slug))}): ${count(questionCount(s), 'question')}`);
    for (const t of s.topics) lines.push(`- ${t.title}: ${count(t.questions.length, 'question')}`);
    lines.push('');
  }
  lines.push(
    '## Optional',
    '',
    `- [All questions with answers](${SITE_URL}${LLMS_FULL_TXT}): every question, answer and explanation in one markdown file`,
    `- [Sitemap](${SITE_URL}${SITEMAP_INDEX}): every question page`,
    '',
  );
  return lines.join('\n');
}

/** The question and its answer as markdown, per kind. */
function questionBody(q: Question): string[] {
  switch (q.kind) {
    case 'quiz': {
      const correct = new Set(Array.isArray(q.answer) ? q.answer : [q.answer]);
      return [
        q.prompt,
        ...(q.code ? [fence(q.code, 'ts')] : []),
        q.options.map((o, i) => `${letter(i)}. ${o}`).join('\n'),
        `**Answer:** ${[...correct].map((i) => `${letter(i)}. ${q.options[i]}`).join('; ')}`,
        `**Why:** ${q.why}`,
      ];
    }
    case 'flashcard':
      return [q.front, ...(q.code ? [fence(q.code, 'ts')] : []), `**Answer:**\n\n${q.back}`];
    case 'order':
      return [q.prompt, `**Correct order:**\n\n${q.items.map((item, i) => `${i + 1}. ${item}`).join('\n')}`, `**Why:** ${q.why}`];
    case 'output':
      return [outputLead(q.lang), fence(q.code, q.lang ?? 'js'), `**Explanation:** ${q.why}`];
    case 'code':
      return [q.prompt, ...(q.solution ? ['**Reference solution:**', fence(q.solution, 'ts')] : [])];
    case 'ui':
      return [
        q.prompt,
        `**Requirements:**\n\n${q.requirements.map((r) => `- ${r}`).join('\n')}`,
        ...(q.solution ? ['**Reference solution:**', fence(q.solution, q.framework === 'react' ? 'tsx' : 'html')] : []),
      ];
  }
}

function questionSection(e: FullEntry) {
  return [`### ${e.q.title}`, `Source: ${absoluteUrl(hrefOf(e.key))}`, ...questionBody(e.q)].join('\n\n');
}

export function llmsFullTxt() {
  const parts = [`# ${SITE_NAME}: all questions with answers`, `> ${SITE_DESCRIPTION}`, `By ${AUTHOR}. Source: ${SITE_URL}`];
  for (const s of SUBJECTS) {
    parts.push(`# ${s.title}`, s.blurb);
    for (const t of s.topics) {
      parts.push(`## ${t.title}`);
      for (const q of t.questions) {
        const e = fullEntry(keyOf(s.slug, q.id));
        if (e) parts.push(questionSection(e));
      }
    }
  }
  return `${parts.join('\n\n')}\n`;
}
