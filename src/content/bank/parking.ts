import { M, topic } from './build';

const t = topic('parking', 'basic');

export const PARKING = [
  t.mc({
    id: 'prk-01',
    points: 3,
    q: ['Wann parken Sie (statt nur zu halten)?', 'When are you parking (rather than just stopping)?'],
    options: [
      ['Wenn ich mein Fahrzeug verlasse', 'When I leave my vehicle', true],
      ['Wenn ich länger als 3 Minuten halte', 'When I stop for longer than 3 minutes', true],
      ['Wenn ich an der roten Ampel warte', 'When I wait at a red light', false],
    ],
    why: ['Wer das Fahrzeug verlässt oder länger als 3 Minuten hält, parkt. Verkehrsbedingtes Warten ist kein Halten.', 'Leaving the vehicle or stopping longer than 3 minutes counts as parking. Waiting because of traffic is not stopping.'],
  }),
  t.num({
    id: 'prk-02',
    points: 3,
    q: ['Bis zu wie vielen Metern vor und hinter Kreuzungen und Einmündungen ist das Parken verboten (gemessen von den Schnittpunkten der Fahrbahnkanten)?', 'Up to how many metres before and after junctions is parking forbidden (measured from where the kerb lines meet)?'],
    value: 5,
    unit: M,
    why: ['Je 5 m – damit Abbieger und Fußgänger die Kreuzung überblicken können.', '5 m on each side – so turning drivers and pedestrians can see the junction.'],
  }),
  t.num({
    id: 'prk-03',
    points: 3,
    q: ['Bis zu wie vielen Metern vor einem Fußgängerüberweg (Zebrastreifen) dürfen Sie nicht halten?', 'Up to how many metres before a zebra crossing are you not allowed to stop?'],
    value: 5,
    unit: M,
    why: ['Auf dem Zebrastreifen und bis zu 5 m davor ist Halten verboten.', 'Stopping is forbidden on a zebra crossing and up to 5 m before it.'],
  }),
  t.num({
    id: 'prk-04',
    points: 3,
    q: ['Bis zu wie vielen Metern vor und hinter einem Haltestellenschild ist das Parken verboten?', 'Up to how many metres before and after a bus-stop sign is parking forbidden?'],
    value: 15,
    unit: M,
    why: ['Je 15 m vor und hinter dem Haltestellenschild darf nicht geparkt werden.', 'You may not park within 15 m before or after a bus-stop sign.'],
  }),
  t.mc({
    id: 'prk-05',
    points: 4,
    q: ['Wo ist das Halten verboten?', 'Where is stopping forbidden?'],
    options: [
      ['An engen und unübersichtlichen Straßenstellen', 'At narrow places and where visibility is poor', true],
      ['Im Bereich von scharfen Kurven', 'Near sharp bends', true],
      ['Auf Bahnübergängen', 'On level crossings', true],
    ],
    why: ['An all diesen Stellen würden Sie andere gefährden oder behindern.', 'At all these places you would endanger or obstruct others.'],
  }),
  t.mc({
    id: 'prk-06',
    points: 3,
    q: ['Wo ist das Parken verboten?', 'Where is parking forbidden?'],
    options: [
      ['Vor Grundstücksein- und -ausfahrten', 'In front of driveways', true],
      ['Über Schachtdeckeln auf dem Gehweg, wenn Parken dort erlaubt ist', 'Over manhole covers on the pavement where pavement parking is allowed', true],
      ['Auf markierten Parkflächen', 'In marked parking bays', false],
    ],
    why: ['Ein- und Ausfahrten müssen frei bleiben. Schachtdeckel müssen zugänglich sein.', 'Driveways must stay clear. Manhole covers must stay accessible.'],
  }),
  t.mc({
    id: 'prk-07',
    points: 3,
    q: ['Sie halten am Fahrbahnrand einer Straße mit Gegenverkehr. Auf welcher Seite?', 'You stop at the edge of a two-way road. On which side?'],
    options: [
      ['Rechts', 'On the right', true],
      ['Links, wenn dort mehr Platz ist', 'On the left if there is more room', false],
    ],
    why: ['Gehalten und geparkt wird am rechten Fahrbahnrand. Links nur in Einbahnstraßen oder wenn rechts Schienen liegen.', 'You stop and park on the right. On the left only in one-way streets or if there are tram rails on the right.'],
  }),
  t.mc({
    id: 'prk-08',
    points: 3,
    q: ['Was müssen Sie tun, bevor Sie Ihr geparktes Auto verlassen?', 'What must you do before leaving your parked car?'],
    options: [
      ['Motor abstellen und Feststellbremse anziehen', 'Switch off the engine and apply the parking brake', true],
      ['Das Fahrzeug gegen unbefugte Benutzung sichern', 'Secure the car against unauthorised use', true],
      ['Die Warnblinkanlage einschalten', 'Switch on the hazard lights', false],
    ],
    why: ['Ein abgestelltes Fahrzeug muss gegen Wegrollen und Diebstahl gesichert sein.', 'A parked vehicle must be secured against rolling away and theft.'],
  }),
  t.mc({
    id: 'prk-09',
    points: 3,
    q: ['Sie parken an einer Gefällstrecke am Bordstein. Wie lenken Sie die Räder ein?', 'You park facing downhill next to the kerb. How do you turn the wheels?'],
    options: [
      ['Zum Bordstein hin', 'Towards the kerb', true],
      ['Von der Fahrbahn weg zur Straßenmitte', 'Away from the kerb towards the road', false],
    ],
    why: ['Rollt das Auto los, stoppt der Bordstein die Vorderräder.', 'If the car rolls, the kerb stops the front wheels.'],
  }),
  t.mc({
    id: 'prk-10',
    points: 3,
    q: ['Dürfen Sie in zweiter Reihe parken, wenn Sie nur kurz einkaufen?', 'May you double-park while you pop into a shop?'],
    options: [
      ['Nein', 'No', true],
      ['Ja, mit eingeschalteter Warnblinkanlage', 'Yes, with hazard lights on', false],
      ['Ja, bis zu 10 Minuten', 'Yes, for up to 10 minutes', false],
    ],
    why: ['Parken in zweiter Reihe ist verboten – auch mit Warnblinklicht. Es behindert und gefährdet andere.', 'Double parking is forbidden – hazard lights don’t change that. It obstructs and endangers others.'],
  }),
  t.mc({
    id: 'prk-11',
    points: 3,
    q: ['Was gilt beim Ein- und Ausparken?', 'What applies when pulling into or out of a parking space?'],
    options: [
      ['Ich darf den fließenden Verkehr nicht gefährden', 'I must not endanger moving traffic', true],
      ['Wer zuerst blinkt, hat Vorrang vor dem fließenden Verkehr', 'Whoever indicates first has priority over moving traffic', false],
    ],
    why: ['Wer vom Fahrbahnrand anfährt, muss den fließenden Verkehr durchlassen.', 'Pulling away from the kerb, you must let moving traffic pass.'],
  }),
  t.mc({
    id: 'prk-12',
    points: 3,
    q: ['Wann müssen Sie ein parkendes Fahrzeug nachts beleuchten?', 'When must a car parked at night be lit?'],
    options: [
      ['Außerhalb geschlossener Ortschaften immer', 'Outside built-up areas, always', true],
      ['Innerorts nicht, wenn es durch Straßenbeleuchtung ausreichend erkennbar ist', 'Not in town if street lighting makes it clearly visible', true],
      ['Nie', 'Never', false],
    ],
    why: ['Außerorts müssen haltende Fahrzeuge beleuchtet sein, z. B. mit Standlicht. Innerorts genügt Parklicht zur Fahrbahnseite; macht die Straßenbeleuchtung das Auto gut sichtbar, ist keine eigene Beleuchtung nötig.', 'Outside towns, stationary vehicles must be lit, e.g. with side lights. In town a parking light on the road side is enough, and none is needed if street lighting makes the car clearly visible.'],
  }),

  t.num({
    id: 'prk-13',
    points: 3,
    q: ['Im eingeschränkten Halteverbot (Zeichen 286): Wie viele Minuten dürfen Sie höchstens halten, wenn Sie weder be- und entladen noch Fahrgäste ein- oder aussteigen lassen?', 'In a restricted no-stopping zone (sign 286): for how many minutes at most may you stop if you are not loading, unloading, or letting passengers in or out?'],
    value: 3,
    unit: ['Minuten', 'minutes'],
    why: ['Länger als 3 Minuten nur zum Be- oder Entladen oder zum Ein- und Aussteigen.', 'Longer than 3 minutes only for loading, unloading, or passengers getting in or out.'],
  }),
  t.mc({
    id: 'prk-14',
    points: 3,
    q: ['Dürfen Sie Ihr Auto auf dem Gehweg parken?', 'May you park your car on the pavement?'],
    options: [
      ['Nur wenn ein Verkehrszeichen das ausdrücklich erlaubt', 'Only if a traffic sign expressly allows it', true],
      ['Ja, wenn für Fußgänger noch 1 m Platz bleibt', 'Yes, if 1 m is left for pedestrians', false],
      ['Ja, wenn ich die Warnblinkanlage einschalte', 'Yes, if I switch on the hazard lights', false],
    ],
    why: ['Gehwege sind für Fußgänger. Parken dort ist nur erlaubt, wenn Schilder oder Markierungen es zulassen.', 'Pavements are for pedestrians. Parking there is only allowed where signs or markings permit it.'],
  }),
  t.mc({
    id: 'prk-15',
    points: 2,
    q: ['Wie stellen Sie die Parkscheibe richtig ein?', 'How do you set a parking disc correctly?'],
    options: [
      ['Auf den Beginn der nächsten halben Stunde nach meiner Ankunft', 'To the start of the next half hour after I arrive', true],
      ['Auf die Uhrzeit, zu der ich wegfahren will', 'To the time I plan to leave', false],
      ['Auf die volle Stunde vor meiner Ankunft', 'To the full hour before I arrive', false],
    ],
    why: ['Kommen Sie z. B. um 10:10 Uhr an, stellen Sie 10:30 Uhr ein. Die Parkscheibe liegt gut sichtbar hinter der Frontscheibe.', 'If you arrive at 10:10, for example, you set 10:30. The disc lies clearly visible behind the windscreen.'],
  }),
  t.mc({
    id: 'prk-16',
    points: 3,
    q: ['Wo dürfen Sie innerorts auf der linken Straßenseite parken?', 'Where may you park on the left-hand side of the road in a built-up area?'],
    options: [
      ['In Einbahnstraßen', 'In one-way streets', true],
      ['Überall, wo rechts kein Platz ist', 'Anywhere if there is no room on the right', false],
      ['Nur nachts', 'Only at night', false],
    ],
    why: ['Grundsätzlich wird rechts gehalten und geparkt. In Einbahnstraßen ist auch die linke Seite erlaubt.', 'You normally stop and park on the right. In one-way streets the left side is allowed too.'],
  }),
  t.mc({
    id: 'prk-17',
    points: 3,
    q: ['Wo ist das Parken außerdem verboten?', 'Where else is parking forbidden?'],
    options: [
      ['Vor Grundstücksein- und -ausfahrten', 'In front of driveways', true],
      ['Auf Feuerwehrzufahrten', 'In fire brigade access routes', true],
      ['Auf ausgewiesenen Parkplätzen', 'In marked parking spaces', false],
    ],
    why: ['Ein- und Ausfahrten müssen frei bleiben, Feuerwehrzufahrten sowieso – im Notfall zählt jede Minute.', 'Driveways must stay clear, and fire brigade routes even more so – in an emergency every minute counts.'],
  }),
];
