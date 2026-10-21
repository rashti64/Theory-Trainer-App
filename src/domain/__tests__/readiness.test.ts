import { QUESTION_BANK } from '@/content/bank';
import { TOPICS } from '@/content/path';
import { buildDailySession, buildEntryTest, buildUnitTest, ENTRY_TEST_SIZE, UNIT_TEST_SIZE, unitTestPassed } from '@/domain/lesson';
import { daysBetween, readiness, TARGETS, type ExamRecord } from '@/domain/readiness';
import type { ProgressMap } from '@/domain/srs';

const pool = QUESTION_BANK.questions;
const topicIds = TOPICS.map((t) => t.id);
const TODAY = '2026-10-21';

function progressAll(box: number, filter: (id: string, points: number) => boolean = () => true): ProgressMap {
  const p: ProgressMap = {};
  for (const q of pool) {
    if (filter(q.id, q.points)) p[q.id] = { box, dueOn: '2026-11-30', timesSeen: box, timesWrong: 0, lastAnsweredOn: TODAY };
  }
  return p;
}

const goodExam: ExamRecord = { day: TODAY, passed: true, errorPoints: 4, failReason: null };
const narrowPass: ExamRecord = { day: TODAY, passed: true, errorPoints: 9, failReason: null };
const fail: ExamRecord = { day: TODAY, passed: false, errorPoints: 10, failReason: 'two-five-point-questions' };

describe('readiness', () => {
  it('starts at zero for a new learner', () => {
    const r = readiness({ questions: pool, topicIds, progress: {}, exams: [], today: TODAY });
    expect(r.score).toBe(0);
    expect(r.level).toBe('start');
    expect(r.criteria.every((c) => !c.met)).toBe(true);
    expect(r.weakTopics).toHaveLength(topicIds.length);
  });

  it('declares ready only when every criterion is met', () => {
    const r = readiness({ questions: pool, topicIds, progress: progressAll(4), exams: [goodExam, goodExam, goodExam], today: TODAY });
    expect(r.level).toBe('ready');
    expect(r.score).toBeGreaterThanOrEqual(90);
  });

  it('is not ready with perfect knowledge but no mock exams', () => {
    const r = readiness({ questions: pool, topicIds, progress: progressAll(5), exams: [], today: TODAY });
    expect(r.level).not.toBe('ready');
    expect(r.score).toBeLessThan(90);
    expect(r.criteria.find((c) => c.id === 'exams')!.met).toBe(false);
  });

  it('needs mock exams passed with margin, not just passed', () => {
    const r = readiness({ questions: pool, topicIds, progress: progressAll(4), exams: [narrowPass, goodExam, goodExam], today: TODAY });
    expect(r.level).not.toBe('ready');
  });

  it('is not ready while the 5-point questions are weak', () => {
    const progress = progressAll(4, (_, points) => points < 5);
    const r = readiness({ questions: pool, topicIds, progress, exams: [goodExam, goodExam, goodExam], today: TODAY });
    expect(r.criteria.find((c) => c.id === 'critical')!.met).toBe(false);
    expect(r.level).not.toBe('ready');
  });

  it('penalises failing on two 5-point questions', () => {
    const a = readiness({ questions: pool, topicIds, progress: progressAll(4), exams: [goodExam, goodExam, goodExam], today: TODAY });
    const b = readiness({ questions: pool, topicIds, progress: progressAll(4), exams: [fail, goodExam, goodExam], today: TODAY });
    expect(b.score).toBeLessThan(a.score);
  });

  it('plans the daily load to the exam date, keeping 3 days for review', () => {
    const r = readiness({ questions: pool, topicIds, progress: {}, exams: [], today: TODAY, examDate: '2026-11-04' });
    expect(r.plan.daysLeft).toBe(14);
    expect(r.plan.newPerDay).toBe(Math.ceil(pool.length / 11));
  });

  it('counts days across months', () => {
    expect(daysBetween('2026-10-30', '2026-11-02')).toBe(3);
  });

  it('uses sensible targets', () => {
    expect(TARGETS.examMaxPoints).toBeLessThan(10);
    expect(TARGETS.recentExams).toBeGreaterThanOrEqual(3);
  });
});

describe('sessions', () => {
  it('builds an entry test from every topic', () => {
    const test = buildEntryTest(pool, 3);
    expect(test).toHaveLength(ENTRY_TEST_SIZE);
    expect(new Set(test.map((q) => q.topicId)).size).toBeGreaterThanOrEqual(12);
    expect(test.filter((q) => q.points >= 4).length).toBeGreaterThanOrEqual(10);
  });

  it('builds a unit test from the unit only', () => {
    const test = buildUnitTest(pool, ['right-of-way'], 5);
    expect(test).toHaveLength(UNIT_TEST_SIZE);
    expect(test.every((q) => q.topicId === 'right-of-way')).toBe(true);
  });

  it('passes a unit test from 80 %', () => {
    expect(unitTestPassed(10, 12)).toBe(true);
    expect(unitTestPassed(9, 12)).toBe(false);
  });

  it('puts due reviews and new questions into the daily session', () => {
    const due: ProgressMap = { [pool[50].id]: { box: 2, dueOn: '2026-10-20', timesSeen: 2, timesWrong: 1, lastAnsweredOn: '2026-10-18' } };
    const session = buildDailySession(pool, topicIds, due, TODAY, 8, { seed: 1 });
    expect(session.map((q) => q.id)).toContain(pool[50].id);
    expect(session.filter((q) => due[q.id] === undefined)).toHaveLength(8);
    // New questions follow the learning path: the first topic comes first.
    expect(session.filter((q) => due[q.id] === undefined).every((q) => q.topicId === topicIds[0])).toBe(true);
  });
});
