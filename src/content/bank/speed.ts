import { KMH, M, topic } from './build';

const t = topic('speed', 'basic');

export const SPEED = [
  t.num({
    id: 'spd-01',
    points: 3,
    q: ['Wie schnell dürfen Sie mit dem Pkw innerorts höchstens fahren, wenn kein Schild etwas anderes erlaubt?', 'What is the maximum speed for a car in a built-up area unless a sign says otherwise?'],
    value: 50,
    unit: KMH,
    why: ['Innerhalb geschlossener Ortschaften gilt für alle Kraftfahrzeuge 50 km/h.', 'Inside built-up areas the general limit for all motor vehicles is 50 km/h.'],
  }),
  t.num({
    id: 'spd-02',
    points: 3,
    q: ['Wie schnell darf ein Pkw außerorts auf einer Landstraße höchstens fahren, wenn kein Schild etwas anderes regelt?', 'What is the maximum speed for a car on a rural road outside built-up areas unless signs say otherwise?'],
    value: 100,
    unit: KMH,
    why: ['Außerorts gilt für Pkw 100 km/h. Auf Autobahnen gibt es keine allgemeine Höchstgeschwindigkeit, aber eine Richtgeschwindigkeit von 130 km/h.', 'Outside built-up areas cars may go up to 100 km/h. Motorways have no general limit, only a recommended 130 km/h.'],
  }),
  t.num({
    id: 'spd-03',
    points: 4,
    q: ['Nebel, Schnee oder Regen begrenzen die Sicht auf weniger als 50 m. Wie schnell dürfen Sie höchstens fahren?', 'Fog, snow or rain limits visibility to under 50 m. What is the maximum speed you may drive?'],
    value: 50,
    unit: KMH,
    why: ['Bei Sichtweiten unter 50 m durch Nebel, Schneefall oder Regen sind höchstens 50 km/h erlaubt – auch auf der Autobahn.', 'With visibility under 50 m due to fog, snow or rain, the limit is 50 km/h – even on the motorway.'],
  }),
  t.num({
    id: 'spd-04',
    points: 3,
    q: ['Sie fahren mit Schneeketten. Wie schnell dürfen Sie höchstens fahren?', 'You are driving with snow chains. What is the maximum speed?'],
    value: 50,
    unit: KMH,
    why: ['Mit Schneeketten gilt eine Höchstgeschwindigkeit von 50 km/h.', 'With snow chains fitted, the maximum speed is 50 km/h.'],
  }),
  t.num({
    id: 'spd-05',
    points: 3,
    q: ['Ihr Pkw zieht einen Anhänger. Wie schnell dürfen Sie außerorts (auch auf der Autobahn) grundsätzlich höchstens fahren?', 'Your car is towing a trailer. What is the general maximum speed outside built-up areas, motorways included?'],
    value: 80,
    unit: KMH,
    why: ['Pkw mit Anhänger dürfen außerorts 80 km/h fahren. Nur mit einer besonderen Zulassung (Tempo-100-Plakette) sind auf Autobahnen 100 km/h erlaubt.', 'Cars with a trailer may drive 80 km/h outside towns. Only with a special approval (100 km/h sticker) are 100 km/h allowed on motorways.'],
  }),
  t.num({
    id: 'spd-06',
    points: 3,
    q: ['Welchen Abstand sollten Sie außerorts bei 80 km/h zum Vorausfahrenden mindestens halten? (Faustregel „halber Tacho“)', 'What minimum gap should you keep to the vehicle ahead at 80 km/h outside towns? (Rule of thumb: "half the speedometer")'],
    value: 40,
    unit: M,
    why: ['Halber Tacho in Metern: 80 ÷ 2 = 40 m. Das entspricht etwa 1,8 Sekunden Abstand.', 'Half the speedometer in metres: 80 ÷ 2 = 40 m. That is about 1.8 seconds.'],
  }),
  t.mc({
    id: 'spd-07',
    points: 4,
    q: ['Was bedeutet „auf Sicht fahren“?', 'What does "driving within your range of vision" mean?'],
    options: [
      ['Ich muss innerhalb der überschaubaren Strecke anhalten können', 'I must be able to stop within the distance I can see', true],
      ['Auf schmalen Straßen muss ich innerhalb der Hälfte der überschaubaren Strecke anhalten können', 'On narrow roads I must be able to stop within half the distance I can see', true],
      ['Ich darf so schnell fahren, wie die Scheinwerfer reichen, plus 50 m', 'I may drive as fast as my headlights reach, plus 50 m', false],
    ],
    why: ['Wer nicht vor einem plötzlichen Hindernis anhalten kann, fährt zu schnell. Auf schmalen Straßen muss auch der Gegenverkehr anhalten können – deshalb die Hälfte.', 'If you cannot stop before a sudden obstacle, you are too fast. On narrow roads oncoming traffic needs room to stop too – hence half.'],
  }),
  t.mc({
    id: 'spd-08',
    points: 4,
    q: ['Wann müssen Sie langsamer fahren, als es erlaubt ist?', 'When must you drive slower than the speed limit allows?'],
    options: [
      ['Bei Glätte, Nässe oder schlechter Sicht', 'On slippery or wet roads or in poor visibility', true],
      ['Vor unübersichtlichen Kurven und Kuppen', 'Before blind bends and hill crests', true],
      ['Nur wenn ein Schild es verlangt', 'Only when a sign requires it', false],
    ],
    why: ['Die Höchstgeschwindigkeit ist eine Obergrenze. Sie müssen die Geschwindigkeit immer an Straße, Verkehr, Sicht und Wetter anpassen.', 'The limit is a ceiling. You must always adapt your speed to the road, traffic, visibility and weather.'],
  }),
  t.mc({
    id: 'spd-09',
    points: 3,
    q: ['Wie können Sie einfach prüfen, ob Ihr Abstand ausreicht?', 'How can you easily check whether your following distance is enough?'],
    options: [
      ['Ich zähle die Sekunden, bis ich die Stelle erreiche, die der Vordermann gerade passiert hat – mindestens 2', 'I count the seconds until I reach the spot the car ahead just passed – at least 2', true],
      ['Ich muss die Kennzeichen des Vordermanns gerade noch lesen können', 'I should just about be able to read the number plate ahead', false],
      ['Eine Wagenlänge Abstand reicht bei jeder Geschwindigkeit', 'One car length is enough at any speed', false],
    ],
    why: ['Die 2-Sekunden-Regel passt sich automatisch an jede Geschwindigkeit an. Bei Nässe besser mehr.', 'The two-second rule scales with any speed. Leave more on wet roads.'],
  }),
  t.mc({
    id: 'spd-10',
    points: 4,
    q: ['Darf der Vorausfahrende ohne Grund plötzlich stark bremsen?', 'May the driver ahead brake hard suddenly without a reason?'],
    options: [
      ['Nein, nur bei einem zwingenden Grund', 'No, only for a compelling reason', true],
      ['Ja, wenn der Hintermann zu dicht auffährt', 'Yes, if the driver behind is tailgating', false],
      ['Ja, um den Hintermann zu warnen', 'Yes, to warn the driver behind', false],
    ],
    why: ['Grundloses starkes Bremsen ist verboten und gefährlich – auch gegenüber Dränglern.', 'Braking hard without reason is forbidden and dangerous – even towards tailgaters.'],
  }),
  t.mc({
    id: 'spd-11',
    points: 3,
    q: ['Dürfen Sie ohne triftigen Grund sehr langsam fahren?', 'May you drive very slowly without a good reason?'],
    options: [
      ['Nein, wenn ich dadurch den Verkehr behindere', 'No, if it holds up other traffic', true],
      ['Ja, langsam fahren ist immer sicher', 'Yes, driving slowly is always safe', false],
    ],
    why: ['Wer ohne Grund so langsam fährt, dass er den Verkehrsfluss behindert, handelt ordnungswidrig.', 'Driving so slowly without reason that you hold up traffic is an offence.'],
  }),
  t.mc({
    id: 'spd-12',
    points: 4,
    q: ['Wann sollten Sie den Abstand zum Vorausfahrenden vergrößern?', 'When should you increase the gap to the vehicle ahead?'],
    options: [
      ['Bei nasser oder glatter Fahrbahn', 'On a wet or slippery road', true],
      ['Hinter einem Lkw, um mehr zu sehen', 'Behind a truck, to see further ahead', true],
      ['Wenn ich es eilig habe', 'When I am in a hurry', false],
    ],
    why: ['Auf nasser Straße wird der Bremsweg länger. Hinter großen Fahrzeugen sehen Sie mehr, wenn Sie mehr Abstand halten.', 'Braking distances grow on wet roads. Behind large vehicles a bigger gap lets you see further ahead.'],
  }),
  t.mc({
    id: 'spd-13',
    points: 3,
    q: ['Was gilt in einer Tempo-30-Zone?', 'What applies in a 30 km/h zone?'],
    options: [
      ['Ich darf höchstens 30 km/h fahren', 'I may drive at most 30 km/h', true],
      ['An Kreuzungen ohne Schilder gilt meist „rechts vor links“', 'At junctions without signs, "right before left" usually applies', true],
      ['30 km/h ist die Mindestgeschwindigkeit', '30 km/h is the minimum speed', false],
    ],
    why: ['In Tempo-30-Zonen sind Kreuzungen meist nicht beschildert. Rechnen Sie mit Verkehr von rechts.', 'Junctions in 30 zones are usually unsigned. Expect traffic from the right.'],
  }),
  t.mc({
    id: 'spd-14',
    points: 4,
    q: ['Sie fahren in einen verkehrsberuhigten Bereich („Spielstraße“). Was gilt?', 'You enter a traffic-calmed area ("play street"). What applies?'],
    options: [
      ['Ich muss Schrittgeschwindigkeit fahren', 'I must drive at walking pace', true],
      ['Fußgänger dürfen die ganze Straße benutzen und Kinder überall spielen', 'Pedestrians may use the whole street and children may play anywhere', true],
      ['Parken ist überall erlaubt', 'Parking is allowed everywhere', false],
    ],
    why: ['Im verkehrsberuhigten Bereich haben Fußgänger und spielende Kinder Vorrang vor dem Fahrzeugverkehr. Parken nur auf markierten Flächen.', 'In a traffic-calmed area pedestrians and playing children come first. Parking only in marked bays.'],
  }),
  t.mc({
    id: 'spd-15',
    points: 3,
    q: ['Was ist die Folge, wenn Sie Ihre Geschwindigkeit verdoppeln?', 'What happens when you double your speed?'],
    options: [
      ['Der Bremsweg wird etwa viermal so lang', 'The braking distance becomes about four times as long', true],
      ['Die Aufprallenergie wird etwa viermal so groß', 'The impact energy becomes about four times as large', true],
      ['Der Reaktionsweg bleibt gleich', 'The reaction distance stays the same', false],
    ],
    why: ['Bremsweg und Bewegungsenergie wachsen mit dem Quadrat der Geschwindigkeit; der Reaktionsweg verdoppelt sich.', 'Braking distance and kinetic energy grow with the square of speed; the reaction distance doubles.'],
  }),

  t.mc({
    id: 'spd-16',
    points: 3,
    q: ['Ab welcher Stelle gilt eine Geschwindigkeitsbeschränkung durch ein Verkehrszeichen?', 'From which point does a speed limit shown by a sign apply?'],
    options: [
      ['Ab dem Verkehrszeichen', 'From the sign itself', true],
      ['Erst 100 m nach dem Zeichen', 'Only 100 m after the sign', false],
      ['Ab der nächsten Kreuzung', 'From the next junction', false],
    ],
    why: ['Sie müssen so rechtzeitig bremsen, dass Sie am Schild nicht schneller als erlaubt sind.', 'Brake early enough that you are not over the limit when you reach the sign.'],
  }),
];
