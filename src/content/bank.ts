// The whole question bank, loaded synchronously: for the build-time prerender (src/entry-server.tsx)
// and tests. Never import this from client code: it would pull every subject into the page's
// initial JS. The client loads subjects on demand through ./loader.
import { provideSubjects } from './loader';
import { entriesFrom } from './registry';
import { SUBJECTS } from './subjects';

provideSubjects(SUBJECTS);

export { SUBJECTS as BANK };
export const BANK_ENTRIES = entriesFrom(SUBJECTS);
