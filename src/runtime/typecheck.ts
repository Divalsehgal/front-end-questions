import type { Monaco } from '../ui/CodeEditor';

export type TypeIssue = { inTypeTests: boolean; line: number; source: string; message: string; shouldFail?: string };

const flatten = (m: string | { messageText: string; next?: unknown[] }): string =>
  typeof m === 'string' ? m : [m.messageText, ...((m.next as (typeof m)[]) ?? []).map(flatten)].join(' ');

/** Type-checks `code + typeTests` in a throwaway Monaco model. */
export async function checkTypes(monaco: Monaco, id: string, code: string, typeTests: string): Promise<TypeIssue[]> {
  const uri = monaco.Uri.parse(`file:///typecheck-${id}.ts`);
  const model = monaco.editor.createModel(`${code}\n\n${typeTests}`, 'typescript', uri);
  try {
    const worker = await (await monaco.languages.typescript.getTypeScriptWorker())(uri);
    const diags = [...(await worker.getSyntacticDiagnostics(uri.toString())), ...(await worker.getSemanticDiagnostics(uri.toString()))];
    const codeLines = code.split('\n').length;
    return diags.map((d) => {
      const line = model.getPositionAt(d.start ?? 0).lineNumber;
      const message = flatten(d.messageText as Parameters<typeof flatten>[0]);
      // An unused @ts-expect-error means the NEXT line compiled but shouldn't have.
      const unused = message.includes("Unused '@ts-expect-error'");
      return {
        inTypeTests: line > codeLines,
        line,
        source: model.getLineContent(unused ? line + 1 : line).trim(),
        message,
        shouldFail: unused ? model.getLineContent(line).replace(/.*@ts-expect-error\s*/, '') : undefined,
      };
    });
  } finally {
    model.dispose();
  }
}
