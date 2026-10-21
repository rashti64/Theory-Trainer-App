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
  { id: 'behaviour', title: { de: 'Verhalten im Verkehr', en: 'Behaviour in traffic' } },
  { id: 'right-of-way', title: { de: 'Vorfahrt', en: 'Right of way' } },
  { id: 'signs', title: { de: 'Verkehrszeichen', en: 'Traffic signs' } },
  { id: 'hazards', title: { de: 'Gefahrenlehre', en: 'Hazard awareness' } },
  { id: 'rules', title: { de: 'Vorschriften', en: 'Rules and duties' } },
  { id: 'environment', title: { de: 'Umweltschutz', en: 'Environment' } },
  { id: 'technology', title: { de: 'Technik', en: 'Vehicle technology' } },
  { id: 'physics', title: { de: 'Fahrphysik', en: 'Driving physics' } },
];

export const UNITS: Unit[] = [
  {
    id: 'u1',
    title: { de: 'Erste Schritte', en: 'First steps' },
    subtitle: { de: 'Tempo und Verhalten', en: 'Speed and behaviour' },
    topicIds: ['behaviour'],
    color: 'blue',
  },
  {
    id: 'u2',
    title: { de: 'Wer fährt zuerst?', en: 'Who goes first?' },
    subtitle: { de: 'Vorfahrt', en: 'Right of way' },
    topicIds: ['right-of-way'],
    color: 'yellow',
  },
  {
    id: 'u3',
    title: { de: 'Schilder lesen', en: 'Reading signs' },
    subtitle: { de: 'Verkehrszeichen', en: 'Traffic signs' },
    topicIds: ['signs'],
    color: 'green',
  },
  {
    id: 'u4',
    title: { de: 'Gefahren erkennen', en: 'Spotting hazards' },
    subtitle: { de: 'Gefahrenlehre', en: 'Hazard awareness' },
    topicIds: ['hazards'],
    color: 'slate',
  },
  {
    id: 'u5',
    title: { de: 'Regeln und Pflichten', en: 'Rules and duties' },
    subtitle: { de: 'Alkohol, Handy, Gurt', en: 'Alcohol, phone, seat belt' },
    topicIds: ['rules', 'environment'],
    color: 'blue',
  },
  {
    id: 'u6',
    title: { de: 'Dein Auto', en: 'Your car' },
    subtitle: { de: 'Technik', en: 'Vehicle technology' },
    topicIds: ['technology'],
    color: 'yellow',
  },
  {
    id: 'u7',
    title: { de: 'Anhalteweg', en: 'Stopping distance' },
    subtitle: { de: 'Fahrphysik', en: 'Driving physics' },
    topicIds: ['physics'],
    color: 'green',
  },
];
