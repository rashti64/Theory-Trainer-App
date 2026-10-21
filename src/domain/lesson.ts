/**
 * Builds a short lesson (default 10 questions) for one unit of the learning path.
 * Order of preference: questions that are due for review, then new questions,
 * then the weakest known questions. 5-point questions are favoured within each group.
 */
import { createRng, shuffle } from './random';
import { isDue, type ProgressMap } from './srs';
import type { Question } from './types';

export const DEFAULT_LESSON_SIZE = 10;

export function buildLesson(
  pool: Question[],
  topicIds: string[],
  progress: ProgressMap,
  today: string,
  options: { size?: number; seed?: number } = {},
): Question[] {
  const size = options.size ?? DEFAULT_LESSON_SIZE;
  const rng = createRng(options.seed ?? Date.now());
  const inUnit = pool.filter((q) => topicIds.includes(q.topicId));

  const byPointsDesc = (a: Question, b: Question) => b.points - a.points;
  const due = shuffle(
    inUnit.filter((q) => isDue(progress[q.id], today)),
    rng,
  ).sort(byPointsDesc);
  const fresh = shuffle(
    inUnit.filter((q) => progress[q.id] === undefined),
    rng,
  ).sort(byPointsDesc);
  const known = inUnit
    .filter((q) => progress[q.id] !== undefined && !isDue(progress[q.id], today))
    .sort((a, b) => (progress[a.id]?.box ?? 0) - (progress[b.id]?.box ?? 0));

  const lesson: Question[] = [];
  const seenMothers = new Set<string>();
  for (const q of [...due, ...fresh, ...known]) {
    const mother = q.variantOf ?? q.id;
    if (seenMothers.has(mother)) continue;
    seenMothers.add(mother);
    lesson.push(q);
    if (lesson.length === size) break;
  }
  return shuffle(lesson, rng);
}

/** A review lesson of the questions answered wrong most often, across all topics. */
export function buildMistakesReview(
  pool: Question[],
  progress: ProgressMap,
  size: number = DEFAULT_LESSON_SIZE,
): Question[] {
  return pool
    .filter((q) => (progress[q.id]?.timesWrong ?? 0) > 0)
    .sort((a, b) => {
      const pa = progress[a.id]!;
      const pb = progress[b.id]!;
      return pa.box - pb.box || pb.timesWrong - pa.timesWrong || b.points - a.points;
    })
    .slice(0, size);
}

/** Picks questions round-robin across topics so every topic is represented. */
function spreadAcrossTopics(questions: Question[], size: number, rng: () => number): Question[] {
  const byTopic = new Map<string, Question[]>();
  for (const q of shuffle(questions, rng)) byTopic.set(q.topicId, [...(byTopic.get(q.topicId) ?? []), q]);
  const queues = [...byTopic.values()];
  const picked: Question[] = [];
  const mothers = new Set<string>();
  while (picked.length < size && queues.some((qs) => qs.length > 0)) {
    for (const queue of queues) {
      const next = queue.shift();
      if (!next || mothers.has(next.variantOf ?? next.id)) continue;
      mothers.add(next.variantOf ?? next.id);
      picked.push(next);
      if (picked.length === size) break;
    }
  }
  return picked;
}

export const ENTRY_TEST_SIZE = 20;

/**
 * Entry test: questions from every topic, weighted towards the important
 * (4- and 5-point) ones, to show where a new learner stands.
 */
export function buildEntryTest(pool: Question[], seed: number = Date.now(), size: number = ENTRY_TEST_SIZE): Question[] {
  const rng = createRng(seed);
  const important = pool.filter((q) => q.points >= 4);
  const rest = pool.filter((q) => q.points < 4);
  const first = spreadAcrossTopics(important, Math.ceil(size * 0.6), rng);
  const second = spreadAcrossTopics(rest, size - first.length, rng);
  return shuffle([...first, ...second], rng);
}

export const UNIT_TEST_SIZE = 12;
export const UNIT_TEST_PASS = 0.8;

/** End-of-unit test: a mixed set from the whole unit, no hints, 80 % to pass. */
export function buildUnitTest(pool: Question[], topicIds: string[], seed: number = Date.now()): Question[] {
  const rng = createRng(seed);
  const inUnit = pool.filter((q) => topicIds.includes(q.topicId));
  const mothers = new Set<string>();
  const out: Question[] = [];
  for (const q of shuffle(inUnit, rng)) {
    const m = q.variantOf ?? q.id;
    if (mothers.has(m)) continue;
    mothers.add(m);
    out.push(q);
    if (out.length === UNIT_TEST_SIZE) break;
  }
  return out;
}

export function unitTestPassed(correct: number, total: number): boolean {
  return total > 0 && correct / total >= UNIT_TEST_PASS;
}

/**
 * Today's session from the study plan: everything due for review first,
 * then new questions in learning-path order (topic by topic).
 */
export function buildDailySession(
  pool: Question[],
  topicOrder: string[],
  progress: ProgressMap,
  today: string,
  newCount: number,
  options: { maxSize?: number; seed?: number } = {},
): Question[] {
  const rng = createRng(options.seed ?? Date.now());
  const maxSize = options.maxSize ?? 15;
  const due = shuffle(
    pool.filter((q) => isDue(progress[q.id], today)),
    rng,
  ).sort((a, b) => (progress[a.id]?.box ?? 0) - (progress[b.id]?.box ?? 0));
  const rank = (q: Question) => {
    const i = topicOrder.indexOf(q.topicId);
    return i < 0 ? topicOrder.length : i;
  };
  const fresh = pool.filter((q) => progress[q.id] === undefined).sort((a, b) => rank(a) - rank(b));
  const reviewSlots = Math.max(maxSize - Math.min(newCount, fresh.length), Math.floor(maxSize / 2));
  const session = [...due.slice(0, reviewSlots), ...fresh.slice(0, newCount)].slice(0, maxSize);
  return shuffle(session, rng);
}
