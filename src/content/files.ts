// Code-heavy questions keep their starter/tests/solution as real files next to the
// subject (src/content/subjects/<subject>/files/<id>.<part>.<ext>) so they can use
// backticks and template literals freely. Each subject module passes in its own files
// (an eager `import.meta.glob('./files/*', { query: '?raw' })`), so fixtures ship in that
// subject's chunk only; this finds them by naming convention.
export type RawFiles = Record<string, string>;

export function filesFor(subject: string, raw: RawFiles) {
  return (id: string) => {
    const part = (name: string) => {
      const key = Object.keys(raw).find((k) => k.slice(k.lastIndexOf('/') + 1).startsWith(`${id}.${name}.`));
      return key ? raw[key] : undefined;
    };
    const required = (name: string) => {
      const v = part(name);
      if (v === undefined) throw new Error(`Missing file subjects/${subject}/files/${id}.${name}.*`);
      return v;
    };
    return { part, required };
  };
}

/** Files for a `code` question: <id>.starter, <id>.tests, optional <id>.solution / <id>.types */
export const codeFiles = (subject: string, raw: RawFiles) => {
  const get = filesFor(subject, raw);
  return (id: string) => {
    const f = get(id);
    const tests = f.part('tests');
    const typeTests = f.part('types');
    if (!tests && !typeTests) throw new Error(`Code question ${subject}/${id} needs <id>.tests or <id>.types`);
    return { starter: f.required('starter'), tests, solution: f.part('solution'), typeTests };
  };
};

/** Files for a `ui` question: <id>.starter, optional <id>.solution */
export const uiFiles = (subject: string, raw: RawFiles) => {
  const get = filesFor(subject, raw);
  return (id: string) => {
    const f = get(id);
    return { starter: f.required('starter'), solution: f.part('solution') };
  };
};
