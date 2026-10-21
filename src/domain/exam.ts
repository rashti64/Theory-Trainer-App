/**
 * Exam simulator rules for the German theory test (Theoretische Fahrerlaubnisprüfung).
 *
 * Class B, first licence (Ersterwerb), per FeV Anlage 7 Teil 1:
 *  - 30 questions: 20 basic (Grundstoff) + 10 class-specific (Zusatzstoff)
 *  - 110 points in total in the official question selection
 *  - pass with at most 10 error points
 *  - fail anyway when two questions worth 5 points are answered wrong
 *
 * Only change these numbers with a source; the QA agent's tests pin them.
 */
import { createRng, shuffle } from './random';
import type { Answer, LicenceClass, Question } from './types';

export type ExamRules = {
  licenceClass: LicenceClass;
  basicQuestions: number;
  classQuestions: number;
  maxErrorPoints: number;
  /** The exam is failed when this many 5-point questions are wrong. */
  failAtWrongFivePointQuestions: number;
};

export const CLASS_B_FIRST_LICENCE: ExamRules = {
  licenceClass: 'B',
  basicQuestions: 20,
  classQuestions: 10,
  maxErrorPoints: 10,
  failAtWrongFivePointQuestions: 2,
};

export function isAnswerCorrect(question: Question, answer: Answer | undefined): boolean {
  if (!answer) return false;

  if (question.kind === 'multiple-choice') {
    if (answer.kind !== 'multiple-choice' || !question.options) return false;
    const correct = question.options.filter((o) => o.correct).map((o) => o.id);
    const selected = new Set(answer.selectedOptionIds);
    if (selected.size !== correct.length) return false;
    return correct.every((id) => selected.has(id));
  }

  if (answer.kind !== 'number' || answer.value === null || !question.numberAnswer) return false;
  return answer.value === question.numberAnswer.value;
}

export type ExamResult = {
  passed: boolean;
  errorPoints: number;
  maxErrorPoints: number;
  totalPoints: number;
  wrongFivePointQuestions: number;
  correctCount: number;
  wrongQuestionIds: string[];
  /** Why the exam was failed, if it was. */
  failReason: 'too-many-error-points' | 'two-five-point-questions' | null;
};

/** Score a finished exam. Unanswered questions count as wrong, as in the real test. */
export function scoreExam(
  questions: Question[],
  answers: Record<string, Answer | undefined>,
  rules: ExamRules = CLASS_B_FIRST_LICENCE,
): ExamResult {
  let errorPoints = 0;
  let wrongFivePointQuestions = 0;
  let totalPoints = 0;
  const wrongQuestionIds: string[] = [];

  for (const question of questions) {
    totalPoints += question.points;
    if (isAnswerCorrect(question, answers[question.id])) continue;
    errorPoints += question.points;
    wrongQuestionIds.push(question.id);
    if (question.points === 5) wrongFivePointQuestions += 1;
  }

  let failReason: ExamResult['failReason'] = null;
  if (errorPoints > rules.maxErrorPoints) failReason = 'too-many-error-points';
  else if (wrongFivePointQuestions >= rules.failAtWrongFivePointQuestions) {
    failReason = 'two-five-point-questions';
  }

  return {
    passed: failReason === null,
    errorPoints,
    maxErrorPoints: rules.maxErrorPoints,
    totalPoints,
    wrongFivePointQuestions,
    correctCount: questions.length - wrongQuestionIds.length,
    wrongQuestionIds,
    failReason,
  };
}

export class NotEnoughQuestionsError extends Error {
  constructor(section: string, needed: number, available: number) {
    super(`Need ${needed} ${section} questions for an exam, but only ${available} are available.`);
    this.name = 'NotEnoughQuestionsError';
  }
}

/**
 * Draw a mock exam: the required number of basic and class questions,
 * spread across topics as evenly as the pool allows, and at most one
 * question per mother question (variants are interchangeable).
 *
 * The official selection follows a fixed point budget per topic; until the
 * licensed catalog and its selection rules arrive, an even spread by topic
 * is a close and honest approximation.
 */
export function assembleExam(
  pool: Question[],
  rules: ExamRules = CLASS_B_FIRST_LICENCE,
  seed: number = Date.now(),
): Question[] {
  const rng = createRng(seed);
  const eligible = pool.filter((q) => q.classes.includes(rules.licenceClass));

  const basic = pickSpread(
    eligible.filter((q) => q.section === 'basic'),
    rules.basicQuestions,
    rng,
    'basic',
  );
  const cls = pickSpread(
    eligible.filter((q) => q.section === 'class'),
    rules.classQuestions,
    rng,
    'class',
  );
  return [...basic, ...cls];
}

function pickSpread(questions: Question[], count: number, rng: () => number, label: string) {
  // One representative per mother question.
  const byMother = new Map<string, Question[]>();
  for (const q of questions) {
    const key = q.variantOf ?? q.id;
    byMother.set(key, [...(byMother.get(key) ?? []), q]);
  }
  const representatives = [...byMother.values()].map((group) => shuffle(group, rng)[0]);

  if (representatives.length < count) {
    throw new NotEnoughQuestionsError(label, count, representatives.length);
  }

  // Round-robin over topics so every topic is represented before any repeats.
  const byTopic = new Map<string, Question[]>();
  for (const q of shuffle(representatives, rng)) {
    byTopic.set(q.topicId, [...(byTopic.get(q.topicId) ?? []), q]);
  }
  const queues = shuffle([...byTopic.values()], rng);
  const picked: Question[] = [];
  while (picked.length < count) {
    for (const queue of queues) {
      const next = queue.shift();
      if (next) picked.push(next);
      if (picked.length === count) break;
    }
  }
  return picked;
}
