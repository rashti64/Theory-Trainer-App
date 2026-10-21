import { topic } from './build';

const t = topic('licence', 'class');

export const LICENCE = [
  t.num({
    id: 'fsc-01',
    points: 3,
    q: ['Wie viele Jahre dauert die Probezeit nach dem ersten Führerschein?', 'How many years does the probation period last after your first licence?'],
    value: 2,
    unit: ['Jahre', 'years'],
    why: ['Die Probezeit beginnt mit der Aushändigung des Führerscheins (bzw. der Prüfbescheinigung beim Begleiteten Fahren).', 'Probation starts when you receive the licence (or the certificate for accompanied driving).'],
  }),
  t.mc({
    id: 'fsc-02',
    points: 4,
    q: ['Sie begehen in der Probezeit einen schwerwiegenden Verstoß (A-Verstoß), z. B. 21 km/h zu schnell. Was folgt?', 'During probation you commit a serious violation (A-violation), e.g. 21 km/h over the limit. What follows?'],
    options: [
      ['Ich muss an einem Aufbauseminar teilnehmen', 'I must attend a driver improvement course', true],
      ['Die Probezeit verlängert sich auf insgesamt 4 Jahre', 'Probation is extended to 4 years in total', true],
      ['Nichts, solange es der erste Verstoß ist', 'Nothing, as long as it is the first one', false],
    ],
    why: ['Ein A-Verstoß oder zwei B-Verstöße lösen Aufbauseminar und Verlängerung aus.', 'One A-violation or two B-violations trigger the course and the extension.'],
  }),
  t.mc({
    id: 'fsc-03',
    points: 4,
    q: ['Was passiert bei weiteren Verstößen in der Probezeit nach dem Aufbauseminar?', 'What happens with further violations during probation after the course?'],
    options: [
      ['Zuerst eine schriftliche Verwarnung mit Empfehlung zur verkehrspsychologischen Beratung', 'First a written warning recommending traffic-psychology counselling', true],
      ['Danach wird die Fahrerlaubnis entzogen', 'After that, the licence is revoked', true],
      ['Die Probezeit verlängert sich jedes Mal um ein weiteres Jahr', 'Probation is extended by another year each time', false],
    ],
    why: ['Die Stufen sind: Aufbauseminar – Verwarnung – Entzug.', 'The stages are: improvement course – warning – revocation.'],
  }),
  t.num({
    id: 'fsc-04',
    points: 3,
    q: ['Ab wie vielen Punkten im Fahreignungsregister („Flensburg“) wird die Fahrerlaubnis entzogen?', 'At how many points in the driving aptitude register ("Flensburg") is the licence revoked?'],
    value: 8,
    unit: ['Punkte', 'points'],
    why: ['1–3 Punkte: vorgemerkt · 4–5: Ermahnung · 6–7: Verwarnung · 8: Entzug.', '1–3 points: recorded · 4–5: reminder · 6–7: warning · 8: revoked.'],
  }),
  t.mc({
    id: 'fsc-05',
    points: 3,
    q: ['Welche Voraussetzungen muss eine Begleitperson beim Begleiteten Fahren ab 17 erfüllen?', 'What must an accompanying person meet for accompanied driving from 17?'],
    options: [
      ['Mindestens 30 Jahre alt und seit mindestens 5 Jahren Führerschein Klasse B', 'At least 30 and held a class B licence for at least 5 years', true],
      ['Höchstens 1 Punkt im Fahreignungsregister', 'At most 1 point in the register', true],
      ['Es reicht, wenn die Person volljährig ist', 'Being an adult is enough', false],
    ],
    why: ['Die Begleitperson muss im Antrag namentlich eingetragen sein und muss weniger als 0,5 Promille haben und darf nicht unter Drogeneinfluss stehen.', 'The companion must be named on the application, must have less than 0.5 per mille and must not be under the influence of drugs.'],
  }),
  t.mc({
    id: 'fsc-06',
    points: 3,
    q: ['Welche Papiere müssen Sie bei jeder Fahrt dabei haben?', 'Which documents must you carry on every drive?'],
    options: [
      ['Den Führerschein', 'The driving licence', true],
      ['Die Zulassungsbescheinigung Teil I (Fahrzeugschein)', 'The registration certificate part I', true],
      ['Den Kaufvertrag des Autos', 'The car’s purchase contract', false],
    ],
    why: ['Beide Dokumente müssen Sie auf Verlangen der Polizei aushändigen.', 'You must hand both to the police on request.'],
  }),
  t.mc({
    id: 'fsc-07',
    points: 3,
    q: ['Welche Fahrzeuge dürfen Sie mit der Klasse B fahren?', 'Which vehicles may you drive with class B?'],
    options: [
      ['Kraftfahrzeuge bis 3.500 kg zulässige Gesamtmasse', 'Motor vehicles up to 3,500 kg permitted total mass', true],
      ['Mit höchstens 8 Sitzplätzen außer dem Fahrersitz', 'With at most 8 seats besides the driver’s', true],
      ['Lkw bis 7.500 kg', 'Trucks up to 7,500 kg', false],
    ],
    why: ['Schwerere Fahrzeuge brauchen die Klasse C1 oder C, mehr Sitzplätze die Klassen D1 oder D.', 'Heavier vehicles need class C1 or C; more seats need D1 or D.'],
  }),
  t.mc({
    id: 'fsc-08',
    points: 3,
    q: ['Was brauchen Sie neben der Fahrschulausbildung, um den Führerschein zu beantragen?', 'Besides driving lessons, what do you need to apply for a licence?'],
    options: [
      ['Einen Erste-Hilfe-Kurs', 'A first-aid course', true],
      ['Einen Sehtest', 'An eyesight test', true],
      ['Ein eigenes Auto', 'A car of my own', false],
    ],
    why: ['Dazu kommen ein biometrisches Passbild und der Antrag bei der Fahrerlaubnisbehörde.', 'You also need a biometric photo and an application to the licensing authority.'],
  }),
  t.num({
    id: 'fsc-09',
    points: 3,
    q: ['Innerhalb von wie vielen Monaten nach bestandener Theorieprüfung müssen Sie die praktische Prüfung ablegen?', 'Within how many months of passing the theory test must you take the practical test?'],
    value: 12,
    unit: ['Monate', 'months'],
    why: ['Danach verliert die Theorieprüfung ihre Gültigkeit.', 'After that, the theory pass expires.'],
  }),
  t.mc({
    id: 'fsc-10',
    points: 3,
    q: ['Wie viele Fragen hat die Theorieprüfung für Klasse B (Ersterwerb), und wie viele Fehlerpunkte sind erlaubt?', 'How many questions does the class B theory test have (first licence), and how many error points are allowed?'],
    options: [
      ['30 Fragen, höchstens 10 Fehlerpunkte – aber nicht zwei falsche 5-Punkte-Fragen', '30 questions, at most 10 error points – but not two wrong 5-point questions', true],
      ['40 Fragen, höchstens 15 Fehlerpunkte', '40 questions, at most 15 error points', false],
    ],
    why: ['Genau diese Regeln nutzt auch die Prüfungssimulation in dieser App.', 'The exam simulator in this app uses exactly these rules.'],
  }),

  t.num({
    id: 'fsc-11',
    points: 2,
    q: ['Bis zu welcher zulässigen Gesamtmasse (in Tonnen) dürfen Kraftfahrzeuge der Klasse B höchstens wiegen?', 'Up to what maximum permitted mass (in tonnes) may class B motor vehicles weigh?'],
    value: 3.5,
    unit: ['t', 't'],
    why: ['Klasse B gilt für Kraftfahrzeuge bis 3,5 t zulässige Gesamtmasse und mit höchstens 8 Sitzplätzen außer dem Fahrersitz.', 'Class B covers motor vehicles up to 3.5 t maximum permitted mass with no more than 8 seats besides the driver’s.'],
  }),
  t.num({
    id: 'fsc-12',
    points: 2,
    q: ['Beim Begleiteten Fahren ab 17: Bis zu welchem Alter dürfen Sie nur mit einer eingetragenen Begleitperson fahren?', 'With accompanied driving from 17: up to what age may you only drive with a registered companion?'],
    value: 18,
    unit: ['Jahre', 'years'],
    why: ['Ab dem 18. Geburtstag dürfen Sie allein fahren. Die Probezeit läuft schon ab dem Erwerb mit 17.', 'From your 18th birthday you may drive alone. The probationary period already starts when you get the licence at 17.'],
  }),
  t.mc({
    id: 'fsc-13',
    points: 3,
    q: ['Was passiert, wenn Sie in der Probezeit zwei weniger schwerwiegende Verstöße (B-Verstöße) begehen?', 'What happens if you commit two less serious offences (B offences) during probation?'],
    options: [
      ['Ich muss ein Aufbauseminar besuchen', 'I must attend a remedial course', true],
      ['Die Probezeit verlängert sich um 2 Jahre', 'The probationary period is extended by 2 years', true],
      ['Es hat keine Folgen für die Probezeit', 'It has no consequences for probation', false],
    ],
    why: ['Ein A-Verstoß oder zwei B-Verstöße führen zu Aufbauseminar und Verlängerung der Probezeit auf 4 Jahre.', 'One A offence or two B offences lead to a remedial course and an extension of probation to 4 years.'],
  }),
  t.mc({
    id: 'fsc-14',
    points: 2,
    q: ['Sie haben Ihren Führerschein verloren. Was tun Sie?', 'You have lost your driving licence. What do you do?'],
    options: [
      ['Bei der Fahrerlaubnisbehörde einen Ersatzführerschein beantragen', 'Apply for a replacement at the driving licence authority', true],
      ['Die Theorieprüfung erneut ablegen', 'Retake the theory test', false],
    ],
    why: ['Die Fahrerlaubnis bleibt bestehen, nur das Dokument fehlt. Bis zum Ersatz müssen Sie es bei Kontrollen erklären können.', 'You keep the right to drive; only the document is missing. Until you get a replacement you have to explain this at checks.'],
  }),
  t.mc({
    id: 'fsc-15',
    points: 2,
    q: ['Gilt Ihr deutscher Führerschein auch in anderen EU-Ländern?', 'Is your German driving licence also valid in other EU countries?'],
    options: [
      ['Ja, EU-Führerscheine werden in der ganzen EU anerkannt', 'Yes, EU licences are recognised throughout the EU', true],
      ['Nein, ich brauche immer einen internationalen Führerschein', 'No, I always need an international driving permit', false],
    ],
    why: ['In der EU (und im EWR) gilt Ihr Führerschein ohne Zusatzdokument. Beachten Sie aber die Verkehrsregeln des jeweiligen Landes.', 'Your licence is valid without extra documents in the EU (and EEA). Mind the traffic rules of each country, though.'],
  }),
];
