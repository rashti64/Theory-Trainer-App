/**
 * The fourth dimension: the city's light follows the learner's real clock.
 * Morning is fresh, afternoon is bright, evening is golden, night has lit windows.
 */
export type Mood = 'morning' | 'day' | 'golden' | 'night';

export type Lighting = {
  mood: Mood;
  sky: string;
  fogNear: number;
  fogFar: number;
  hemiSky: string;
  hemiGround: string;
  hemiIntensity: number;
  sun: string;
  sunIntensity: number;
  /** Direction the sunlight comes from (normalised later). */
  sunFrom: [number, number, number];
  /** 0 = windows look like glass, 1 = all lit windows glow. */
  windowGlow: number;
  headlights: boolean;
};

const PRESETS: Record<Mood, Lighting> = {
  morning: {
    mood: 'morning',
    sky: '#CFEFFF',
    fogNear: 55,
    fogFar: 130,
    hemiSky: '#DDF3FF',
    hemiGround: '#9ED37A',
    hemiIntensity: 1.25,
    sun: '#FFF1D6',
    sunIntensity: 2.2,
    sunFrom: [-12, 18, 10],
    windowGlow: 0.15,
    headlights: false,
  },
  day: {
    mood: 'day',
    sky: '#BFE6FF',
    fogNear: 60,
    fogFar: 140,
    hemiSky: '#E6F6FF',
    hemiGround: '#A5DA7F',
    hemiIntensity: 1.15,
    sun: '#FFF6E8',
    sunIntensity: 2.1,
    sunFrom: [-8, 22, 12],
    windowGlow: 0,
    headlights: false,
  },
  golden: {
    mood: 'golden',
    sky: '#FFE3C4',
    fogNear: 55,
    fogFar: 130,
    hemiSky: '#FFEBD6',
    hemiGround: '#A9D27C',
    hemiIntensity: 1.2,
    sun: '#FFCB8E',
    sunIntensity: 2.3,
    sunFrom: [16, 9, 8],
    windowGlow: 0.45,
    headlights: true,
  },
  night: {
    mood: 'night',
    sky: '#1E2A4A',
    fogNear: 40,
    fogFar: 105,
    hemiSky: '#5C6FA8',
    hemiGround: '#24324A',
    hemiIntensity: 0.9,
    sun: '#AFC4FF',
    sunIntensity: 0.9,
    sunFrom: [10, 20, -6],
    windowGlow: 1,
    headlights: true,
  },
};

export function moodForHour(hour: number): Mood {
  if (hour >= 6 && hour < 10) return 'morning';
  if (hour >= 10 && hour < 17) return 'day';
  if (hour >= 17 && hour < 21) return 'golden';
  return 'night';
}

export function lightingFor(date: Date = new Date()): Lighting {
  return PRESETS[moodForHour(date.getHours())];
}

export function lightingForMood(mood: Mood): Lighting {
  return PRESETS[mood];
}
