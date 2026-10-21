import { topic } from './build';

const t = topic('environment', 'basic');

export const ENVIRONMENT = [
  t.mc({
    id: 'umw-01',
    points: 3,
    q: ['Wie fahren Sie besonders sparsam und umweltschonend?', 'How do you drive in the most economical and eco-friendly way?'],
    options: [
      ['Vorausschauend fahren und früh hochschalten', 'Anticipate and shift up early', true],
      ['Mit niedriger Drehzahl im höchstmöglichen Gang fahren', 'Drive at low revs in the highest sensible gear', true],
      ['Häufig stark beschleunigen und bremsen', 'Accelerate and brake hard often', false],
    ],
    why: ['Gleichmäßiges Fahren spart Kraftstoff, Geld und Abgase.', 'Smooth driving saves fuel, money and emissions.'],
  }),
  t.mc({
    id: 'umw-02',
    points: 3,
    q: ['Dürfen Sie den Motor im Stand unnötig laufen lassen, z. B. zum Warmlaufen?', 'May you leave the engine running unnecessarily while stationary, e.g. to warm up?'],
    options: [
      ['Nein, das ist verboten', 'No, it is forbidden', true],
      ['Ja, im Winter ist es Pflicht', 'Yes, in winter it is required', false],
    ],
    why: ['Unnötiger Lärm und Abgase sind verboten. Der Motor wird beim Fahren am schnellsten warm.', 'Unnecessary noise and fumes are forbidden. The engine warms up fastest when driving.'],
  }),
  t.mc({
    id: 'umw-03',
    points: 3,
    q: ['Was erhöht den Kraftstoffverbrauch?', 'What increases fuel consumption?'],
    options: [
      ['Ein leerer Dachgepäckträger', 'An empty roof rack', true],
      ['Zu niedriger Reifendruck', 'Tyre pressure that is too low', true],
      ['Unnötiges Gepäck im Kofferraum', 'Unnecessary luggage in the boot', true],
    ],
    why: ['Luftwiderstand, Rollwiderstand und Gewicht kosten Kraftstoff.', 'Air resistance, rolling resistance and weight all cost fuel.'],
  }),
  t.mc({
    id: 'umw-04',
    points: 3,
    q: ['Was gilt in einer Umweltzone?', 'What applies in a low-emission zone?'],
    options: [
      ['Ich darf nur mit der vorgeschriebenen Umweltplakette einfahren', 'I may only enter with the required emissions sticker', true],
      ['Ich darf dort nur Schrittgeschwindigkeit fahren', 'I may only drive at walking pace there', false],
    ],
    why: ['Umweltzonen sollen die Luft in Städten verbessern.', 'Low-emission zones aim to improve air quality in cities.'],
  }),
  t.mc({
    id: 'umw-05',
    points: 3,
    q: ['Wie vermeiden Sie unnötige Fahrten?', 'How can you avoid unnecessary car trips?'],
    options: [
      ['Kurze Strecken zu Fuß oder mit dem Rad erledigen', 'Walk or cycle short distances', true],
      ['Fahrten zusammenlegen und Fahrgemeinschaften bilden', 'Combine trips and share rides', true],
      ['Für jede Erledigung einzeln losfahren', 'Make a separate trip for each errand', false],
    ],
    why: ['Auf Kurzstrecken mit kaltem Motor ist der Verbrauch besonders hoch.', 'On short trips with a cold engine, consumption is especially high.'],
  }),
  t.mc({
    id: 'umw-06',
    points: 3,
    q: ['Sie warten vor einer geschlossenen Bahnschranke. Was ist umweltbewusst?', 'You are waiting at a closed level-crossing barrier. What is eco-friendly?'],
    options: [
      ['Den Motor abstellen', 'Switch off the engine', true],
      ['Den Motor laufen lassen, damit ich schnell weiterkomme', 'Keep the engine running so I can leave quickly', false],
    ],
    why: ['Bei längeren Wartezeiten spart Abstellen Kraftstoff und vermeidet Abgase und Lärm.', 'For longer waits, switching off saves fuel and avoids fumes and noise.'],
  }),
  t.mc({
    id: 'umw-07',
    points: 3,
    q: ['Was tun Sie mit Altöl oder einer alten Autobatterie?', 'What do you do with used oil or an old car battery?'],
    options: [
      ['Bei einer Sammelstelle oder beim Händler abgeben', 'Hand them in at a collection point or a dealer', true],
      ['In den Hausmüll werfen', 'Put them in household waste', false],
    ],
    why: ['Altöl und Batterien sind Sondermüll und gefährden Boden und Wasser.', 'Used oil and batteries are hazardous waste and harm soil and water.'],
  }),
  t.mc({
    id: 'umw-08',
    points: 3,
    q: ['Wie beeinflusst die Geschwindigkeit den Verbrauch?', 'How does speed affect consumption?'],
    options: [
      ['Mit höherer Geschwindigkeit steigt der Verbrauch stark an', 'Consumption rises steeply at higher speeds', true],
      ['Der Verbrauch ist bei jeder Geschwindigkeit gleich', 'Consumption is the same at any speed', false],
    ],
    why: ['Der Luftwiderstand wächst mit dem Quadrat der Geschwindigkeit.', 'Air resistance grows with the square of speed.'],
  }),

  t.mc({
    id: 'umw-09',
    points: 2,
    q: ['Wie wirkt sich zu niedriger Reifendruck aus?', 'What is the effect of tyre pressure that is too low?'],
    options: [
      ['Der Kraftstoffverbrauch steigt', 'Fuel consumption goes up', true],
      ['Die Reifen nutzen sich schneller ab', 'The tyres wear out faster', true],
      ['Das Auto fährt sparsamer', 'The car uses less fuel', false],
    ],
    why: ['Zu wenig Luft erhöht den Rollwiderstand. Prüfen Sie den Druck regelmäßig bei kalten Reifen.', 'Too little air increases rolling resistance. Check the pressure regularly with cold tyres.'],
  }),
  t.mc({
    id: 'umw-10',
    points: 2,
    q: ['Sie brauchen Ihre Dachbox gerade nicht. Was ist umweltbewusst?', 'You do not need your roof box at the moment. What is environmentally aware?'],
    options: [
      ['Sie abnehmen, weil sie den Luftwiderstand und den Verbrauch erhöht', 'Take it off, because it increases drag and fuel use', true],
      ['Sie montiert lassen, das macht keinen Unterschied', 'Leave it on, it makes no difference', false],
    ],
    why: ['Dachaufbauten erhöhen den Luftwiderstand deutlich, besonders bei hohem Tempo.', 'Roof attachments add a lot of drag, especially at high speed.'],
  }),
  t.mc({
    id: 'umw-11',
    points: 2,
    q: ['Was erhöht außerdem den Kraftstoffverbrauch?', 'What else increases fuel consumption?'],
    options: [
      ['Die Klimaanlage', 'The air conditioning', true],
      ['Unnötiges Gepäck im Kofferraum', 'Unnecessary luggage in the boot', true],
      ['Vorausschauendes Fahren', 'Anticipating the traffic', false],
    ],
    why: ['Jede zusätzliche Last und jeder Verbraucher kostet Energie. Schalten Sie die Klimaanlage nur bei Bedarf ein.', 'Every extra load and every device costs energy. Use the air conditioning only when needed.'],
  }),
  t.mc({
    id: 'umw-12',
    points: 2,
    q: ['Wozu dient eine Start-Stopp-Automatik?', 'What is an automatic start-stop system for?'],
    options: [
      ['Sie schaltet den Motor im Stand ab und spart so Kraftstoff', 'It switches off the engine when stationary and saves fuel', true],
      ['Sie verhindert, dass das Auto abgewürgt wird', 'It prevents the car from stalling', false],
    ],
    why: ['An Ampeln und im Stau läuft der Motor nicht unnötig. Das spart Kraftstoff und vermeidet Abgase und Lärm.', 'At lights and in traffic jams the engine does not idle needlessly. That saves fuel and avoids fumes and noise.'],
  }),
  t.mc({
    id: 'umw-13',
    points: 2,
    q: ['Wie vermeiden Sie unnötigen Lärm?', 'How do you avoid unnecessary noise?'],
    options: [
      ['Nicht unnötig hupen und Türen leise schließen', 'Do not sound the horn needlessly and close doors quietly', true],
      ['Im Stand nicht hochtourig Gas geben', 'Do not rev the engine while stationary', true],
      ['Mit offenem Fenster laut Musik hören', 'Play loud music with the window open', false],
    ],
    why: ['Lärm belastet Anwohner. Unnötiger Lärm ist auch verboten.', 'Noise disturbs residents. Unnecessary noise is also forbidden.'],
  }),
  t.mc({
    id: 'umw-14',
    points: 2,
    q: ['Sie rollen auf eine rote Ampel zu. Wie fahren Sie sparsam?', 'You are rolling towards a red light. How do you drive economically?'],
    options: [
      ['Früh vom Gas gehen und im Gang ausrollen lassen', 'Lift off early and let the car roll in gear', true],
      ['Bis kurz vor der Ampel Gas geben und dann bremsen', 'Keep accelerating until just before the lights, then brake', false],
    ],
    why: ['Rollt das Auto mit eingelegtem Gang, wird meist kein Kraftstoff eingespritzt (Schubabschaltung).', 'When the car rolls in gear, usually no fuel is injected (overrun fuel cut-off).'],
  }),
];
