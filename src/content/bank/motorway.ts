import { KMH, topic } from './build';

const t = topic('motorway', 'basic');

export const MOTORWAY = [
  t.num({
    id: 'abn-01',
    points: 2,
    q: ['Wie hoch ist die Richtgeschwindigkeit auf deutschen Autobahnen?', 'What is the recommended speed on German motorways?'],
    value: 130,
    unit: KMH,
    why: ['Die Richtgeschwindigkeit ist eine Empfehlung, keine Grenze. Wer schneller fährt, kann bei einem Unfall eine Mitschuld bekommen.', 'The recommended speed is advice, not a limit. Driving faster can mean shared blame after a crash.'],
  }),
  t.mc({
    id: 'abn-02',
    points: 3,
    q: ['Welche Fahrzeuge dürfen die Autobahn benutzen?', 'Which vehicles may use the motorway?'],
    options: [
      ['Nur Kraftfahrzeuge, die bauartbedingt schneller als 60 km/h fahren können', 'Only motor vehicles that can by design go faster than 60 km/h', true],
      ['Alle Kraftfahrzeuge', 'All motor vehicles', false],
      ['Auch Fahrräder auf dem Seitenstreifen', 'Bicycles too, on the hard shoulder', false],
    ],
    why: ['Langsame Fahrzeuge würden den schnellen Verkehr gefährden.', 'Slow vehicles would endanger the fast traffic.'],
  }),
  t.mc({
    id: 'abn-03',
    points: 4,
    q: ['Sie fahren auf die Autobahn auf. Was ist richtig?', 'You are joining the motorway. What is right?'],
    options: [
      ['Ich nutze den Beschleunigungsstreifen, um auf die Geschwindigkeit des Verkehrs zu kommen', 'I use the acceleration lane to match the speed of traffic', true],
      ['Der Verkehr auf der Autobahn hat Vorfahrt', 'Traffic on the motorway has priority', true],
      ['Die Fahrzeuge auf der Autobahn müssen für mich Platz machen', 'Vehicles on the motorway must make room for me', false],
    ],
    why: ['Wer auffährt, muss sich einfädeln, ohne den Verkehr zu gefährden. Am Ende des Streifens notfalls anhalten.', 'When joining you must merge without endangering traffic; if necessary stop at the end of the lane.'],
  }),
  t.mc({
    id: 'abn-04',
    points: 5,
    q: ['Was ist auf der Autobahn verboten?', 'What is forbidden on the motorway?'],
    options: [
      ['Wenden und Rückwärtsfahren', 'Turning round and reversing', true],
      ['Halten, auch auf dem Seitenstreifen (außer bei einer Panne oder im Notfall)', 'Stopping, also on the hard shoulder (except for a breakdown or emergency)', true],
      ['Auf dem linken Fahrstreifen überholen', 'Overtaking in the left lane', false],
    ],
    why: ['Wenden und Rückwärtsfahren sind auf Autobahnen lebensgefährlich – auch auf Ein- und Ausfahrten.', 'Turning round and reversing on motorways are deadly dangerous – on slip roads too.'],
  }),
  t.mc({
    id: 'abn-05',
    points: 3,
    q: ['Sie haben Ihre Ausfahrt verpasst. Was tun Sie?', 'You have missed your exit. What do you do?'],
    options: [
      ['Bis zur nächsten Ausfahrt weiterfahren', 'Drive on to the next exit', true],
      ['Auf dem Seitenstreifen zurücksetzen', 'Reverse along the hard shoulder', false],
    ],
    why: ['Zurücksetzen ist auf der Autobahn verboten.', 'Reversing on the motorway is forbidden.'],
  }),
  t.mc({
    id: 'abn-06',
    points: 4,
    q: ['Wann müssen Sie eine Rettungsgasse bilden?', 'When must you form an emergency corridor?'],
    options: [
      ['Sobald der Verkehr nur noch mit Schrittgeschwindigkeit fährt oder steht', 'As soon as traffic is at walking pace or stationary', true],
      ['Erst, wenn ich ein Martinshorn höre', 'Only when I hear a siren', false],
    ],
    why: ['Die Gasse wird vorsorglich gebildet – auf Autobahnen und auf Außerortsstraßen mit mindestens zwei Fahrstreifen je Richtung.', 'The corridor is formed in advance – on motorways and rural roads with at least two lanes each way.'],
  }),
  t.mc({
    id: 'abn-07',
    points: 4,
    q: ['Wie bilden Sie auf einer dreispurigen Autobahn die Rettungsgasse?', 'How do you form the corridor on a three-lane motorway?'],
    options: [
      ['Linker Fahrstreifen nach links, die anderen nach rechts', 'Left lane moves left, the others move right', true],
      ['Alle Fahrstreifen nach rechts', 'All lanes move right', false],
      ['Mittlerer Fahrstreifen nach links', 'Middle lane moves left', false],
    ],
    why: ['Die Gasse liegt immer zwischen dem äußerst linken und dem Streifen rechts daneben.', 'The corridor is always between the far-left lane and the one next to it.'],
  }),
  t.mc({
    id: 'abn-08',
    points: 4,
    q: ['Auf dem linken Fahrstreifen staut sich der Verkehr und fährt langsamer als 60 km/h. Dürfen Sie rechts schneller fahren?', 'Traffic in the left lane is queuing at under 60 km/h. May you go faster on the right?'],
    options: [
      ['Ja, aber nur mit höchstens 20 km/h mehr', 'Yes, but only up to 20 km/h faster', true],
      ['Nein, rechts überholen ist immer verboten', 'No, passing on the right is always banned', false],
      ['Ja, so schnell ich will', 'Yes, as fast as I like', false],
    ],
    why: ['Bei Kolonnen links unter 60 km/h darf rechts mit geringfügig höherer Geschwindigkeit (bis 20 km/h mehr) vorbeigefahren werden.', 'With queues on the left under 60 km/h you may pass on the right slightly faster (up to 20 km/h more).'],
  }),
  t.mc({
    id: 'abn-09',
    points: 4,
    q: ['Sie haben eine Panne auf der Autobahn. Was tun Sie?', 'You break down on the motorway. What do you do?'],
    options: [
      ['Warnblinklicht einschalten und möglichst auf den Seitenstreifen fahren', 'Turn on the hazard lights and get onto the hard shoulder if possible', true],
      ['Warnweste anziehen und alle Insassen hinter die Schutzplanke bringen', 'Put on the hi-vis vest and get everyone behind the crash barrier', true],
      ['Im Auto sitzen bleiben und warten', 'Stay in the car and wait', false],
    ],
    why: ['Auf der Autobahn ist das Auto bei einer Panne der gefährlichste Ort – raus und hinter die Schutzplanke.', 'On the motorway the car is the most dangerous place after a breakdown – get out and behind the barrier.'],
  }),
  t.mc({
    id: 'abn-10',
    points: 3,
    q: ['In welcher Entfernung stellen Sie auf der Autobahn das Warndreieck auf?', 'How far away do you place the warning triangle on the motorway?'],
    options: [
      ['Etwa 150 bis 400 m hinter dem Fahrzeug', 'About 150 to 400 m behind the vehicle', true],
      ['Etwa 50 m', 'About 50 m', false],
      ['Direkt hinter das Auto', 'Right behind the car', false],
    ],
    why: ['Faustregeln: innerorts etwa 50 m, Landstraße etwa 100 m, Autobahn 150–400 m. Vor Kurven und Kuppen entsprechend früher.', 'Rules of thumb: about 50 m in town, 100 m on rural roads, 150–400 m on motorways. Earlier before bends and crests.'],
  }),
  t.mc({
    id: 'abn-11',
    points: 3,
    q: ['Sie nähern sich auf der Autobahn einem Stauende. Was ist richtig?', 'You approach the end of a traffic jam on the motorway. What is right?'],
    options: [
      ['Ich darf das Warnblinklicht einschalten, um Nachfolgende zu warnen', 'I may switch on the hazard lights to warn drivers behind', true],
      ['Ich bremse früh und gleichmäßig', 'I brake early and smoothly', true],
      ['Ich wechsle schnell auf den Seitenstreifen', 'I quickly move onto the hard shoulder', false],
    ],
    why: ['Auffahrunfälle am Stauende sind sehr gefährlich. Warnblinklicht ist hier ausdrücklich erlaubt.', 'Rear-end crashes at the end of jams are very dangerous. Hazard lights are expressly allowed here.'],
  }),
  t.mc({
    id: 'abn-12',
    points: 3,
    q: ['Auf einer dreispurigen Autobahn fahren rechts immer wieder Lkw. Welchen Fahrstreifen dürfen Sie benutzen?', 'On a three-lane motorway there are trucks every now and then in the right lane. Which lane may you use?'],
    options: [
      ['Den mittleren Fahrstreifen', 'The middle lane', true],
      ['Ich muss ständig zwischen rechts und Mitte wechseln', 'I must keep switching between right and middle', false],
    ],
    why: ['Sind rechts hin und wieder Fahrzeuge, dürfen Sie in der Mitte bleiben. Ist der rechte Streifen frei, gilt das Rechtsfahrgebot.', 'If there are vehicles on the right now and then, you may stay in the middle. If the right lane is clear, keep right.'],
  }),

  t.mc({
    id: 'abn-13',
    points: 3,
    q: ['Dürfen Sie auf der Autobahn auf dem Seitenstreifen fahren?', 'May you drive on the hard shoulder of the motorway?'],
    options: [
      ['Nur wenn er durch Zeichen ausdrücklich freigegeben ist', 'Only if signs expressly open it to traffic', true],
      ['Ja, um einen Stau zu umfahren', 'Yes, to get round a traffic jam', false],
      ['Ja, um rechts zu überholen', 'Yes, to overtake on the right', false],
    ],
    why: ['Der Seitenstreifen ist für Notfälle und Pannen. Nur bei Freigabe (z. B. durch Wechselzeichen) darf er befahren werden.', 'The hard shoulder is for emergencies and breakdowns. You may only drive on it when signs open it.'],
  }),
  t.mc({
    id: 'abn-14',
    points: 3,
    q: ['Was gilt auf einer Kraftfahrstraße?', 'What applies on an expressway (Kraftfahrstraße)?'],
    options: [
      ['Halten und Parken sind verboten', 'Stopping and parking are forbidden', true],
      ['Wenden ist verboten', 'Turning round is forbidden', true],
      ['Radfahrer und Fußgänger dürfen sie benutzen', 'Cyclists and pedestrians may use it', false],
    ],
    why: ['Kraftfahrstraßen sind wie Autobahnen nur für Kfz, die schneller als 60 km/h fahren können.', 'Like motorways, expressways are only for motor vehicles that can go faster than 60 km/h.'],
  }),
  t.num({
    id: 'abn-15',
    points: 3,
    q: ['Welchen Abstand sollten Sie bei 120 km/h mindestens halten? (Faustformel „halber Tacho“)', 'What minimum gap should you keep at 120 km/h? (rule of thumb "half the speedometer")'],
    value: 60,
    unit: ['m', 'm'],
    why: ['Halber Tacho: 120 ÷ 2 = 60 m. Das entspricht etwa 1,8 Sekunden Abstand.', 'Half the speedometer: 120 ÷ 2 = 60 m. That is roughly a 1.8-second gap.'],
  }),
  t.mc({
    id: 'abn-16',
    points: 3,
    q: ['Sie werden auf der Autobahn sehr müde. Wo halten Sie für eine Pause?', 'You become very tired on the motorway. Where do you stop for a break?'],
    options: [
      ['Auf dem nächsten Parkplatz oder an der nächsten Raststätte', 'At the next parking area or service station', true],
      ['Auf dem Seitenstreifen', 'On the hard shoulder', false],
      ['In einer Ausfahrt', 'In an exit slip road', false],
    ],
    why: ['Auf der Autobahn ist Halten verboten, außer bei Notfällen. Für Pausen gibt es Parkplätze und Rastanlagen.', 'Stopping on the motorway is forbidden except in emergencies. Use parking areas and service stations for breaks.'],
  }),
];
