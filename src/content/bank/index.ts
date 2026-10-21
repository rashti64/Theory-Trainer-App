/**
 * Our own class B question bank: written by the team in our own words to
 * teach the whole syllabus. It is NOT the official TÜV | DEKRA catalog;
 * the licensed catalog can replace it through the import pipeline later.
 */
import type { Catalog } from '@/domain/types';

import { BANK_VERSION } from './build';
import { CONDITIONS } from './conditions';
import { EMERGENCY } from './emergency';
import { ENVIRONMENT } from './environment';
import { FITNESS } from './fitness';
import { LICENCE } from './licence';
import { LOAD } from './load';
import { MOTORWAY } from './motorway';
import { OVERTAKING } from './overtaking';
import { PARKING } from './parking';
import { PEOPLE } from './people';
import { PHYSICS } from './physics';
import { RIGHT_OF_WAY } from './right-of-way';
import { SIGNS } from './signs';
import { SPEED } from './speed';
import { TECHNOLOGY } from './technology';

export const QUESTION_BANK: Catalog = {
  version: BANK_VERSION,
  validFrom: '2026-10-21',
  isPlaceholder: true,
  questions: [
    ...SPEED,
    ...RIGHT_OF_WAY,
    ...SIGNS,
    ...PEOPLE,
    ...OVERTAKING,
    ...PARKING,
    ...MOTORWAY,
    ...CONDITIONS,
    ...FITNESS,
    ...EMERGENCY,
    ...ENVIRONMENT,
    ...TECHNOLOGY,
    ...PHYSICS,
    ...LOAD,
    ...LICENCE,
  ],
};
