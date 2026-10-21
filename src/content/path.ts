/**
 * The learning path: units in the order learners meet them.
 * Each unit covers one or more topics; every question belongs to exactly one topic.
 * When the licensed catalog arrives, the learning designer maps its official
 * topic numbers onto these topic ids (see docs/catalog-format.md).
 */
import type { LocalizedText } from '@/domain/types';

export type Topic = { id: string; title: LocalizedText };

export type Unit = {
  id: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  topicIds: string[];
  /** Accent colour key from ui/theme.ts, so units are easy to tell apart on the path. */
  color: 'blue' | 'yellow' | 'green' | 'slate';
};

export const TOPICS: Topic[] = [
  { id: 'speed', title: { de: 'Geschwindigkeit & Abstand', en: 'Speed & distance' } },
  { id: 'right-of-way', title: { de: 'Vorfahrt & Vorrang', en: 'Right of way' } },
  { id: 'signs', title: { de: 'Verkehrszeichen & Ampeln', en: 'Signs & traffic lights' } },
  { id: 'people', title: { de: 'Fußgänger, Kinder & Radfahrer', en: 'Pedestrians, children & cyclists' } },
  { id: 'overtaking', title: { de: 'Überholen & Fahrstreifen', en: 'Overtaking & lanes' } },
  { id: 'parking', title: { de: 'Halten & Parken', en: 'Stopping & parking' } },
  { id: 'motorway', title: { de: 'Autobahn', en: 'Motorway' } },
  { id: 'conditions', title: { de: 'Wetter, Nacht & Licht', en: 'Weather, night & lights' } },
  { id: 'fitness', title: { de: 'Fit am Steuer', en: 'Fit to drive' } },
  { id: 'emergency', title: { de: 'Bahnübergang & Notfall', en: 'Level crossings & emergencies' } },
  { id: 'environment', title: { de: 'Umwelt', en: 'Environment' } },
  { id: 'technology', title: { de: 'Technik & Wartung', en: 'Technology & maintenance' } },
  { id: 'physics', title: { de: 'Fahrphysik', en: 'Driving physics' } },
  { id: 'load', title: { de: 'Ladung & Mitfahrer', en: 'Load & passengers' } },
  { id: 'licence', title: { de: 'Führerschein & Probezeit', en: 'Licence & probation' } },
];

const COLORS: Unit['color'][] = ['blue', 'yellow', 'green', 'slate'];

const SUBTITLES: Record<string, LocalizedText> = {
  speed: { de: 'Tempo, Abstand, Sicht', en: 'Speed, gaps, visibility' },
  'right-of-way': { de: 'Wer fährt zuerst?', en: 'Who goes first?' },
  signs: { de: 'Schilder lesen', en: 'Reading signs' },
  people: { de: 'Rücksicht nehmen', en: 'Looking out for others' },
  overtaking: { de: 'Sicher vorbei', en: 'Passing safely' },
  parking: { de: 'Wo darf ich stehen?', en: 'Where may I stop?' },
  motorway: { de: 'Schnell und sicher', en: 'Fast and safe' },
  conditions: { de: 'Regen, Eis und Dunkelheit', en: 'Rain, ice and darkness' },
  fitness: { de: 'Alkohol, Handy, Müdigkeit', en: 'Alcohol, phone, fatigue' },
  emergency: { de: 'Züge, Unfälle, Erste Hilfe', en: 'Trains, crashes, first aid' },
  environment: { de: 'Sparsam fahren', en: 'Driving economically' },
  technology: { de: 'Dein Auto verstehen', en: 'Know your car' },
  physics: { de: 'Anhalteweg rechnen', en: 'Stopping distances' },
  load: { de: 'Sicher beladen', en: 'Loading safely' },
  licence: { de: 'Regeln für Fahranfänger', en: 'Rules for new drivers' },
};

/** One district per topic, in a learning-friendly order. */
export const UNITS: Unit[] = TOPICS.map((topic, i) => ({
  id: `u${i + 1}`,
  title: topic.title,
  subtitle: SUBTITLES[topic.id],
  topicIds: [topic.id],
  color: COLORS[i % COLORS.length],
}));
