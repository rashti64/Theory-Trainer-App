import { M, topic } from './build';

const t = topic('physics', 'class');

const FORMULAS: [string, string] = [
  'Faustformeln: Reaktionsweg = (v ÷ 10) × 3 · normaler Bremsweg = (v ÷ 10)² · Gefahrbremsung = (v ÷ 10)² ÷ 2 · Anhalteweg = Reaktionsweg + Bremsweg.',
  'Rules of thumb: reaction distance = (v ÷ 10) × 3 · normal braking = (v ÷ 10)² · emergency braking = (v ÷ 10)² ÷ 2 · stopping distance = reaction + braking.',
];

export const PHYSICS = [
  t.num({
    id: 'phy-01',
    points: 3,
    q: ['Wie lang ist der Reaktionsweg bei 50 km/h nach der Faustformel?', 'How long is the reaction distance at 50 km/h by the rule of thumb?'],
    value: 15,
    unit: M,
    why: ['(50 ÷ 10) × 3 = 15 m. ' + FORMULAS[0], '(50 ÷ 10) × 3 = 15 m. ' + FORMULAS[1]],
  }),
  t.num({
    id: 'phy-02',
    points: 3,
    q: ['Wie lang ist der Reaktionsweg bei 100 km/h nach der Faustformel?', 'How long is the reaction distance at 100 km/h by the rule of thumb?'],
    value: 30,
    unit: M,
    why: ['(100 ÷ 10) × 3 = 30 m.', '(100 ÷ 10) × 3 = 30 m.'],
  }),
  t.num({
    id: 'phy-03',
    points: 3,
    q: ['Wie lang ist der normale Bremsweg bei 50 km/h nach der Faustformel?', 'How long is the normal braking distance at 50 km/h by the rule of thumb?'],
    value: 25,
    unit: M,
    why: ['(50 ÷ 10)² = 5 × 5 = 25 m.', '(50 ÷ 10)² = 5 × 5 = 25 m.'],
  }),
  t.num({
    id: 'phy-04',
    points: 3,
    q: ['Wie lang ist der normale Bremsweg bei 100 km/h nach der Faustformel?', 'How long is the normal braking distance at 100 km/h by the rule of thumb?'],
    value: 100,
    unit: M,
    why: ['(100 ÷ 10)² = 10 × 10 = 100 m.', '(100 ÷ 10)² = 10 × 10 = 100 m.'],
  }),
  t.num({
    id: 'phy-05',
    points: 4,
    q: ['Wie lang ist der Bremsweg bei einer Gefahrbremsung aus 100 km/h nach der Faustformel?', 'How long is the braking distance in an emergency stop from 100 km/h by the rule of thumb?'],
    value: 50,
    unit: M,
    why: ['Bei einer Gefahrbremsung halbiert sich der Bremsweg: (100 ÷ 10)² ÷ 2 = 50 m.', 'In an emergency stop the braking distance halves: (100 ÷ 10)² ÷ 2 = 50 m.'],
  }),
  t.num({
    id: 'phy-06',
    points: 4,
    q: ['Wie lang ist der Anhalteweg bei 100 km/h mit normaler Bremsung nach der Faustformel?', 'How long is the stopping distance at 100 km/h with normal braking by the rule of thumb?'],
    value: 130,
    unit: M,
    why: ['Reaktionsweg 30 m + Bremsweg 100 m = 130 m.', 'Reaction 30 m + braking 100 m = 130 m.'],
  }),
  t.num({
    id: 'phy-07',
    points: 4,
    q: ['Wie lang ist der Anhalteweg bei 80 km/h mit normaler Bremsung nach der Faustformel?', 'How long is the stopping distance at 80 km/h with normal braking by the rule of thumb?'],
    value: 88,
    unit: M,
    why: ['Reaktionsweg (8 × 3 =) 24 m + Bremsweg (8 × 8 =) 64 m = 88 m.', 'Reaction (8 × 3 =) 24 m + braking (8 × 8 =) 64 m = 88 m.'],
  }),
  t.num({
    id: 'phy-08',
    points: 4,
    q: ['Wie lang ist der Anhalteweg bei 50 km/h mit Gefahrbremsung nach der Faustformel?', 'How long is the stopping distance at 50 km/h with emergency braking by the rule of thumb?'],
    value: 27.5,
    unit: M,
    why: ['Reaktionsweg 15 m + Bremsweg (25 ÷ 2 =) 12,5 m = 27,5 m.', 'Reaction 15 m + braking (25 ÷ 2 =) 12.5 m = 27.5 m.'],
  }),
  t.mc({
    id: 'phy-09',
    points: 4,
    q: ['Sie fahren doppelt so schnell. Was passiert mit dem Bremsweg?', 'You drive twice as fast. What happens to the braking distance?'],
    options: [
      ['Er wird etwa viermal so lang', 'It becomes about four times as long', true],
      ['Er wird doppelt so lang', 'It doubles', false],
      ['Er bleibt gleich', 'It stays the same', false],
    ],
    why: ['Der Bremsweg wächst mit dem Quadrat der Geschwindigkeit. Dreifache Geschwindigkeit bedeutet etwa neunfachen Bremsweg.', 'Braking distance grows with the square of speed. Three times the speed means about nine times the distance.'],
  }),
  t.mc({
    id: 'phy-10',
    points: 4,
    q: ['Was verlängert den Bremsweg?', 'What makes the braking distance longer?'],
    options: [
      ['Nasse oder glatte Fahrbahn', 'A wet or slippery road', true],
      ['Abgefahrene Reifen', 'Worn tyres', true],
      ['Schwere Beladung', 'A heavy load', true],
    ],
    why: ['Weniger Haftung oder mehr Masse bedeuten einen längeren Bremsweg.', 'Less grip or more mass means a longer braking distance.'],
  }),
  t.mc({
    id: 'phy-11',
    points: 4,
    q: ['Was verlängert die Reaktionszeit?', 'What makes your reaction time longer?'],
    options: [
      ['Müdigkeit', 'Tiredness', true],
      ['Alkohol und Medikamente', 'Alcohol and medicines', true],
      ['Ablenkung, z. B. durch das Handy', 'Distraction, e.g. from a phone', true],
    ],
    why: ['Schon eine Sekunde mehr Reaktionszeit bedeutet bei 50 km/h etwa 14 m mehr Weg.', 'Just one more second of reaction at 50 km/h means about 14 m more distance.'],
  }),
  t.mc({
    id: 'phy-12',
    points: 4,
    q: ['Sie fahren doppelt so schnell durch eine Kurve. Wie verändert sich die Fliehkraft?', 'You take a bend at twice the speed. How does the centrifugal force change?'],
    options: [
      ['Sie wird etwa viermal so groß', 'It becomes about four times as large', true],
      ['Sie verdoppelt sich', 'It doubles', false],
    ],
    why: ['Auch die Fliehkraft wächst mit dem Quadrat der Geschwindigkeit. Deshalb vor der Kurve bremsen, nicht in ihr.', 'Centrifugal force also grows with the square of speed. So brake before the bend, not in it.'],
  }),
  t.mc({
    id: 'phy-13',
    points: 3,
    q: ['Wie fahren Sie richtig durch eine Kurve?', 'How do you take a bend correctly?'],
    options: [
      ['Vor der Kurve abbremsen', 'Brake before the bend', true],
      ['In der Kurve leicht Gas geben', 'Apply gentle throttle through the bend', true],
      ['In der Kurve stark bremsen', 'Brake hard in the bend', false],
    ],
    why: ['Starkes Bremsen in der Kurve kann das Auto aus der Spur bringen.', 'Braking hard in a bend can push the car off its line.'],
  }),

  t.num({
    id: 'phy-14',
    points: 3,
    q: ['Wie viele Meter fahren Sie bei 100 km/h in einer Sekunde ungefähr? (Geschwindigkeit ÷ 3,6, gerundet)', 'About how many metres do you travel in one second at 100 km/h? (speed ÷ 3.6, rounded)'],
    value: 28,
    unit: M,
    why: ['100 ÷ 3,6 ≈ 27,8 m pro Sekunde. Schon eine Sekunde Ablenkung bedeutet fast 28 m Blindflug.', '100 ÷ 3.6 ≈ 27.8 m per second. One second of distraction means almost 28 m driven blind.'],
  }),
  t.num({
    id: 'phy-15',
    points: 3,
    q: ['Wie lang ist der Reaktionsweg bei 70 km/h nach der Faustformel?', 'How long is the reaction distance at 70 km/h by the rule of thumb?'],
    value: 21,
    unit: M,
    why: ['(70 ÷ 10) × 3 = 21 m.', '(70 ÷ 10) × 3 = 21 m.'],
  }),
  t.num({
    id: 'phy-16',
    points: 3,
    q: ['Wie lang ist der normale Bremsweg bei 70 km/h nach der Faustformel?', 'How long is the normal braking distance at 70 km/h by the rule of thumb?'],
    value: 49,
    unit: M,
    why: ['(70 ÷ 10) × (70 ÷ 10) = 7 × 7 = 49 m.', '(70 ÷ 10) × (70 ÷ 10) = 7 × 7 = 49 m.'],
  }),
  t.num({
    id: 'phy-17',
    points: 4,
    q: ['Wie lang ist der Bremsweg bei einer Gefahrbremsung aus 50 km/h nach der Faustformel?', 'How long is the braking distance in an emergency stop from 50 km/h by the rule of thumb?'],
    value: 12.5,
    unit: M,
    why: ['Gefahrbremsung: (50 ÷ 10)² ÷ 2 = 25 ÷ 2 = 12,5 m.', 'Emergency stop: (50 ÷ 10)² ÷ 2 = 25 ÷ 2 = 12.5 m.'],
  }),
  t.mc({
    id: 'phy-18',
    points: 4,
    q: ['Sie fahren 50 statt 30 km/h. Wie verändert sich der Anhalteweg mit normaler Bremsung ungefähr?', 'You drive at 50 instead of 30 km/h. Roughly how does the stopping distance with normal braking change?'],
    options: [
      ['Er wird mehr als doppelt so lang', 'It becomes more than twice as long', true],
      ['Er wird nur etwa um die Hälfte länger', 'It becomes only about half as long again', false],
      ['Er bleibt etwa gleich', 'It stays about the same', false],
    ],
    why: ['Bei 30 km/h: 9 m + 9 m = 18 m. Bei 50 km/h: 15 m + 25 m = 40 m. Deshalb ist Tempo 30 vor Schulen so wichtig.', 'At 30 km/h: 9 m + 9 m = 18 m. At 50 km/h: 15 m + 25 m = 40 m. That is why 30 km/h near schools matters so much.'],
  }),
];
