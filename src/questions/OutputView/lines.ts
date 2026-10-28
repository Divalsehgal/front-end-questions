import { linesMatch } from '../../runtime/format';

/** The answer as lines, with trailing whitespace and trailing blank lines dropped. */
export const toLines = (text: string) => {
  const lines = text.split('\n').map((l) => l.trimEnd());
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
  return lines;
};

export const allLinesMatch = (mine: string[], real: string[]) => mine.length === real.length && real.every((line, i) => linesMatch(mine[i], line));
