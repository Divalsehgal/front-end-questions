export type ContrastResult = { theme: string; fg: string; bg: string; min: number; use: string; ratio: number; ok: boolean };
export const TEXT: number;
export const UI: number;
export const PAIRS: [string, string, number, string][];
export const CSS_PATH: string;
export function parseTokens(css: string): { light: Record<string, string>; dark: Record<string, string> };
export function luminance(hex: string): number;
export function ratio(a: string, b: string): number;
export function checkContrast(css: string): ContrastResult[];
