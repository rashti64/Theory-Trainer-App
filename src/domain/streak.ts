/**
 * Daily goal, streak and XP. Dates are local YYYY-MM-DD strings.
 */
import { addDays } from './srs';

export type DailyActivity = Record<string, { xp: number; lessons: number } | undefined>;

export const DAILY_GOAL_OPTIONS = [10, 20, 30, 50] as const;
export type DailyGoalXp = (typeof DAILY_GOAL_OPTIONS)[number];

/** XP for a finished lesson: 10 for finishing, 1 per correct answer, 5 bonus for no mistakes. */
export function lessonXp(correct: number, total: number): number {
  if (total === 0) return 0;
  return 10 + correct + (correct === total ? 5 : 0);
}

/** XP for a finished exam simulation: 20, plus 10 when passed. */
export function examXp(passed: boolean): number {
  return 20 + (passed ? 10 : 0);
}

/**
 * Current streak in days. A streak survives until the end of the day after the
 * last active day, so it shows yesterday's streak until the learner practises today.
 */
export function currentStreak(activity: DailyActivity, today: string): number {
  const active = (day: string) => (activity[day]?.lessons ?? 0) > 0;
  let day = active(today) ? today : addDays(today, -1);
  let streak = 0;
  while (active(day)) {
    streak += 1;
    day = addDays(day, -1);
  }
  return streak;
}

export function recordActivity(
  activity: DailyActivity,
  today: string,
  xp: number,
): DailyActivity {
  const previous = activity[today] ?? { xp: 0, lessons: 0 };
  return { ...activity, [today]: { xp: previous.xp + xp, lessons: previous.lessons + 1 } };
}

export function totalXp(activity: DailyActivity): number {
  return Object.values(activity).reduce((sum, a) => sum + (a?.xp ?? 0), 0);
}
