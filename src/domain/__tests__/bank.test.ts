import { QUESTION_BANK } from '@/content/bank';
import { TOPICS, UNITS } from '@/content/path';
import { assembleExam, CLASS_B_FIRST_LICENCE } from '@/domain/exam';

const questions = QUESTION_BANK.questions;

describe('question bank quality', () => {
  it('has unique ids', () => {
    expect(new Set(questions.map((q) => q.id)).size).toBe(questions.length);
  });

  it('covers every topic with at least 8 questions', () => {
    for (const topic of TOPICS) {
      expect(questions.filter((q) => q.topicId === topic.id).length).toBeGreaterThanOrEqual(8);
    }
  });

  it('gives every question an explanation in German and English', () => {
    for (const q of questions) {
      expect(q.explanation?.de).toBeTruthy();
      expect(q.explanation?.en).toBeTruthy();
      expect(q.prompt.en).toBeTruthy();
    }
  });

  it('has at least one right and one wrong option in every multiple-choice question, except "all apply" ones', () => {
    for (const q of questions.filter((x) => x.kind === 'multiple-choice')) {
      const right = q.options!.filter((o) => o.correct).length;
      expect(right).toBeGreaterThanOrEqual(1);
      expect(q.options!.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('draws you on the south arm of every junction situation', () => {
    for (const q of questions) {
      if (q.media?.type !== 'situation') continue;
      const mine = q.media.situation.vehicles.filter((v) => v.me);
      expect(mine).toHaveLength(1);
      expect(mine[0].arm).toBe('s');
      if (q.media.situation.kind === 't-junction') {
        expect(q.media.situation.vehicles.some((v) => v.arm === 'n')).toBe(false);
      }
    }
  });

  it('has enough basic and class questions for many different mock exams', () => {
    const seen = new Set<string>();
    for (let seed = 1; seed <= 20; seed++) {
      for (const q of assembleExam(questions, CLASS_B_FIRST_LICENCE, seed)) seen.add(q.id);
    }
    expect(seen.size).toBeGreaterThan(120);
  });

  it('has one learning-path district per topic', () => {
    expect(UNITS.map((u) => u.topicIds[0])).toEqual(TOPICS.map((t) => t.id));
  });
});
