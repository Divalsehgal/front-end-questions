import { CodeBlock } from '../../ui/code';
import { AnswerDisclosure } from './AnswerDisclosure';

/** A drill's reference solution, collapsed in the page until revealed (see AnswerDisclosure). */
export function SolutionDisclosure({ code, lang, onOpen }: Readonly<{ code?: string; lang?: string; onOpen: () => boolean }>) {
  if (!code) return null;
  return (
    <AnswerDisclosure onOpen={onOpen} label="Show reference solution">
      <CodeBlock code={code} lang={lang} />
    </AnswerDisclosure>
  );
}
