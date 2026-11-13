import { describe, expect, it } from 'vitest';
import { codeFiles as codeFilesIn, filesFor as filesForIn, uiFiles as uiFilesIn } from './files';

// What each subject module passes in: its own files/ directory.
const all = import.meta.glob<string>('./subjects/*/files/*', { query: '?raw', import: 'default', eager: true });
const own = (subject: string) => Object.fromEntries(Object.entries(all).filter(([k]) => k.startsWith(`./subjects/${subject}/files/`)));
const filesFor = (subject: string) => filesForIn(subject, own(subject));
const codeFiles = (subject: string) => codeFilesIn(subject, own(subject));
const uiFiles = (subject: string) => uiFilesIn(subject, own(subject));

describe('filesFor', () => {
  it('finds a part by naming convention regardless of extension', () => {
    const f = filesFor('javascript')('debounce');
    expect(f.part('starter')).toEqual(expect.any(String));
    expect(f.required('tests')).toEqual(expect.any(String));
  });

  it('returns undefined for a missing optional part', () => {
    expect(filesFor('javascript')('debounce').part('nope')).toBeUndefined();
    expect(filesFor('no-such-subject')('x').part('starter')).toBeUndefined();
  });

  it('only sees the files it was given', () => {
    expect(filesForIn('javascript', own('typescript'))('debounce').part('starter')).toBeUndefined();
  });

  it('does not confuse an id with a longer id sharing its prefix', () => {
    const short = filesFor('javascript')('array-polyfills').required('starter');
    const long = filesFor('javascript')('array-polyfills-2').required('starter');
    expect(short).not.toBe(long);
  });

  it('throws a helpful error for a missing required part', () => {
    expect(() => filesFor('javascript')('ghost').required('starter')).toThrow('Missing file subjects/javascript/files/ghost.starter.*');
  });
});

describe('codeFiles', () => {
  it('loads starter, tests, solution and type tests', () => {
    const f = codeFiles('javascript')('debounce');
    expect(Object.keys(f).sort()).toEqual(['solution', 'starter', 'tests', 'typeTests']);
    for (const v of Object.values(f)) expect(v).toEqual(expect.any(String));
  });

  it('allows a pure type challenge without tests', () => {
    const f = codeFiles('typescript')('infer-types');
    expect(f.tests).toBeUndefined();
    expect(f.typeTests).toEqual(expect.any(String));
  });

  it('requires tests or type tests, then a starter', () => {
    expect(() => codeFiles('javascript')('ghost')).toThrow('Code question javascript/ghost needs <id>.tests or <id>.types');
  });
});

describe('uiFiles', () => {
  it('loads a starter and optional solution', () => {
    const f = uiFiles('machine-coding')('action-form');
    expect(f.starter).toMatch(/export default/);
    expect(f.solution).toEqual(expect.any(String));
  });

  it('throws when the starter is missing', () => {
    expect(() => uiFiles('machine-coding')('ghost')).toThrow(/Missing file subjects\/machine-coding\/files\/ghost\.starter/);
  });
});
