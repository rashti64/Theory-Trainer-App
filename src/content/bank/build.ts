/**
 * Helpers to write the question bank compactly. All questions are written by
 * our team in our own words; they are NOT the official TÜV | DEKRA catalog.
 */
import type { Question, QuestionPoints, QuestionSection, SignSpec, Situation } from '@/domain/types';

export const BANK_VERSION = 'own-1';

type Pair = [de: string, en: string];
type OptionSpec = [de: string, en: string, correct: boolean];

type Common = {
  id: string;
  points: QuestionPoints;
  q: Pair;
  why: Pair;
};

type McSpec = Common & { options: OptionSpec[]; situation?: { spec: Situation; alt: Pair }; sign?: { spec: SignSpec; alt: Pair } };
type NumSpec = Common & { value: number; unit: Pair };

function mc(topicId: string, section: QuestionSection, { id, points, q, why, options, situation, sign }: McSpec): Question {
  return {
    id,
    catalogVersion: BANK_VERSION,
    topicId,
    section,
    classes: ['B'],
    points,
    kind: 'multiple-choice',
    prompt: { de: q[0], en: q[1] },
    options: options.map(([de, en, correct], i) => ({
      id: `${id}-${String.fromCharCode(97 + i)}`,
      text: { de, en },
      correct,
    })),
    explanation: { de: why[0], en: why[1] },
    media: situation
      ? { type: 'situation', situation: situation.spec, alt: { de: situation.alt[0], en: situation.alt[1] } }
      : sign
        ? { type: 'sign', sign: sign.spec, alt: { de: sign.alt[0], en: sign.alt[1] } }
        : undefined,
  };
}

function num(topicId: string, section: QuestionSection, { id, points, q, why, value, unit }: NumSpec): Question {
  return {
    id,
    catalogVersion: BANK_VERSION,
    topicId,
    section,
    classes: ['B'],
    points,
    kind: 'number',
    prompt: { de: q[0], en: q[1] },
    numberAnswer: { value, unit: { de: unit[0], en: unit[1] } },
    explanation: { de: why[0], en: why[1] },
  };
}

/** Fixes topic and section so each question stays short to write. */
export function topic(topicId: string, section: QuestionSection) {
  return {
    mc: (spec: McSpec) => mc(topicId, section, spec),
    num: (spec: NumSpec) => num(topicId, section, spec),
  };
}

export const KMH: Pair = ['km/h', 'km/h'];
export const M: Pair = ['m', 'm'];
