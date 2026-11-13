export type Step = { note: string; vals: Record<string, string> };
export type DryRunResult = { output?: string; steps: Step[]; cols: string[]; error: string | null };

export function fmt(v: unknown): string;
export function stripImports(src: string): string;
export function instrument(src: string): string;
export function dryRun(src: string, env?: Record<string, unknown>, opts?: { limit?: number; timeout?: number }): Promise<DryRunResult>;
