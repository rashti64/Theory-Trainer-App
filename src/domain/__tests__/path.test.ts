import { UNITS } from '@/content/path';
import { LESSONS_PER_UNIT, pathStatus } from '@/content/path-progress';
import { newerState } from '@/lib/sync';
import type { PersistedState } from '@/state/app-state';

describe('learning path', () => {
  it('opens only the first unit for a new learner', () => {
    const status = pathStatus(UNITS, {});
    expect(status[0]).toMatchObject({ unlocked: true, current: true, lessonsDone: 0 });
    expect(status.slice(1).every((s) => !s.unlocked)).toBe(true);
  });

  it('unlocks the next unit once a unit is complete', () => {
    const status = pathStatus(UNITS, { u1: LESSONS_PER_UNIT, u2: 1 });
    expect(status[0]).toMatchObject({ completed: true, current: false });
    expect(status[1]).toMatchObject({ unlocked: true, current: true, lessonsDone: 1 });
    expect(status[2].unlocked).toBe(false);
  });

  it('caps lessons done at the unit size', () => {
    expect(pathStatus(UNITS, { u1: 99 })[0].lessonsDone).toBe(LESSONS_PER_UNIT);
  });
});

describe('sync', () => {
  const base: Omit<PersistedState, 'updatedAt'> = {
    locale: 'de',
    dailyGoalXp: 20,
    soundOn: true,
    progress: {},
    activity: {},
    exams: [],
    unitLessons: {},
  };
  const older: PersistedState = { ...base, updatedAt: '2026-10-20T10:00:00.000Z' };
  const newer: PersistedState = { ...base, updatedAt: '2026-10-21T10:00:00.000Z' };

  it('keeps the newer copy', () => {
    expect(newerState(older, newer)).toBe(newer);
    expect(newerState(newer, older)).toBe(newer);
    expect(newerState(older, null)).toBe(older);
  });
});
