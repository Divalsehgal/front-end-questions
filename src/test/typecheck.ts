// Node-side type checking of `code + typeTests`, using the real TypeScript compiler.
import ts from 'typescript';

const OPTIONS: ts.CompilerOptions = {
  strict: true,
  noEmit: true,
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  lib: ['lib.es2023.d.ts', 'lib.dom.d.ts'],
  types: [],
  skipLibCheck: true,
};

const FILE = '/drill.ts';
const baseHost = ts.createCompilerHost(OPTIONS);
const libCache = new Map<string, ts.SourceFile | undefined>();

/** Returns the diagnostics as readable strings (empty array = types are correct). */
export function typeErrors(code: string, typeTests: string): string[] {
  const text = `${code}\n\n${typeTests}`;
  const host: ts.CompilerHost = {
    ...baseHost,
    getSourceFile(fileName, languageVersion) {
      if (fileName === FILE) return ts.createSourceFile(fileName, text, languageVersion, true);
      if (!libCache.has(fileName)) libCache.set(fileName, baseHost.getSourceFile(fileName, languageVersion));
      return libCache.get(fileName);
    },
    fileExists: (f) => f === FILE || baseHost.fileExists(f),
    readFile: (f) => (f === FILE ? text : baseHost.readFile(f)),
  };
  const program = ts.createProgram([FILE], OPTIONS, host);
  const file = program.getSourceFile(FILE)!;
  return [...program.getSyntacticDiagnostics(file), ...program.getSemanticDiagnostics(file)].map((d) => ts.flattenDiagnosticMessageText(d.messageText, ' '));
}
