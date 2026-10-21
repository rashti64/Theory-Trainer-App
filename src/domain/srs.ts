/**
 * Spaced repetition (Leitner boxes). Every question sits in a box from 0 to 5.
 * A right answer moves it up one box and pushes the next review further out;
 * a wrong answer sends it back to box 1 and makes it due again tomorrow.
 * 5-point questions (right of way, etc.) are reviewed twice as often.
 */
import type { Question } from './types';

export type QuestionState = {
  box: number;
  /** Day (YYYY-MM-DD, local) on which the question is due again. */
  dueOn: string;
  timesSeen: number;
  timesWrong: number;
  lastAnsweredOn: string;
};

export type ProgressMap = Record<string, QuestionState | undefined>;

export const MAX_BOX = 5;
/** Days until the next review, indexed by box. */
export const BOX_INTERVAL_DAYS = [0, 1, 3, 7, 14, 30] as const;
/** A question counts as mastered from this box on. */
export const MASTERED_BOX = 4;

export function reviewQuestion(
  previous: QuestionState | undefined,
  correct: boolean,
  today: string,
  points: Question['points'],
): QuestionState {
  const box = correct ? Math.min((previous?.box ?? 0) + 1, MAX_BOX) : 1;
  const baseInterval = BOX_INTERVAL_DAYS[box];
  const interval = points === 5 ? Math.max(1, Math.floor(baseInterval / 2)) : baseInterval;
  return {
    box,
    dueOn: addDays(today, correct ? interval : 1),
    timesSeen: (previous?.timesSeen ?? 0) + 1,
    timesWrong: (previous?.timesWrong ?? 0) + (correct ? 0 : 1),
    lastAnsweredOn: today,
  };
}

export function isDue(state: QuestionState | undefined, today: string): boolean {
  return state !== undefined && state.dueOn <= today;
}

export function isMastered(state: QuestionState | undefined): boolean {
  return (state?.box ?? 0) >= MASTERED_BOX;
}

/** Share of questions mastered, from 0 to 1. Weighted by points, so 5-point questions count more. */
export function mastery(questions: Question[], progress: ProgressMap): number {
  const total = questions.reduce((sum, q) => sum + q.points, 0);
  if (total === 0) return 0;
  const mastered = questions
    .filter((q) => isMastered(progress[q.id]))
    .reduce((sum, q) => sum + q.points, 0);
  return mastered / total;
}

/** Add whole days to a YYYY-MM-DD date string (calendar arithmetic in UTC, no time-zone drift). */
export function addDays(day: string, days: number): string {
  const [y, m, d] = day.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + days));
  return date.toISOString().slice(0, 10);
}

/** Today's date in the device's local time zone, as YYYY-MM-DD. */
export function localToday(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
