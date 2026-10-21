/**
 * Core domain types. These mirror the database schema in
 * supabase/migrations and the catalog import format in docs/catalog-format.md.
 * Keep them free of React and platform code so they stay unit-testable.
 */

/** Languages the app can show. German is always the source of truth. */
export type Locale = 'de' | 'en';

/** Text in every supported language. `de` is required; others fall back to `de`. */
export type LocalizedText = { de: string } & Partial<Record<Exclude<Locale, 'de'>, string>>;

/** Licence classes. v1 ships class B only, but the model supports all of them. */
export type LicenceClass = 'B' | 'A' | 'A1' | 'A2' | 'AM' | 'C' | 'C1' | 'D' | 'D1' | 'L' | 'T' | 'Mofa';

/**
 * Grundstoff (basic material, asked for every class) or
 * Zusatzstoff (class-specific material).
 */
export type QuestionSection = 'basic' | 'class';

/** Error points a wrong answer costs. The official catalog uses 2 to 5. */
export type QuestionPoints = 2 | 3 | 4 | 5;

export type QuestionKind =
  /** One or more correct options; all correct ones must be ticked. */
  | 'multiple-choice'
  /** The learner types a number (e.g. a stopping distance). */
  | 'number';

export type QuestionOption = {
  id: string;
  text: LocalizedText;
  correct: boolean;
};

export type Arm = 'n' | 'e' | 's' | 'w';

/** A junction drawn from above, for right-of-way questions. "You" always come from the south. */
export type Situation = {
  kind: 'crossroads' | 't-junction';
  /** Sign facing traffic that arrives from this arm. */
  signs?: Partial<Record<Arm, 'priority' | 'give-way' | 'stop'>>;
  vehicles: {
    arm: Arm;
    kind: 'car' | 'bike' | 'bus';
    /** Colour name used in the question text: blue, red, green, yellow, orange (= you). */
    color: 'blue' | 'red' | 'green' | 'yellow' | 'orange';
    turn: 'straight' | 'left' | 'right';
    me?: boolean;
  }[];
  /** Arms with a pedestrian crossing the road. */
  pedestrians?: Arm[];
};

/** German traffic signs we can draw (StVO numbers). 274 carries its speed, 310/311 a place name. */
export type SignCode =
  | '101' | '102' | '201' | '205' | '206' | '220' | '250' | '267' | '283' | '286' | '301' | '306' | '307'
  | '274' | '310' | '311'
  | '131' | '138' | '209' | '215' | '237' | '276' | '282' | '314' | '357' | '274.1' | '330.1';

export type SignSpec = { code: SignCode; value?: number; place?: string };

export type QuestionMedia =
  | { type: 'image'; uri: string; alt?: LocalizedText }
  | { type: 'video'; uri: string; posterUri?: string }
  | { type: 'situation'; situation: Situation; alt: LocalizedText }
  | { type: 'sign'; sign: SignSpec; alt: LocalizedText };

export type Question = {
  /** Stable id, e.g. the official number "1.1.02-001" or "demo-007". */
  id: string;
  /** Catalog version this question belongs to, e.g. "2025-04". */
  catalogVersion: string;
  /** Topic id from the learning path (see content/path.ts). */
  topicId: string;
  section: QuestionSection;
  /** Classes that are examined on this question. */
  classes: LicenceClass[];
  points: QuestionPoints;
  kind: QuestionKind;
  prompt: LocalizedText;
  /** Present for 'multiple-choice'. */
  options?: QuestionOption[];
  /** Present for 'number'. */
  numberAnswer?: { value: number; unit?: LocalizedText };
  media?: QuestionMedia;
  /** Short explanation shown after answering. Written by us, not official. */
  explanation?: LocalizedText;
  /** Id of the mother question when this is a variant. */
  variantOf?: string;
};

/** What the learner submitted for one question. */
export type Answer =
  | { kind: 'multiple-choice'; selectedOptionIds: string[] }
  | { kind: 'number'; value: number | null };

export type Catalog = {
  version: string;
  /** ISO date from which this catalog is used in real exams. */
  validFrom: string;
  /** ISO date until which it is valid, if known. */
  validUntil?: string;
  /** True for our own sample data; false for licensed official data. */
  isPlaceholder: boolean;
  questions: Question[];
};
