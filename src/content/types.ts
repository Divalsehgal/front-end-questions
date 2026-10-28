// One schema for every kind of practice. Add a new kind by extending `Question`
// and registering a view for it in src/questions/registry.tsx.

export type Kind = 'quiz' | 'output' | 'code' | 'ui' | 'flashcard' | 'order';
export type Difficulty = 'easy' | 'medium' | 'hard';

type Base = {
  /** Unique within its subject. */
  id: string;
  title: string;
  difficulty?: Difficulty;
};

/** Multiple choice. `answer` is an index, or several indexes for "select all that apply". */
export type QuizQuestion = Base & {
  kind: 'quiz';
  prompt: string;
  code?: string;
  options: string[];
  answer: number | number[];
  why: string;
};

/** "What does this log?" The expected output is never stored: the sandbox runs `code`. */
export type OutputQuestion = Base & {
  kind: 'output';
  code: string;
  /** 'ts' strips types before running. */
  lang?: 'js' | 'ts';
  why: string;
};

/** Implement something; a test suite (and optional type tests) decide when it's done. */
export type CodeQuestion = Base & {
  kind: 'code';
  prompt: string;
  starter: string;
  /**
   * Globals: test, assert, fn, clock. Imports the solution from './solution'.
   * Omit for a pure type challenge: then the type tests alone decide when it's solved.
   */
  tests?: string;
  /** Appended to the solution and type-checked; every `@ts-expect-error` line must error. */
  typeTests?: string;
  /** Reference implementation, revealed after solving or on request. */
  solution?: string;
};

/** Machine coding: build a working UI, see it live, tick off requirements, compare with a reference. */
export type UiQuestion = Base & {
  kind: 'ui';
  prompt: string;
  framework: 'react' | 'vanilla';
  requirements: string[];
  starter: string;
  solution?: string;
};

/** Active recall: answer in your head (or out loud), reveal, then rate yourself honestly. */
export type FlashcardQuestion = Base & {
  kind: 'flashcard';
  front: string;
  back: string;
  code?: string;
};

/** Put the steps in order. `items` is the CORRECT order; the UI shuffles it. */
export type OrderQuestion = Base & {
  kind: 'order';
  prompt: string;
  items: string[];
  why: string;
};

export type Question = QuizQuestion | OutputQuestion | CodeQuestion | UiQuestion | FlashcardQuestion | OrderQuestion;

export type Topic = { slug: string; title: string; questions: Question[] };

export type Subject = {
  slug: string;
  title: string;
  blurb: string;
  /** lucide-react icon name, resolved in src/ui/icons.ts */
  icon: string;
  topics: Topic[];
};

// The light shape every page ships (src/content/manifest.ts): enough for lists, counts, links and
// progress, without question bodies. A full Subject is assignable to SubjectMeta.
export type QuestionMeta = Pick<Question, 'id' | 'title' | 'kind' | 'difficulty'>;
export type TopicMeta = { slug: string; title: string; questions: QuestionMeta[] };
export type SubjectMeta = Omit<Subject, 'topics'> & { topics: TopicMeta[] };
