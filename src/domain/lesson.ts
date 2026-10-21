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
