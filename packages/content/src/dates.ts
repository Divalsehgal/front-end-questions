// Real publish / update dates for each question, from git history (read at build time by
// scripts/generate.mjs). Nothing here invents a date: a question git doesn't know gets none.

export type QuestionDates = { published: string; modified: string };

/** Where the subjects live, repo-relative, and where they lived before the move to packages/content. */
export const SUBJECTS_PATH = 'packages/content/src/subjects';
const LEGACY_PATH = 'src/content/subjects';

/**
 * The git command whose output `contentDates` parses (run from the repo root): oldest commit first, only
 * added/removed lines. Renames are followed (-M), so moving a file is not an edit, and the legacy path keeps
 * the history from before the move.
 */
export const DATES_LOG_ARGS = ['log', '--reverse', '--format=@%cs', '-p', '--unified=0', '-M', '--', SUBJECTS_PATH, LEGACY_PATH];

const COMMIT = /^@(\d{4}-\d{2}-\d{2})$/;
const ADDED_ID = /^\+\s*id: ['"]([^'"]+)['"]/;
const ID = /^[ \t]*id: ['"]([^'"]+)['"]/gm;
const slugOf = (path: string) => /^packages\/content\/src\/subjects\/([^/]+)\//.exec(path)?.[1];
/** A path from before the move, as it is named now. */
const current = (path: string) => (path.startsWith(`${LEGACY_PATH}/`) ? SUBJECTS_PATH + path.slice(LEGACY_PATH.length) : path);

/**
 * `log` is the output of `git DATES_LOG_ARGS`; `files` maps each current content file (repo-relative) to its text.
 * published = the first commit that added the question's `id:` line; modified = the last commit touching the
 * file that defines it now (file-level: an edit elsewhere in the file counts too).
 */
export function contentDates(log: string, files: Record<string, string>) {
  const { added, touched } = parseLog(log);
  const dates: Record<string, QuestionDates> = {};
  for (const [path, text] of Object.entries(files)) {
    const modified = touched.get(path);
    for (const [, id] of text.matchAll(ID)) {
      const key = `${slugOf(path)}:${id}`;
      const published = added.get(key);
      if (published && modified) dates[key] = { published, modified: modified < published ? published : modified };
    }
  }
  return dates;
}

/** First date each "subject:id" line was added, and the last date each file was touched. */
function parseLog(log: string) {
  const added = new Map<string, string>();
  const touched = new Map<string, string>();
  let date = '';
  let file = '';
  for (const line of log.split('\n')) {
    const commit = COMMIT.exec(line);
    if (commit) date = commit[1];
    else if (line.startsWith('+++ ')) {
      file = line.startsWith('+++ b/') ? current(line.slice(6)) : '';
      if (file) touched.set(file, date);
    } else if (file) {
      const id = ADDED_ID.exec(line)?.[1];
      const key = id && `${slugOf(file)}:${id}`;
      if (key && !added.has(key)) added.set(key, date);
    }
  }
  return { added, touched };
}
