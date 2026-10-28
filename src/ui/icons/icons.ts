import {
  Accessibility,
  Atom,
  Braces,
  Code2,
  FileType2,
  FlaskConical,
  Hammer,
  Layers,
  type LucideIcon,
  type LucideProps,
  Network,
  Palette,
  Puzzle,
  Server,
  ShieldCheck,
  Workflow,
} from 'lucide-react';
import { createElement } from 'react';

// Subjects name their icon as a string so content files don't import React.
const SUBJECT_ICONS: Record<string, LucideIcon> = {
  braces: Braces,
  'file-type': FileType2,
  atom: Atom,
  layers: Layers,
  accessibility: Accessibility,
  palette: Palette,
  workflow: Workflow,
  puzzle: Puzzle,
  network: Network,
  flask: FlaskConical,
  server: Server,
  hammer: Hammer,
  shield: ShieldCheck,
};

export const subjectIcon = (name: string): LucideIcon => SUBJECT_ICONS[name] ?? Code2;

/** Renders a subject's icon by name (decorative by default). */
export function SubjectIcon({ name, ...props }: LucideProps & { name: string }) {
  return createElement(subjectIcon(name), { 'aria-hidden': true, ...props });
}
