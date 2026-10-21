/**
 * Exam readiness: one honest number (0–100), five clear criteria, the weakest
 * topics, and a daily plan to the exam date. "Ready" is only declared when
 * every criterion is met — including passing recent mock exams with margin.
 */
import type { ExamResult } from './exam';
import { addDays, type ProgressMap } from './srs';
import type { Question } from './types';

export type ExamRecord = {
  day: string;
  passed: boolean;
  errorPoints: number;
  failReason: ExamResult['failReason'];
};

export type CriterionId = 'coverage' | 'mastery' | 'critical' | 'topics' | 'exams';

export type Criterion = {
  id: CriterionId;
  met: boolean;
  /** Current value, 0–1 (for exams: share of the last 3 exams passed with margin). */
  value: number;
  target: number;
};

export type TopicReadiness = { topicId: string; total: number; seen: number; strength: number };

export type ReadinessLevel = 'start' | 'building' | 'almost' | 'ready';

export type ReadinessReport = {
  score: number;
  level: ReadinessLevel;
  criteria: Criterion[];
  topics: TopicReadiness[];
  /** Topic ids, weakest first, that are below the topic target. */
  weakTopics: string[];
  plan: { daysLeft: number | null; unseen: number; newPerDay: number; dueToday: number };
};

export const TARGETS = {
  coverage: 0.95,
  mastery: 0.85,
  critical: 0.9,
  topic: 0.7,
  /** Error points allowed in the recent mock exams to count as "passed with margin". */
  examMaxPoints: 6,
  recentExams: 3,
} as const;

/** How well one question is known, from its spaced-repetition box. */
export function strengthOf(box: number | undefined): number {
  if (box === undefined) return 0;
  return [0, 0.2, 0.5, 0.75, 1, 1][Math.min(5, Math.max(0, box))];
}

function weightedStrength(questions: Question[], progress: ProgressMap): number {
  const total = questions.reduce((s, q) => s + q.points, 0);
  if (!total) return 0;
  return questions.reduce((s, q) => s + q.points * strengthOf(progress[q.id]?.box), 0) / total;
}

/** Score of one mock exam between 0 and 1. A fail on two 5-pointers caps it low. */
export function examScore(exam: ExamRecord): number {
  const base = Math.max(0, 1 - exam.errorPoints / 20);
  return exam.failReason === 'two-five-point-questions' ? Math.min(base, 0.4) : base;
}

export function daysBetween(from: string, to: string): number {
  const [y1, m1, d1] = from.split('-').map(Number);
  const [y2, m2, d2] = to.split('-').map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86_400_000);
}

export function readiness(input: {
  questions: Question[];
  topicIds: string[];
  progress: ProgressMap;
  /** Newest first. */
  exams: ExamRecord[];
  today: string;
  examDate?: string | null;
}): ReadinessReport {
  const { questions, topicIds, progress, exams, today, examDate } = input;

  const seen = questions.filter((q) => progress[q.id] !== undefined).length;
  const coverage = questions.length ? seen / questions.length : 0;
  const mastery = weightedStrength(questions, progress);
  const critical = weightedStrength(
    questions.filter((q) => q.points === 5),
    progress,
  );

  const topics: TopicReadiness[] = topicIds.map((topicId) => {
    const qs = questions.filter((q) => q.topicId === topicId);
    return {
      topicId,
      total: qs.length,
      seen: qs.filter((q) => progress[q.id] !== undefined).length,
      strength: weightedStrength(qs, progress),
    };
  });
  const minTopic = topics.length ? Math.min(...topics.map((t) => t.strength)) : 0;

  const recent = exams.slice(0, TARGETS.recentExams);
  const goodExams = recent.filter((e) => e.passed && e.errorPoints <= TARGETS.examMaxPoints).length;
  const examValue = goodExams / TARGETS.recentExams;
  const examPart = recent.reduce((s, e) => s + examScore(e), 0) / TARGETS.recentExams;

  const criteria: Criterion[] = [
    { id: 'coverage', met: coverage >= TARGETS.coverage, value: coverage, target: TARGETS.coverage },
    { id: 'mastery', met: mastery >= TARGETS.mastery, value: mastery, target: TARGETS.mastery },
    { id: 'critical', met: critical >= TARGETS.critical, value: critical, target: TARGETS.critical },
    { id: 'topics', met: minTopic >= TARGETS.topic, value: minTopic, target: TARGETS.topic },
    { id: 'exams', met: goodExams === TARGETS.recentExams, value: examValue, target: 1 },
  ];

  const score = Math.round(100 * (0.15 * coverage + 0.4 * mastery + 0.15 * critical + 0.3 * examPart));
  const allMet = criteria.every((c) => c.met);
  const level: ReadinessLevel = allMet ? 'ready' : score >= 75 ? 'almost' : score >= 35 ? 'building' : 'start';

  const weakTopics = [...topics]
    .filter((t) => t.strength < TARGETS.topic)
    .sort((a, b) => a.strength - b.strength)
    .map((t) => t.topicId);

  const unseen = questions.length - seen;
  const daysLeft = examDate ? Math.max(0, daysBetween(today, examDate)) : null;
  // Leave the last three days for review and mock exams.
  const learningDays = daysLeft === null ? 14 : Math.max(1, daysLeft - 3);
  const newPerDay = unseen === 0 ? 0 : Math.max(5, Math.ceil(unseen / learningDays));
  const dueToday = questions.filter((q) => {
    const s = progress[q.id];
    return s !== undefined && s.dueOn <= today;
  }).length;

  return { score: allMet ? Math.max(score, 90) : Math.min(score, 89), level, criteria, topics, weakTopics, plan: { daysLeft, unseen, newPerDay, dueToday } };
}

/** Exam date a number of weeks from today (YYYY-MM-DD). */
export function examDateIn(today: string, weeks: number): string {
  return addDays(today, weeks * 7);
}
