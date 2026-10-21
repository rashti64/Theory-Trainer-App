import type { Unit } from './path';

/** Lessons a learner finishes to complete a unit and unlock the next one. */
export const LESSONS_PER_UNIT = 4;

export type UnitStatus = {
  unit: Unit;
  unlocked: boolean;
  lessonsDone: number;
  completed: boolean;
  /** True for the one unit the learner should do next. */
  current: boolean;
};

/** Units unlock one after another; finished units stay open for practice. */
export function pathStatus(units: Unit[], unitLessons: Record<string, number | undefined>): UnitStatus[] {
  let previousCompleted = true;
  let currentAssigned = false;
  return units.map((unit) => {
    const lessonsDone = Math.min(unitLessons[unit.id] ?? 0, LESSONS_PER_UNIT);
    const completed = lessonsDone >= LESSONS_PER_UNIT;
    const unlocked = previousCompleted;
    const current = unlocked && !completed && !currentAssigned;
    if (current) currentAssigned = true;
    previousCompleted = completed;
    return { unit, unlocked, lessonsDone, completed, current };
  });
}
