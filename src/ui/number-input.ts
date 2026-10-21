/** Pure helpers for number answers (no React), shared by the keypad and the screens. */
import type { Locale } from '@/domain/types';

export const NUMBER_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', ',', '0', 'del'] as const;
export type NumberKey = (typeof NUMBER_KEYS)[number];

const MAX_LEN = 6;

export function applyKey(text: string, key: NumberKey): string {
  if (key === 'del') return text.slice(0, -1);
  if (key === ',') return text.includes(',') || text === '' ? text : text + ',';
  if (text.length >= MAX_LEN) return text;
  if (text === '0') return key;
  return text + key;
}

/** Parse what the learner typed; accepts German decimal commas ("1,6"). */
export function parseNumberInput(text: string): number | null {
  const normalised = text.trim().replace(',', '.');
  if (normalised === '' || !/^-?\d+(\.\d+)?$/.test(normalised)) return null;
  return Number(normalised);
}

export function formatNumber(value: number, locale: Locale): string {
  return locale === 'de' ? String(value).replace('.', ',') : String(value);
}
