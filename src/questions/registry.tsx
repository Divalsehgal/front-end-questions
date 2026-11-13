import { lazyComponent } from '../ui/lib';
import { KIND_META, KIND_ORDER, type KindMeta } from './kinds';
import type { Kind, Question } from '../content/types';
import type { ViewProps } from './shared';
import type { ComponentType } from 'react';

type KindInfo<K extends Kind> = KindMeta & {
  View: ComponentType<ViewProps<Extract<Question, { kind: K }>>> & { preload: () => Promise<void> };
};

// Each view is its own chunk (an output question never downloads the editor or live preview).
// A view suspends until its chunk is in, on the server and while hydrating too (see lazyComponent).
const VIEWS: { [K in Kind]: KindInfo<K>['View'] } = {
  quiz: lazyComponent(() => import('./QuizView').then((m) => m.QuizView)),
  output: lazyComponent(() => import('./OutputView').then((m) => m.OutputView)),
  code: lazyComponent(() => import('./CodeView').then((m) => m.CodeView)),
  ui: lazyComponent(() => import('./UiView').then((m) => m.UiView)),
  flashcard: lazyComponent(() => import('./FlashcardView').then((m) => m.FlashcardView)),
  order: lazyComponent(() => import('./OrderView').then((m) => m.OrderView)),
};

// Everything the app needs to know about a question kind: its name and icon (./kinds) and its view.
// Add a kind to the schema, then one entry in each, and every page picks it up.
export const KINDS = Object.fromEntries(KIND_ORDER.map((k) => [k, { ...KIND_META[k], View: VIEWS[k] }])) as { [K in Kind]: KindInfo<K> };

export { KIND_ORDER };

export const preloadView = (kind: Kind) => VIEWS[kind].preload();
export const preloadAllViews = () => Promise.all(KIND_ORDER.map(preloadView));

export function QuestionView({ q, subject, onResult }: Readonly<{ q: Question; subject: string; onResult: (correct: boolean) => void }>) {
  // KINDS[q.kind].View accepts exactly q's type, but TS can't correlate the union member with the lookup.
  const View = KINDS[q.kind].View as ComponentType<ViewProps<Question>>;
  return <View q={q} subject={subject} onResult={onResult} />;
}
