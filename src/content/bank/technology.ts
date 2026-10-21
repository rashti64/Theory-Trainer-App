import { topic } from './build';

const t = topic('technology', 'class');

export const TECHNOLOGY = [
  t.num({
    id: 'tec-01',
    points: 3,
    q: ['Wie tief muss das Reifenprofil gesetzlich mindestens sein?', 'What is the legal minimum tyre tread depth?'],
    value: 1.6,
    unit: ['mm', 'mm'],
    why: ['Gesetzlich 1,6 mm. Empfohlen werden mindestens 3 mm bei Sommer- und 4 mm bei Winterreifen.', 'The legal minimum is 1.6 mm. At least 3 mm (summer) and 4 mm (winter) are recommended.'],
  }),
  t.mc({
    id: 'tec-02',
    points: 3,
    q: ['Wann prüfen Sie den Reifendruck richtig?', 'When is the right time to check tyre pressure?'],
    options: [
      ['Bei kalten Reifen', 'When the tyres are cold', true],
      ['Direkt nach einer langen Autobahnfahrt', 'Right after a long motorway drive', false],
    ],
    why: ['Warme Reifen zeigen einen höheren Druck. Bei voller Beladung ist oft mehr Druck vorgeschrieben – siehe Betriebsanleitung.', 'Warm tyres read higher. With a full load more pressure is often required – see the manual.'],
  }),
  t.mc({
    id: 'tec-03',
    points: 4,
    q: ['Welchen Vorteil bietet ein Antiblockiersystem (ABS) bei einer Vollbremsung?', 'What is the benefit of ABS in an emergency stop?'],
    options: [
      ['Das Fahrzeug bleibt lenkbar', 'The car can still be steered', true],
      ['Ich darf mit voller Kraft auf die Bremse treten, die Räder blockieren nicht', 'I can brake with full force; the wheels won’t lock', true],
      ['Der Bremsweg ist immer kürzer', 'The braking distance is always shorter', false],
    ],
    why: ['ABS verhindert blockierende Räder. Auf Schnee oder Schotter kann der Bremsweg sogar länger sein.', 'ABS stops the wheels from locking. On snow or gravel the braking distance can even be longer.'],
  }),
  t.mc({
    id: 'tec-04',
    points: 3,
    q: ['Wozu dient das ESP (Elektronisches Stabilitätsprogramm)?', 'What does ESP (electronic stability control) do?'],
    options: [
      ['Es hilft, ein Schleudern zu verhindern', 'It helps prevent skidding', true],
      ['Es hebt die physikalischen Grenzen auf', 'It overcomes the laws of physics', false],
    ],
    why: ['ESP bremst einzelne Räder gezielt ab. Bei zu hoher Geschwindigkeit kann aber auch ESP nichts mehr retten.', 'ESP brakes individual wheels. At too high a speed even ESP cannot save you.'],
  }),
  t.mc({
    id: 'tec-05',
    points: 4,
    q: ['Das Bremspedal lässt sich ungewöhnlich weit durchtreten. Was tun Sie?', 'The brake pedal goes down unusually far. What do you do?'],
    options: [
      ['Nicht weiterfahren und die Bremse prüfen lassen', 'Stop driving and have the brakes checked', true],
      ['Vorsichtig weiterfahren, solange das Auto noch bremst', 'Carry on carefully as long as it still brakes', false],
    ],
    why: ['Mögliche Ursachen sind Luft oder Undichtigkeit im Bremssystem – die Bremse kann ganz ausfallen.', 'Possible causes are air or a leak in the brake system – the brakes could fail completely.'],
  }),
  t.mc({
    id: 'tec-06',
    points: 3,
    q: ['Warum muss die Bremsflüssigkeit regelmäßig gewechselt werden?', 'Why must brake fluid be changed regularly?'],
    options: [
      ['Sie nimmt Wasser auf, dadurch sinkt ihr Siedepunkt', 'It absorbs water, lowering its boiling point', true],
      ['Sie verdunstet im Sommer', 'It evaporates in summer', false],
    ],
    why: ['Mit Wasser kann die Flüssigkeit bei starker Belastung Dampfblasen bilden – die Bremswirkung lässt nach.', 'With water in it, the fluid can form vapour bubbles under heavy use – braking fades.'],
  }),
  t.num({
    id: 'tec-07',
    points: 3,
    q: ['Alle wie viele Jahre muss ein Pkw zur Hauptuntersuchung (nach der ersten)?', 'Every how many years must a car go for its main inspection (after the first one)?'],
    value: 2,
    unit: ['Jahre', 'years'],
    why: ['Neue Pkw müssen erstmals nach 3 Jahren zur HU, danach alle 2 Jahre.', 'New cars go for their first inspection after 3 years, then every 2 years.'],
  }),
  t.mc({
    id: 'tec-08',
    points: 4,
    q: ['Während der Fahrt leuchtet die rote Öldruck-Kontrollleuchte auf. Was tun Sie?', 'While driving, the red oil pressure warning light comes on. What do you do?'],
    options: [
      ['Sofort an geeigneter Stelle anhalten und den Motor abstellen', 'Stop as soon as safely possible and switch off the engine', true],
      ['Bis nach Hause weiterfahren und dort nachsehen', 'Drive home and check there', false],
    ],
    why: ['Ohne Öldruck kann der Motor in kurzer Zeit schwer beschädigt werden.', 'Without oil pressure the engine can be badly damaged within moments.'],
  }),
  t.mc({
    id: 'tec-09',
    points: 4,
    q: ['Sie wollen einen rückwärts gerichteten Kindersitz auf dem Beifahrersitz anbringen. Was müssen Sie beachten?', 'You want to fit a rear-facing child seat on the front passenger seat. What must you do?'],
    options: [
      ['Den Beifahrer-Airbag abschalten', 'Deactivate the passenger airbag', true],
      ['Nichts, der Airbag schützt auch das Kind', 'Nothing, the airbag protects the child too', false],
    ],
    why: ['Ein auslösender Airbag kann ein Kind in einer rückwärts gerichteten Schale lebensgefährlich verletzen.', 'A deploying airbag can fatally injure a child in a rear-facing seat.'],
  }),
  t.mc({
    id: 'tec-10',
    points: 3,
    q: ['Wie stellen Sie die Kopfstütze richtig ein?', 'How do you adjust the head restraint correctly?'],
    options: [
      ['Die Oberkante etwa auf Höhe des Scheitels, möglichst nah am Kopf', 'Its top level with the top of your head, as close to the head as possible', true],
      ['Auf Höhe des Nackens', 'At neck height', false],
    ],
    why: ['Eine zu tief eingestellte Kopfstütze kann bei einem Auffahrunfall schwere Halsverletzungen verursachen.', 'A head restraint set too low can cause serious neck injuries in a rear-end crash.'],
  }),
  t.mc({
    id: 'tec-11',
    points: 3,
    q: ['Ihr Auto hat einen Spurhalte- und einen Abstandsassistenten. Was gilt?', 'Your car has lane-keeping and adaptive cruise assistants. What applies?'],
    options: [
      ['Ich bleibe immer selbst für das Fahren verantwortlich', 'I always remain responsible for driving', true],
      ['Ich darf während der Fahrt am Handy schreiben', 'I may text on my phone while driving', false],
    ],
    why: ['Assistenzsysteme unterstützen, ersetzen aber nicht die Aufmerksamkeit des Fahrers.', 'Driver assistance helps but does not replace the driver’s attention.'],
  }),
  t.mc({
    id: 'tec-12',
    points: 3,
    q: ['Was sollten Sie vor jeder Fahrt kontrollieren?', 'What should you check before every journey?'],
    options: [
      ['Ob die Beleuchtung funktioniert', 'That the lights work', true],
      ['Ob die Scheiben frei und sauber sind', 'That the windows are clear and clean', true],
      ['Ob Sitz, Spiegel und Kopfstütze richtig eingestellt sind', 'That seat, mirrors and head restraint are adjusted', true],
    ],
    why: ['Wer schlecht sieht oder nicht gesehen wird, gefährdet sich und andere.', 'If you can’t see properly or can’t be seen, you endanger yourself and others.'],
  }),
  t.mc({
    id: 'tec-13',
    points: 3,
    q: ['Der Motor ist heiß und die Kühlwasseranzeige steht im roten Bereich. Was ist richtig?', 'The engine is hot and the coolant gauge is in the red. What is right?'],
    options: [
      ['Anhalten, Motor abkühlen lassen; den Kühlerdeckel nicht heiß öffnen', 'Stop and let it cool; don’t open the radiator cap while hot', true],
      ['Den Kühlerdeckel sofort öffnen, um Dampf abzulassen', 'Open the cap at once to let off steam', false],
    ],
    why: ['Das Kühlsystem steht unter Druck – heißes Wasser kann Verbrühungen verursachen.', 'The cooling system is under pressure – hot coolant can scald you.'],
  }),

  t.mc({
    id: 'tec-14',
    points: 3,
    q: ['Welche Reifen gelten bei Glatteis, Schnee oder Matsch als Winterreifen?', 'Which tyres count as winter tyres on ice, snow or slush?'],
    options: [
      ['Reifen mit dem Alpine-Symbol (Berg mit Schneeflocke)', 'Tyres with the Alpine symbol (mountain with snowflake)', true],
      ['Jeder Reifen mit der Kennzeichnung „M+S“', 'Any tyre marked "M+S"', false],
      ['Jeder Reifen mit mindestens 1,6 mm Profil', 'Any tyre with at least 1.6 mm of tread', false],
    ],
    why: ['Seit Oktober 2024 erfüllen nur noch Reifen mit Alpine-Symbol die Winterreifenpflicht. Reine M+S-Reifen reichen nicht mehr.', 'Since October 2024 only tyres with the Alpine symbol meet the winter-tyre requirement. Tyres marked only M+S no longer do.'],
  }),
  t.mc({
    id: 'tec-15',
    points: 3,
    q: ['Wann schalten Sie die Warnblinkanlage ein?', 'When do you switch on the hazard warning lights?'],
    options: [
      ['Wenn ich auf der Autobahn das Ende eines Staus erreiche', 'When I reach the end of a traffic jam on the motorway', true],
      ['Wenn mein Auto liegen geblieben ist', 'When my car has broken down', true],
      ['Wenn ich kurz in zweiter Reihe halte', 'When I briefly stop in the second row', false],
    ],
    why: ['Warnblinklicht warnt vor einer Gefahr. Es macht verbotenes Halten nicht erlaubt.', 'Hazard lights warn of danger. They do not make illegal stopping legal.'],
  }),
  t.mc({
    id: 'tec-16',
    points: 3,
    q: ['Die Lenkung hat plötzlich deutlich mehr Spiel als sonst. Was tun Sie?', 'The steering suddenly has much more play than usual. What do you do?'],
    options: [
      ['Das Auto sofort in einer Werkstatt prüfen lassen', 'Have the car checked at a garage straight away', true],
      ['Weiterfahren und vorsichtiger lenken', 'Carry on and steer more carefully', false],
    ],
    why: ['Mängel an Lenkung und Bremsen gefährden die Verkehrssicherheit. Fahren Sie nicht weiter, bis sie behoben sind.', 'Faults in steering or brakes put road safety at risk. Do not carry on until they are fixed.'],
  }),
  t.mc({
    id: 'tec-17',
    points: 2,
    q: ['Was sollten Sie an der Beleuchtung regelmäßig kontrollieren?', 'What should you check on your lights regularly?'],
    options: [
      ['Ob alle Leuchten funktionieren, auch Brems- und Blinkleuchten', 'Whether all lights work, including brake lights and indicators', true],
      ['Ob die Scheinwerfer sauber sind', 'Whether the headlights are clean', true],
      ['Nichts, Defekte zeigt das Auto immer an', 'Nothing, the car always shows faults', false],
    ],
    why: ['Defekte Leuchten zeigt nicht jedes Auto an. Bitten Sie z. B. jemanden, die Bremslichter zu prüfen.', 'Not every car reports broken lights. Ask someone to check your brake lights, for example.'],
  }),
  t.mc({
    id: 'tec-18',
    points: 2,
    q: ['Der Scheibenwischer hinterlässt Schlieren. Was ist richtig?', 'The windscreen wiper leaves streaks. What is right?'],
    options: [
      ['Die Wischerblätter erneuern, weil die Sicht schlechter ist', 'Replace the wiper blades, because visibility is worse', true],
      ['Das ist harmlos, solange es nicht regnet', 'That is harmless as long as it is not raining', false],
    ],
    why: ['Gute Sicht ist Pflicht. Verschlissene Wischerblätter verschlechtern sie besonders nachts und bei Regen.', 'Good visibility is a must. Worn wipers make it worse, especially at night and in rain.'],
  }),
];
