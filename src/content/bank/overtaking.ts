import { topic } from './build';

const t = topic('overtaking', 'basic');

export const OVERTAKING = [
  t.mc({
    id: 'ubh-01',
    points: 5,
    q: ['Wann ist Überholen verboten?', 'When is overtaking forbidden?'],
    options: [
      ['Bei unklarer Verkehrslage', 'When the traffic situation is unclear', true],
      ['Wenn der Gegenverkehr behindert oder gefährdet würde', 'When oncoming traffic would be obstructed or endangered', true],
      ['Wenn der Vorausfahrende langsamer als erlaubt fährt', 'When the driver ahead is slower than the limit', false],
    ],
    why: ['Überholen darf nur, wer übersehen kann, dass niemand gefährdet wird, und wer deutlich schneller ist.', 'You may only overtake if you can see nobody will be endangered and you are clearly faster.'],
  }),
  t.mc({
    id: 'ubh-02',
    points: 4,
    q: ['Auf welcher Seite wird grundsätzlich überholt?', 'On which side do you normally overtake?'],
    options: [
      ['Links', 'On the left', true],
      ['Rechts, wenn dort mehr Platz ist', 'On the right if there is more room', false],
    ],
    why: ['Überholt wird links. Ausnahme: Fahrzeuge, die sich zum Linksabbiegen eingeordnet haben, und Schienenfahrzeuge werden rechts überholt.', 'You overtake on the left. Exceptions: vehicles waiting to turn left and trams are passed on the right.'],
  }),
  t.mc({
    id: 'ubh-03',
    points: 4,
    q: ['Ein Fahrzeug vor Ihnen hat links geblinkt und sich zur Mitte eingeordnet. Wie überholen Sie?', 'The vehicle ahead is indicating left and has moved to the centre. How do you pass it?'],
    options: [
      ['Rechts', 'On the right', true],
      ['Links', 'On the left', false],
    ],
    why: ['Wer links abbiegen will und sich eingeordnet hat, wird rechts überholt.', 'A vehicle positioned to turn left is passed on the right.'],
  }),
  t.mc({
    id: 'ubh-04',
    points: 4,
    q: ['Sie werden überholt. Was müssen Sie tun?', 'You are being overtaken. What must you do?'],
    options: [
      ['Meine Geschwindigkeit nicht erhöhen', 'Not increase my speed', true],
      ['Etwas weiter rechts fahren, wenn nötig', 'Keep a little further right if needed', true],
      ['Schneller fahren, damit es nicht so lange dauert', 'Speed up so it doesn’t take so long', false],
    ],
    why: ['Wer überholt wird, darf nicht beschleunigen.', 'A driver who is being overtaken must not accelerate.'],
  }),
  t.mc({
    id: 'ubh-05',
    points: 4,
    q: ['Was müssen Sie vor dem Überholen tun?', 'What must you do before overtaking?'],
    options: [
      ['In Rückspiegel und Außenspiegel schauen und den Schulterblick machen', 'Check mirrors and look over my shoulder', true],
      ['Rechtzeitig links blinken', 'Indicate left in good time', true],
      ['Kurz hupen, damit der andere Platz macht', 'Sound the horn so the other driver moves over', false],
    ],
    why: ['Ein Überholvorgang beginnt mit Spiegel, Blinker, Schulterblick – erst dann ausscheren.', 'Overtaking starts with mirrors, indicator, shoulder check – only then pull out.'],
  }),
  t.mc({
    id: 'ubh-06',
    points: 4,
    q: ['An welchen Stellen dürfen Sie nicht überholen?', 'Where must you not overtake?'],
    options: [
      ['An Fußgängerüberwegen', 'At zebra crossings', true],
      ['Bei durchgezogener Mittellinie, wenn ich sie dafür überfahren müsste', 'At a solid centre line if I would have to cross it', true],
      ['Auf einer langen, übersichtlichen Geraden', 'On a long, clear straight', false],
    ],
    why: ['Eine durchgezogene Linie darf nicht überfahren werden. Am Zebrastreifen ist Überholen verboten.', 'A solid line must not be crossed. Overtaking at zebra crossings is forbidden.'],
  }),
  t.mc({
    id: 'ubh-07',
    points: 4,
    q: ['Sie wollen links abbiegen. Wie ordnen Sie sich auf einer Straße mit Gegenverkehr ein?', 'You want to turn left on a two-way road. How do you position yourself?'],
    options: [
      ['Möglichst weit links, bis zur Mitte der Fahrbahn', 'As far left as possible, up to the centre of the road', true],
      ['Ganz rechts am Fahrbahnrand', 'Right at the kerb', false],
    ],
    why: ['So können Fahrzeuge hinter Ihnen rechts vorbeifahren.', 'That way vehicles behind you can pass on the right.'],
  }),
  t.mc({
    id: 'ubh-08',
    points: 4,
    q: ['Sie wollen rechts abbiegen. Wie ordnen Sie sich ein?', 'You want to turn right. How do you position yourself?'],
    options: [
      ['Möglichst weit rechts', 'As far right as possible', true],
      ['In der Mitte der Fahrbahn', 'In the middle of the road', false],
    ],
    why: ['Rechtsabbieger halten sich rechts – achten Sie dabei auf Radfahrer rechts neben sich.', 'Right turners keep right – watch for cyclists beside you.'],
  }),
  t.mc({
    id: 'ubh-09',
    points: 3,
    q: ['Auf einer Fahrbahn mit mehreren markierten Fahrstreifen in eine Richtung (innerorts): Welchen Streifen dürfen Sie mit dem Pkw wählen?', 'On a road in town with several marked lanes in one direction: which lane may you choose in a car?'],
    options: [
      ['Jeden Fahrstreifen', 'Any lane', true],
      ['Nur den rechten', 'Only the right one', false],
    ],
    why: ['Innerorts dürfen Fahrzeuge bis 3,5 t den Fahrstreifen frei wählen. Dann darf rechts auch schneller gefahren werden als links.', 'In town, vehicles up to 3.5 t may choose any lane. Traffic on the right may then move faster than on the left.'],
  }),
  t.mc({
    id: 'ubh-10',
    points: 4,
    q: ['Zwei Fahrstreifen werden zu einem. Wie fahren Sie, wenn der Verkehr stockt?', 'Two lanes merge into one. How do you drive when traffic is slow?'],
    options: [
      ['Reißverschlussverfahren: abwechselnd einfädeln, erst am Ende des endenden Streifens', 'Zip merge: alternate, merging only where the lane actually ends', true],
      ['Möglichst früh einfädeln und dann niemanden mehr hereinlassen', 'Merge as early as possible and let nobody in', false],
    ],
    why: ['Beim Reißverschluss wird unmittelbar vor der Engstelle abwechselnd eingefädelt.', 'In a zip merge, traffic alternates right before the narrowing.'],
  }),
  t.mc({
    id: 'ubh-11',
    points: 4,
    q: ['Was gilt für das Rechtsfahrgebot?', 'What does the keep-right rule say?'],
    options: [
      ['Ich muss möglichst weit rechts fahren, nicht nur bei Gegenverkehr', 'I must drive as far right as practical, not only with oncoming traffic', true],
      ['Ich darf immer in der Mitte der Fahrbahn fahren', 'I may always drive in the middle of the road', false],
    ],
    why: ['In Deutschland gilt: rechts fahren – auch, um Überholen zu ermöglichen.', 'In Germany you keep right – also so others can overtake.'],
  }),
  t.mc({
    id: 'ubh-12',
    points: 4,
    q: ['Vor Ihnen ist eine Engstelle, auf Ihrer Seite steht ein Hindernis. Gegenverkehr kommt. Wer darf zuerst fahren?', 'There is a narrowing ahead with an obstacle on your side. Oncoming traffic approaches. Who goes first?'],
    options: [
      ['Der Gegenverkehr', 'The oncoming traffic', true],
      ['Ich, weil ich schneller bin', 'Me, because I am faster', false],
    ],
    why: ['Wer an einem Hindernis auf der eigenen Seite vorbei will, muss den Gegenverkehr durchlassen.', 'Whoever must pass an obstacle on their own side lets oncoming traffic through.'],
  }),
  t.mc({
    id: 'ubh-13',
    points: 3,
    q: ['Wann dürfen Sie eine Sperrfläche (weiße Schraffur) befahren?', 'When may you drive over a hatched area (white diagonal stripes)?'],
    options: [
      ['Nie', 'Never', true],
      ['Zum Überholen', 'To overtake', false],
      ['Wenn kein Gegenverkehr kommt', 'When there is no oncoming traffic', false],
    ],
    why: ['Sperrflächen dürfen nicht benutzt werden – auch nicht zum Halten.', 'Hatched areas must not be used – not even for stopping.'],
  }),

  t.mc({
    id: 'ubh-14',
    points: 3,
    q: ['Sie haben einen Lkw überholt. Wann dürfen Sie sich wieder rechts einordnen?', 'You have overtaken a lorry. When may you move back to the right?'],
    options: [
      ['Erst wenn ich den Überholten dadurch nicht behindere', 'Only when doing so does not hinder the vehicle I overtook', true],
      ['Sofort, sobald ich an ihm vorbei bin', 'Immediately, as soon as I am past it', false],
    ],
    why: ['Ein guter Anhaltspunkt: Sie sehen den Überholten vollständig im Innenspiegel.', 'A good guide: you can see the whole vehicle you overtook in your rear-view mirror.'],
  }),
  t.mc({
    id: 'ubh-15',
    points: 4,
    q: ['Auf Ihrer Straße trennt eine durchgezogene Linie (Fahrstreifenbegrenzung) die Fahrtrichtungen. Was gilt?', 'A solid line separates the two directions on your road. What applies?'],
    options: [
      ['Ich darf die Linie nicht überfahren, auch nicht zum Überholen', 'I must not cross the line, not even to overtake', true],
      ['Ich darf sie zum Überholen kurz überfahren', 'I may briefly cross it to overtake', false],
      ['Ich darf sie überfahren, wenn kein Gegenverkehr kommt', 'I may cross it if there is no oncoming traffic', false],
    ],
    why: ['Die durchgezogene Linie ist eine Sperre. Wer sie überfährt, begeht einen Verstoß – meist steht sie dort, wo Überholen gefährlich ist.', 'A solid line is a barrier. Crossing it is an offence – it is usually placed where overtaking is dangerous.'],
  }),
  t.mc({
    id: 'ubh-16',
    points: 4,
    q: ['Auf welcher Seite überholen Sie eine fahrende Straßenbahn grundsätzlich?', 'On which side do you normally overtake a moving tram?'],
    options: [
      ['Rechts', 'On the right', true],
      ['Links', 'On the left', false],
      ['Straßenbahnen darf man nicht überholen', 'Trams must never be overtaken', false],
    ],
    why: ['Schienenfahrzeuge werden rechts überholt. Links nur, wenn rechts nicht genug Platz ist oder in Einbahnstraßen.', 'Rail vehicles are overtaken on the right. Only on the left if there is not enough room on the right, or in one-way streets.'],
  }),
  t.mc({
    id: 'ubh-17',
    points: 4,
    q: ['Dürfen Sie beim Überholen die erlaubte Höchstgeschwindigkeit überschreiten?', 'May you exceed the speed limit while overtaking?'],
    options: [
      ['Nein, nie', 'No, never', true],
      ['Ja, wenn es nur kurz ist', 'Yes, if only briefly', false],
      ['Ja, damit der Überholvorgang kürzer wird', 'Yes, to make the manoeuvre shorter', false],
    ],
    why: ['Das Tempolimit gilt auch beim Überholen. Reicht die Zeit nicht, wird nicht überholt.', 'The speed limit also applies when overtaking. If there is not enough time, you do not overtake.'],
  }),
];
