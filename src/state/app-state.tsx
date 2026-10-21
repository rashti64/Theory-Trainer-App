/**
 * App state: learner progress, daily activity, settings and exam history.
 * Saved on the device (SQLite-backed localStorage) after every change, and
 * synced to the backend when the learner is signed in (see lib/sync.ts).
 */
import 'expo-sqlite/localStorage/install';

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';

import { PLACEHOLDER_CATALOG } from '@/content/placeholder-catalog';
import type { ExamResult } from '@/domain/exam';
import { localToday, reviewQuestion, type ProgressMap } from '@/domain/srs';
import { recordActivity, type DailyActivity, type DailyGoalXp } from '@/domain/streak';
import type { Catalog, Locale, Question } from '@/domain/types';

const STORAGE_KEY = 'theory-trainer/state/v1';

export type ExamRecord = {
  day: string;
  passed: boolean;
  errorPoints: number;
  failReason: ExamResult['failReason'];
};

export type PersistedState = {
  locale: Locale;
  dailyGoalXp: DailyGoalXp;
  progress: ProgressMap;
  activity: DailyActivity;
  exams: ExamRecord[];
  /** Lessons finished per unit of the learning path. */
  unitLessons: Record<string, number | undefined>;
  /** Last time the state changed, for last-write-wins sync. ISO timestamp. */
  updatedAt: string;
};

const initialState: PersistedState = {
  locale: 'de',
  dailyGoalXp: 20,
  progress: {},
  activity: {},
  exams: [],
  unitLessons: {},
  updatedAt: new Date(0).toISOString(),
};

type Action =
  | { type: 'answered'; question: Question; correct: boolean }
  | { type: 'lesson-finished'; xp: number; unitId: string | null }
  | { type: 'exam-finished'; result: ExamResult; xp: number }
  | { type: 'set-locale'; locale: Locale }
  | { type: 'set-daily-goal'; xp: DailyGoalXp }
  | { type: 'replace'; state: PersistedState };

function reducer(state: PersistedState, action: Action): PersistedState {
  const today = localToday();
  const stamp = { updatedAt: new Date().toISOString() };
  switch (action.type) {
    case 'answered':
      return {
        ...state,
        ...stamp,
        progress: {
          ...state.progress,
          [action.question.id]: reviewQuestion(
            state.progress[action.question.id],
            action.correct,
            today,
            action.question.points,
          ),
        },
      };
    case 'lesson-finished':
      return {
        ...state,
        ...stamp,
        activity: recordActivity(state.activity, today, action.xp),
        unitLessons: action.unitId
          ? { ...state.unitLessons, [action.unitId]: (state.unitLessons[action.unitId] ?? 0) + 1 }
          : state.unitLessons,
      };
    case 'exam-finished':
      return {
        ...state,
        ...stamp,
        activity: recordActivity(state.activity, today, action.xp),
        exams: [
          {
            day: today,
            passed: action.result.passed,
            errorPoints: action.result.errorPoints,
            failReason: action.result.failReason,
          },
          ...state.exams,
        ].slice(0, 20),
      };
    case 'set-locale':
      return { ...state, ...stamp, locale: action.locale };
    case 'set-daily-goal':
      return { ...state, ...stamp, dailyGoalXp: action.xp };
    case 'replace':
      return action.state;
  }
}

function load(): PersistedState {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY);
    return raw ? { ...initialState, ...(JSON.parse(raw) as Partial<PersistedState>) } : initialState;
  } catch {
    return initialState;
  }
}

type AppContextValue = {
  state: PersistedState;
  catalog: Catalog;
  dispatch: (action: Action) => void;
  replaceState: (next: PersistedState) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);

  useEffect(() => {
    try {
      globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage full or unavailable: the app keeps working in memory.
    }
  }, [state]);

  const replaceState = useCallback((next: PersistedState) => dispatch({ type: 'replace', state: next }), []);

  // The licensed catalog will be loaded from the backend; until then, the placeholder set.
  const value = useMemo(
    () => ({ state, catalog: PLACEHOLDER_CATALOG, dispatch, replaceState }),
    [state, replaceState],
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState(): AppContextValue {
  const value = useContext(AppContext);
  if (!value) throw new Error('useAppState must be used inside AppStateProvider');
  return value;
}
