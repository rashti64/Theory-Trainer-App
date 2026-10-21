import { PLACEHOLDER_CATALOG } from '@/content/placeholder-catalog';
import {
  assembleExam,
  CLASS_B_FIRST_LICENCE,
  isAnswerCorrect,
  NotEnoughQuestionsError,
  scoreExam,
} from '@/domain/exam';
import type { Answer, Question, QuestionPoints } from '@/domain/types';

function q(id: string, points: QuestionPoints): Question {
  return {
    id,
    catalogVersion: 'test',
    topicId: 't',
    section: 'basic',
    classes: ['B'],
    points,
    kind: 'multiple-choice',
    prompt: { de: id },
    options: [
      { id: `${id}-a`, text: { de: 'a' }, correct: true },
      { id: `${id}-b`, text: { de: 'b' }, correct: false },
    ],
  };
}
const right = (question: Question): Answer => ({
  kind: 'multiple-choice',
  selectedOptionIds: [`${question.id}-a`],
});
const wrong = (question: Question): Answer => ({
  kind: 'multiple-choice',
  selectedOptionIds: [`${question.id}-b`],
});

describe('class B exam rules', () => {
  it('pins the official numbers', () => {
    expect(CLASS_B_FIRST_LICENCE).toEqual({
      licenceClass: 'B',
      basicQuestions: 20,
      classQuestions: 10,
      maxErrorPoints: 10,
      failAtWrongFivePointQuestions: 2,
    });
  });
});

describe('isAnswerCorrect', () => {
  const multi: Question = {
    ...q('m', 3),
    options: [
      { id: 'a', text: { de: 'a' }, correct: true },
      { id: 'b', text: { de: 'b' }, correct: true },
      { id: 'c', text: { de: 'c' }, correct: false },
    ],
  };

  it('needs every correct option and no wrong one', () => {
    expect(isAnswerCorrect(multi, { kind: 'multiple-choice', selectedOptionIds: ['a', 'b'] })).toBe(true);
    expect(isAnswerCorrect(multi, { kind: 'multiple-choice', selectedOptionIds: ['a'] })).toBe(false);
    expect(isAnswerCorrect(multi, { kind: 'multiple-choice', selectedOptionIds: ['a', 'b', 'c'] })).toBe(false);
  });

  it('treats a missing answer as wrong', () => {
    expect(isAnswerCorrect(multi, undefined)).toBe(false);
  });

  it('checks number answers exactly', () => {
    const numberQ: Question = { ...q('n', 3), kind: 'number', options: undefined, numberAnswer: { value: 1.6 } };
    expect(isAnswerCorrect(numberQ, { kind: 'number', value: 1.6 })).toBe(true);
    expect(isAnswerCorrect(numberQ, { kind: 'number', value: 1.5 })).toBe(false);
    expect(isAnswerCorrect(numberQ, { kind: 'number', value: null })).toBe(false);
  });
});

describe('scoreExam', () => {
  // 30 questions; we only vary which ones are answered wrong.
  const questions = [
    q('five-1', 5), q('five-2', 5), q('five-3', 5),
    q('four-1', 4), q('three-1', 3), q('three-2', 3), q('two-1', 2),
    ...Array.from({ length: 23 }, (_, i) => q(`filler-${i}`, 3)),
  ];
  const answersWith = (wrongIds: string[]) =>
    Object.fromEntries(
      questions.map((question) => [question.id, wrongIds.includes(question.id) ? wrong(question) : right(question)]),
    );

  it('passes with no mistakes', () => {
    const result = scoreExam(questions, answersWith([]));
    expect(result.passed).toBe(true);
    expect(result.errorPoints).toBe(0);
    expect(result.correctCount).toBe(30);
  });

  it('passes with exactly 10 error points (5 + 3 + 2)', () => {
    const result = scoreExam(questions, answersWith(['five-1', 'three-1', 'two-1']));
    expect(result).toMatchObject({ passed: true, errorPoints: 10, failReason: null });
  });

  it('passes with 4 + 3 + 3 = 10 error points', () => {
    expect(scoreExam(questions, answersWith(['four-1', 'three-1', 'three-2'])).passed).toBe(true);
  });

  it('fails with 11 error points', () => {
    const result = scoreExam(questions, answersWith(['five-1', 'three-1', 'three-2']));
    expect(result).toMatchObject({ passed: false, errorPoints: 11, failReason: 'too-many-error-points' });
  });

  it('fails with two wrong 5-point questions even at 10 error points', () => {
    const result = scoreExam(questions, answersWith(['five-1', 'five-2']));
    expect(result).toMatchObject({
      passed: false,
      errorPoints: 10,
      wrongFivePointQuestions: 2,
      failReason: 'two-five-point-questions',
    });
  });

  it('counts unanswered questions as wrong', () => {
    const answers = answersWith([]);
    delete answers['five-1'];
    delete answers['three-1'];
    delete answers['three-2'];
    expect(scoreExam(questions, answers)).toMatchObject({ passed: false, errorPoints: 11 });
  });
});

describe('assembleExam', () => {
  const pool = PLACEHOLDER_CATALOG.questions;

  it('draws 20 basic and 10 class questions', () => {
    const exam = assembleExam(pool, CLASS_B_FIRST_LICENCE, 42);
    expect(exam).toHaveLength(30);
    expect(exam.filter((x) => x.section === 'basic')).toHaveLength(20);
    expect(exam.filter((x) => x.section === 'class')).toHaveLength(10);
  });

  it('never repeats a question or a mother question', () => {
    for (let seed = 1; seed <= 25; seed++) {
      const exam = assembleExam(pool, CLASS_B_FIRST_LICENCE, seed);
      const mothers = exam.map((x) => x.variantOf ?? x.id);
      expect(new Set(mothers).size).toBe(exam.length);
    }
  });

  it('covers every basic topic', () => {
    const exam = assembleExam(pool, CLASS_B_FIRST_LICENCE, 7);
    const basicTopics = new Set(pool.filter((x) => x.section === 'basic').map((x) => x.topicId));
    const examTopics = new Set(exam.filter((x) => x.section === 'basic').map((x) => x.topicId));
    expect(examTopics).toEqual(basicTopics);
  });

  it('is reproducible for the same seed', () => {
    const ids = (seed: number) => assembleExam(pool, CLASS_B_FIRST_LICENCE, seed).map((x) => x.id);
    expect(ids(99)).toEqual(ids(99));
  });

  it('reports a pool that is too small', () => {
    expect(() => assembleExam(pool.slice(0, 5))).toThrow(NotEnoughQuestionsError);
  });
});
