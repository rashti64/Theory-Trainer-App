import { M, topic } from './build';

const t = topic('emergency', 'basic');

export const EMERGENCY = [
  t.mc({
    id: 'not-01',
    points: 5,
    q: ['Wann müssen Sie vor einem Bahnübergang warten?', 'When must you wait before a level crossing?'],
    options: [
      ['Wenn sich ein Zug nähert', 'When a train is approaching', true],
      ['Wenn rotes Blinklicht oder gelbes/rotes Licht leuchtet', 'When red flashing lights or yellow/red lights show', true],
      ['Wenn sich die Schranken senken oder geschlossen sind', 'When the barriers are lowering or closed', true],
    ],
    why: ['Jedes dieser Zeichen allein verpflichtet zum Warten. Auch ein Pfeifsignal oder ein Bahnmitarbeiter kann Halt gebieten.', 'Each of these on its own means you must wait. A whistle or a railway worker can also order you to stop.'],
  }),
  t.num({
    id: 'not-02',
    points: 3,
    q: ['Die dreistreifige Bake steht vor einem Bahnübergang. Wie viele Meter sind es ungefähr noch bis zum Übergang?', 'The three-stripe marker post stands before a level crossing. About how many metres to the crossing?'],
    value: 240,
    unit: M,
    why: ['Dreistreifig etwa 240 m, zweistreifig etwa 160 m, einstreifig etwa 80 m.', 'Three stripes about 240 m, two about 160 m, one about 80 m.'],
  }),
  t.mc({
    id: 'not-03',
    points: 5,
    q: ['Wo dürfen Sie vor einem Bahnübergang keine Kraftfahrzeuge überholen?', 'Where may you not overtake motor vehicles before a level crossing?'],
    options: [
      ['Vom Warnzeichen „Bahnübergang“ bzw. der dreistreifigen Bake bis über den Übergang', 'From the "level crossing" warning sign or three-stripe post until after the crossing', true],
      ['Nur auf den Gleisen selbst', 'Only on the tracks themselves', false],
    ],
    why: ['Das Überholverbot beginnt schon bei der Vorwarnung, nicht erst am Andreaskreuz.', 'The overtaking ban starts at the advance warning, not at the cross.'],
  }),
  t.mc({
    id: 'not-04',
    points: 5,
    q: ['Vor Ihnen staut sich der Verkehr hinter einem Bahnübergang. Was tun Sie?', 'Traffic is backed up just beyond a level crossing. What do you do?'],
    options: [
      ['Vor dem Andreaskreuz warten, bis ich den Übergang zügig ganz überqueren kann', 'Wait before the cross until I can cross completely without stopping', true],
      ['Auf die Gleise fahren und dort warten', 'Drive onto the tracks and wait there', false],
    ],
    why: ['Auf den Gleisen stehen zu bleiben ist lebensgefährlich. Ein Zug kann nicht ausweichen und hat einen sehr langen Bremsweg.', 'Stopping on the tracks is deadly. A train cannot swerve and needs a very long distance to stop.'],
  }),
  t.mc({
    id: 'not-05',
    points: 3,
    q: ['Wo ist das Parken am Andreaskreuz verboten?', 'Where is parking near a St Andrew’s cross forbidden?'],
    options: [
      ['Innerorts bis je 5 m davor und dahinter', 'In town within 5 m before and after it', true],
      ['Außerorts bis je 50 m davor und dahinter', 'Outside towns within 50 m before and after it', true],
      ['Nirgends, wenn die Schranken offen sind', 'Nowhere, if the barriers are open', false],
    ],
    why: ['Das Andreaskreuz muss gut sichtbar bleiben.', 'The cross must remain clearly visible.'],
  }),
  t.mc({
    id: 'not-06',
    points: 4,
    q: ['Sie kommen an eine Unfallstelle. Was tun Sie zuerst?', 'You come across a crash. What do you do first?'],
    options: [
      ['Warnblinklicht einschalten und Warnweste anziehen', 'Switch on hazard lights and put on the hi-vis vest', true],
      ['Die Unfallstelle absichern, z. B. mit dem Warndreieck', 'Secure the scene, e.g. with the warning triangle', true],
      ['Fotos machen', 'Take photos', false],
    ],
    why: ['Erst absichern, damit nicht noch mehr passiert – dann helfen und den Notruf 112 wählen.', 'Secure first so nothing else happens – then help and call 112.'],
  }),
  t.num({
    id: 'not-07',
    points: 3,
    q: ['Welche Notrufnummer wählen Sie in Deutschland (und in der ganzen EU) für Rettungsdienst und Feuerwehr?', 'Which emergency number do you call in Germany (and the whole EU) for ambulance and fire service?'],
    value: 112,
    unit: ['', ''],
    why: ['112 erreicht Rettungsdienst und Feuerwehr, 110 die Polizei.', '112 reaches the ambulance and fire service, 110 the police.'],
  }),
  t.mc({
    id: 'not-08',
    points: 4,
    q: ['Was gehört in einen Notruf?', 'What belongs in an emergency call?'],
    options: [
      ['Wo ist es passiert?', 'Where did it happen?', true],
      ['Was ist passiert und wie viele Verletzte gibt es?', 'What happened and how many are injured?', true],
      ['Auf Rückfragen warten, nicht sofort auflegen', 'Wait for questions; don’t hang up straight away', true],
    ],
    why: ['Die Leitstelle beendet das Gespräch. Der wichtigste Teil ist der Ort.', 'Let the control centre end the call. The location matters most.'],
  }),
  t.mc({
    id: 'not-09',
    points: 4,
    q: ['Sie waren an einem Unfall beteiligt. Was ist Pflicht?', 'You were involved in a crash. What is required?'],
    options: [
      ['Sofort anhalten', 'Stop immediately', true],
      ['Personalien und Versicherung angeben, wenn jemand das verlangt', 'Give your details and insurance if someone asks', true],
      ['Bei nur geringem Sachschaden sofort weiterfahren', 'Drive on at once if damage is only minor', false],
    ],
    why: ['Wer sich unerlaubt vom Unfallort entfernt, macht sich strafbar – auch bei kleinem Schaden an einem geparkten Auto.', 'Leaving the scene without permission is a crime – even with small damage to a parked car.'],
  }),
  t.mc({
    id: 'not-10',
    points: 3,
    q: ['Welche Sicherheitsausrüstung muss in jedem Pkw mitgeführt werden?', 'Which safety equipment must every car carry?'],
    options: [
      ['Warndreieck', 'Warning triangle', true],
      ['Verbandkasten', 'First-aid kit', true],
      ['Warnweste', 'High-visibility vest', true],
    ],
    why: ['Alle drei sind Pflicht. Achten Sie auch auf das Haltbarkeitsdatum des Verbandkastens.', 'All three are required. Check the first-aid kit’s expiry date too.'],
  }),
  t.mc({
    id: 'not-11',
    points: 4,
    q: ['Ein verletzter Motorradfahrer liegt bewusstlos auf der Straße. Was tun Sie?', 'An injured motorcyclist lies unconscious on the road. What do you do?'],
    options: [
      ['Notruf absetzen und Atmung prüfen', 'Call for help and check breathing', true],
      ['Bei normaler Atmung in die stabile Seitenlage bringen; den Helm abnehmen, wenn nötig', 'If breathing normally, use the recovery position; remove the helmet if necessary', true],
      ['Nichts tun, um keinen Fehler zu machen', 'Do nothing to avoid making a mistake', false],
    ],
    why: ['Der einzige echte Fehler ist, nicht zu helfen. Unterlassene Hilfeleistung ist strafbar.', 'The only real mistake is not helping. Failing to help is a crime.'],
  }),
  t.mc({
    id: 'not-12',
    points: 3,
    q: ['Wie weit vom Unfallort stellen Sie das Warndreieck innerorts ungefähr auf?', 'Roughly how far from a crash do you put the warning triangle in town?'],
    options: [
      ['Etwa 50 m', 'About 50 m', true],
      ['Etwa 200 m', 'About 200 m', false],
      ['Direkt hinter das Fahrzeug', 'Right behind the vehicle', false],
    ],
    why: ['Innerorts etwa 50 m, Landstraße etwa 100 m, Autobahn 150–400 m.', 'About 50 m in town, 100 m on rural roads, 150–400 m on motorways.'],
  }),

  t.mc({
    id: 'not-13',
    points: 4,
    q: ['Ein Verletzter ist bewusstlos, atmet aber normal. Was tun Sie?', 'An injured person is unconscious but breathing normally. What do you do?'],
    options: [
      ['Ihn in die stabile Seitenlage bringen und den Notruf 112 wählen', 'Put them in the recovery position and call 112', true],
      ['Mit der Herzdruckmassage beginnen', 'Start chest compressions', false],
      ['Ihn aufsetzen und etwas trinken lassen', 'Sit them up and give them something to drink', false],
    ],
    why: ['Die stabile Seitenlage hält die Atemwege frei. Prüfen Sie die Atmung immer wieder, bis Hilfe kommt.', 'The recovery position keeps the airway open. Keep checking the breathing until help arrives.'],
  }),
  t.mc({
    id: 'not-14',
    points: 4,
    q: ['Eine Person ist bewusstlos und atmet nicht normal. Was ist richtig?', 'A person is unconscious and not breathing normally. What is right?'],
    options: [
      ['Notruf 112 wählen und sofort mit der Herzdruckmassage beginnen', 'Call 112 and start chest compressions at once', true],
      ['Warten, bis der Rettungsdienst da ist', 'Wait until the ambulance arrives', false],
      ['In die stabile Seitenlage bringen und weggehen', 'Put them in the recovery position and leave', false],
    ],
    why: ['Ohne normale Atmung zählt jede Minute. Drücken Sie fest und schnell in der Mitte des Brustkorbs, bis Hilfe kommt.', 'Without normal breathing every minute counts. Push hard and fast in the centre of the chest until help arrives.'],
  }),
  t.mc({
    id: 'not-15',
    points: 3,
    q: ['Ihr Auto bleibt außerorts liegen. Wann ziehen Sie die Warnweste an?', 'Your car breaks down outside a built-up area. When do you put on the high-visibility vest?'],
    options: [
      ['Noch im Auto, bevor ich aussteige', 'Still inside the car, before I get out', true],
      ['Erst nachdem ich das Warndreieck aufgestellt habe', 'Only after I have set up the warning triangle', false],
      ['Nur nachts', 'Only at night', false],
    ],
    why: ['Wer am Straßenrand aussteigt, soll sofort gut sichtbar sein – auch tagsüber.', 'Anyone getting out at the roadside should be clearly visible at once – in daylight too.'],
  }),
  t.mc({
    id: 'not-16',
    points: 3,
    q: ['Wer muss an einem Unfallort Erste Hilfe leisten?', 'Who has to give first aid at the scene of an accident?'],
    options: [
      ['Jeder, dem es zuzumuten ist – auch Unbeteiligte', 'Everyone who can reasonably do so – including bystanders', true],
      ['Nur die Unfallbeteiligten', 'Only those involved in the accident', false],
      ['Nur Ärzte und Sanitäter', 'Only doctors and paramedics', false],
    ],
    why: ['Unterlassene Hilfeleistung ist strafbar. Schon der Notruf und das Absichern sind Hilfe.', 'Failing to help is a crime. Calling 112 and securing the scene already count as help.'],
  }),
  t.mc({
    id: 'not-17',
    points: 3,
    q: ['Sie haben ein Reh angefahren. Was tun Sie?', 'You have hit a deer. What do you do?'],
    options: [
      ['Unfallstelle absichern und die Polizei verständigen', 'Secure the scene and inform the police', true],
      ['Das Tier ins Auto laden und mitnehmen', 'Load the animal into the car and take it with me', false],
      ['Einfach weiterfahren', 'Simply drive on', false],
    ],
    why: ['Warnblinker an, Warndreieck aufstellen, Polizei rufen. Das Tier nicht anfassen und nicht mitnehmen – das wäre Wilderei.', 'Hazard lights on, warning triangle out, call the police. Do not touch or take the animal – that would be poaching.'],
  }),
];
