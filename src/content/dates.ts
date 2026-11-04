// Real publish / update dates for each question, from git history (read at build time by
// vite-plugins/content-manifest.ts). Nothing here invents a date: a question git doesn't know gets none.

export type QuestionDates = { published: string; modified: string };

/** The git command whose output `contentDates` parses: oldest commit first, only added/removed lines. */
export const DATES_LOG_ARGS = ['log', '--reverse', '--format=@%cs', '-p', '--unified=0', '--no-renames', '--', 'src/content/subjects'];

const COMMIT = /^@(\d{4}-\d{2}-\d{2})$/;
const ADDED_ID = /^\+\s*id: ['"]([^'"]+)['"]/;
const ID = /^[ \t]*id: ['"]([^'"]+)['"]/gm;
const slugOf = (path: string) => /^src\/content\/subjects\/([^/]+)\//.exec(path)?.[1];

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
      file = line.startsWith('+++ b/') ? line.slice(6) : '';
      if (file) touched.set(file, date);
    } else if (file) {
      const id = ADDED_ID.exec(line)?.[1];
      const key = id && `${slugOf(file)}:${id}`;
      if (key && !added.has(key)) added.set(key, date);
    }
  }
  return { added, touched };
}
