import type { Topic } from '../../types';

export const documentTopic: Topic = {
  slug: 'document',
  title: 'Document, semantics & the head',
  questions: [
    {
      kind: 'quiz',
      id: 'doc-q1',
      title: 'What the skeleton tags do',
      prompt: 'Which statements about the HTML skeleton are true?',
      options: [
        '`<!DOCTYPE html>` puts the browser in standards mode (no quirks mode)',
        '`<html lang="en">` lets screen readers pick the right pronunciation and helps search engines',
        '`<meta name="viewport" content="width=device-width, initial-scale=1">` is required for responsive layouts on mobile',
        '`<meta charset="UTF-8">` should go at the end of the head',
      ],
      answer: [0, 1, 2],
      why: 'The doctype switches on standards mode, `lang` tells screen readers which pronunciation rules to use (and helps search and translation), and the viewport meta stops mobile browsers from rendering a ~980px desktop page zoomed out. **Not charset at the end:** it must appear within the first 1024 bytes, before any text the browser has to decode, so it goes first in the head.',
    },
    {
      kind: 'quiz',
      id: 'doc-q2',
      title: 'div vs section vs article',
      prompt: 'A blog index lists post previews, each of which could be syndicated on its own. Which markup fits best?',
      options: [
        '`<section>` with a heading, containing one `<article>` per post',
        'A `<div>` per post with `class="article"`',
        'One `<article>` wrapping all posts',
        '`<aside>` per post',
      ],
      answer: 0,
      why: 'Each preview is self-contained and could be syndicated on its own, which is exactly `<article>`; the list as a whole is a thematic group with a heading, which is `<section>`. **Not a div with class=article:** a class carries no semantics for assistive tech. **Not one article around all posts:** the individual posts are the self-contained units. **Not aside:** that is for tangential content (sidebars, callouts). A named `<section>` also becomes a region landmark.',
    },
    {
      kind: 'quiz',
      id: 'doc-q3',
      title: 'Void elements',
      prompt: 'Which of these are void elements (no children, no closing tag)?',
      options: ['`<img>`', '`<input>`', '`<br>` and `<hr>`', '`<textarea>`'],
      answer: [0, 1, 2],
      why: "Void elements can't have children and have no closing tag: `area, base, br, col, embed, hr, img, input, link, meta, source, track, wbr`, so `<img>`, `<input>`, `<br>` and `<hr>` all qualify. **Not textarea:** its text content is its default value, so it needs `</textarea>`. The trailing `/>` on void elements is optional in HTML.",
    },
    {
      kind: 'quiz',
      id: 'doc-q4',
      title: 'DOM vs BOM',
      prompt: 'Which belongs to the BOM (Browser Object Model) rather than the DOM?',
      options: ['`window.location` and `history`', '`document.querySelector`', '`element.classList`', '`document.createElement`'],
      answer: 0,
      why: 'The BOM is the browser around the document: `window.location`, `history`, `navigator`, `screen`, timers. **Not querySelector, classList, createElement:** all three operate on the document tree (`document` and its element nodes), which is the DOM.',
    },
    {
      kind: 'flashcard',
      id: 'doc-f1',
      title: 'Semantic tags worth knowing',
      front:
        'Name the semantic element for: a caption on an image, a term/definition list, the title of a creative work, subtitles for a video, and bidirectional text.',
      back: `- \`<figure>\` + \`<figcaption>\`: image (or code, chart) with a caption
- \`<dl>\`, \`<dt>\`, \`<dd>\`: terms and definitions (\`<dfn>\` marks a defined term inline)
- \`<cite>\`: title of a book, film or article
- \`<track kind="subtitles">\` inside \`<video>\`
- \`<bdi>\` / \`<bdo>\`: isolate or override text direction (user names in mixed RTL/LTR)

Plus the landmarks: \`header\`, \`nav\`, \`main\`, \`aside\`, \`footer\`.`,
    },
    {
      kind: 'flashcard',
      id: 'doc-f2',
      title: 'Separation of concerns',
      front: 'Why keep structure, presentation and behaviour separate in a vanilla project?',
      back: `HTML = **structure and meaning**, CSS = **presentation**, JS = **behaviour**. Keeping them apart (and even splitting data from rendering logic in JS) means each can change without breaking the others, semantics and accessibility come from HTML rather than scripts, and the page still works (and stays readable) when CSS or JS fails to load.`,
    },
  ],
};
