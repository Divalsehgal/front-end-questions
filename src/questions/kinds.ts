import { Code2, Layers, LayoutTemplate, ListChecks, ListOrdered, type LucideIcon, Terminal } from 'lucide-react';
import type { Kind } from '../content/types';

export type KindMeta = { label: string; plural: string; icon: LucideIcon; blurb: string };

// How each kind is named and drawn in lists. Light on purpose: every page imports it, while the
// views that answer each kind load on demand (./registry).
export const KIND_META: Record<Kind, KindMeta> = {
  quiz: { label: 'Quiz', plural: 'Quizzes', icon: ListChecks, blurb: 'Multiple choice with explanations' },
  output: { label: 'Output', plural: 'Guess the output', icon: Terminal, blurb: 'Predict what code logs; the engine marks it' },
  code: { label: 'Code', plural: 'Coding drills', icon: Code2, blurb: 'Implement it; tests and type checks run in your browser' },
  ui: { label: 'Build UI', plural: 'Machine coding', icon: LayoutTemplate, blurb: 'Build a working UI with a live preview' },
  flashcard: { label: 'Flashcard', plural: 'Flashcards', icon: Layers, blurb: 'Recall a concept, reveal, rate yourself' },
  order: { label: 'Order', plural: 'Put in order', icon: ListOrdered, blurb: 'Arrange steps in the right sequence' },
};

export const KIND_ORDER: Kind[] = ['output', 'quiz', 'code', 'ui', 'flashcard', 'order'];
