import { PLACEHOLDER_CATALOG } from '@/content/placeholder-catalog';
import { UNITS, TOPICS } from '@/content/path';
import { validateCatalog } from '@/domain/catalog';
import { buildLesson, buildMistakesReview } from '@/domain/lesson';
import { addDays, isDue, mastery, reviewQuestion, type ProgressMap } from '@/domain/srs';
import { currentStreak, lessonXp, recordActivity, totalXp, type DailyActivity } from '@/domain/streak';

const TODAY = '2026-10-21';
const pool = PLACEHOLDER_CATALOG.questions;

describe('spaced repetition', () => {
  it('moves a right answer up one box and schedules it later', () => {
    const first = reviewQuestion(undefined, true, TODAY, 3);
    expect(first).toMatchObject({ box: 1, dueOn: '2026-10-22', timesSeen: 1, timesWrong: 0 });
    const second = reviewQuestion(first, true, '2026-10-22', 3);
    expect(second).toMatchObject({ box: 2, dueOn: '2026-10-25' });
  });

  it('sends a wrong answer back to box 1, due tomorrow', () => {
    const strong = { box: 4, dueOn: TODAY, timesSeen: 6, timesWrong: 0, lastAnsweredOn: '2026-10-07' };
    expect(reviewQuestion(strong, false, TODAY, 3)).toMatchObject({ box: 1, dueOn: '2026-10-22', timesWrong: 1 });
  });

  it('reviews 5-point questions twice as often', () => {
    const state = { box: 3, dueOn: TODAY, timesSeen: 3, timesWrong: 0, lastAnsweredOn: TODAY };
    expect(reviewQuestion(state, true, TODAY, 3).dueOn).toBe(addDays(TODAY, 14));
    expect(reviewQuestion(state, true, TODAY, 5).dueOn).toBe(addDays(TODAY, 7));
  });

  it('handles month and year boundaries', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
  });

  it('weights mastery by points', () => {
    const [a, b] = pool.filter((x) => x.points === 5).slice(0, 2);
    const progress: ProgressMap = {
      [a.id]: { box: 5, dueOn: TODAY, timesSeen: 5, timesWrong: 0, lastAnsweredOn: TODAY },
    };
    expect(mastery([a, b], progress)).toBe(0.5);
    expect(isDue(progress[a.id], TODAY)).toBe(true);
  });
});

describe('lessons', () => {
  const unit = UNITS[0];

  it('builds a lesson from the unit topics only', () => {
    const lesson = buildLesson(pool, unit.topicIds, {}, TODAY, { size: 5, seed: 1 });
    expect(lesson).toHaveLength(5);
    expect(lesson.every((x) => unit.topicIds.includes(x.topicId))).toBe(true);
  });

  it('puts due questions in before new ones', () => {
    const inUnit = pool.filter((x) => unit.topicIds.includes(x.topicId));
    const dueId = inUnit[inUnit.length - 1].id;
    const progress: ProgressMap = {
      [dueId]: { box: 2, dueOn: '2026-10-20', timesSeen: 2, timesWrong: 1, lastAnsweredOn: '2026-10-17' },
    };
    const lesson = buildLesson(pool, unit.topicIds, progress, TODAY, { size: 2, seed: 3 });
    expect(lesson.map((x) => x.id)).toContain(dueId);
  });

  it('never puts a question and its variant in one lesson', () => {
    const lesson = buildLesson(pool, ['physics'], {}, TODAY, { size: 10, seed: 5 });
    const mothers = lesson.map((x) => x.variantOf ?? x.id);
    expect(new Set(mothers).size).toBe(lesson.length);
  });

  it('reviews the weakest mistakes first', () => {
    const [a, b] = pool;
    const progress: ProgressMap = {
      [a.id]: { box: 3, dueOn: TODAY, timesSeen: 4, timesWrong: 1, lastAnsweredOn: TODAY },
      [b.id]: { box: 1, dueOn: TODAY, timesSeen: 3, timesWrong: 2, lastAnsweredOn: TODAY },
    };
    expect(buildMistakesReview(pool, progress).map((x) => x.id)).toEqual([b.id, a.id]);
  });
});

describe('streak and XP', () => {
  it('awards XP with a perfect-lesson bonus', () => {
    expect(lessonXp(10, 10)).toBe(25);
    expect(lessonXp(7, 10)).toBe(17);
    expect(lessonXp(0, 0)).toBe(0);
  });

  it('counts consecutive active days', () => {
    let activity: DailyActivity = {};
    for (const day of ['2026-10-18', '2026-10-19', '2026-10-20', TODAY]) {
      activity = recordActivity(activity, day, 10);
    }
    expect(currentStreak(activity, TODAY)).toBe(4);
    expect(totalXp(activity)).toBe(40);
  });

  it('keeps yesterday’s streak until the end of today', () => {
    const activity = recordActivity(recordActivity({}, '2026-10-19', 10), '2026-10-20', 10);
    expect(currentStreak(activity, TODAY)).toBe(2);
    expect(currentStreak(activity, '2026-10-22')).toBe(0);
  });
});

describe('placeholder content', () => {
  it('is a valid catalog', () => {
    expect(validateCatalog(PLACEHOLDER_CATALOG)).toEqual([]);
  });

  it('only uses topics that exist on the path', () => {
    const topicIds = new Set(TOPICS.map((t) => t.id));
    const unitTopics = new Set(UNITS.flatMap((u) => u.topicIds));
    for (const question of pool) {
      expect(topicIds.has(question.topicId)).toBe(true);
      expect(unitTopics.has(question.topicId)).toBe(true);
    }
  });

  it('has an English text for every question and option', () => {
    for (const question of pool) {
      expect(question.prompt.en).toBeTruthy();
      for (const option of question.options ?? []) expect(option.text.en).toBeTruthy();
    }
  });

  it('flags catalog problems', () => {
    const broken = {
      ...PLACEHOLDER_CATALOG,
      questions: [{ ...pool[0], options: pool[0].options!.map((o) => ({ ...o, correct: false })) }],
    };
    expect(validateCatalog(broken)).toEqual([{ questionId: pool[0].id, message: 'No correct option.' }]);
  });
});
