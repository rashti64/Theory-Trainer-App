import { topic } from './build';

const t = topic('conditions', 'basic');

export const CONDITIONS = [
  t.mc({
    id: 'wtr-01',
    points: 4,
    q: ['Wann müssen Sie auch tagsüber das Abblendlicht einschalten?', 'When must you switch on dipped headlights during the day?'],
    options: [
      ['Wenn Nebel, Schneefall oder Regen die Sicht erheblich behindern', 'When fog, snow or rain seriously reduce visibility', true],
      ['In Tunneln', 'In tunnels', true],
      ['Nur auf der Autobahn', 'Only on the motorway', false],
    ],
    why: ['Bei schlechter Sicht geht es darum, selbst gesehen zu werden – das Tagfahrlicht reicht dann nicht.', 'In poor visibility you need to be seen – daytime running lights are not enough then.'],
  }),
  t.mc({
    id: 'wtr-02',
    points: 4,
    q: ['Wann dürfen Sie die Nebelschlussleuchte einschalten?', 'When may you switch on the rear fog light?'],
    options: [
      ['Nur wenn Nebel die Sicht auf weniger als 50 m begrenzt', 'Only when fog limits visibility to under 50 m', true],
      ['Bei jedem Regen', 'Whenever it rains', false],
      ['Nachts auf der Landstraße', 'At night on rural roads', false],
    ],
    why: ['Die Nebelschlussleuchte blendet stark. Ist sie an, dürfen Sie höchstens 50 km/h fahren.', 'The rear fog light dazzles strongly. With it on, you may drive at most 50 km/h.'],
  }),
  t.mc({
    id: 'wtr-03',
    points: 4,
    q: ['Wann müssen Sie vom Fernlicht abblenden?', 'When must you switch from high beam to dipped beam?'],
    options: [
      ['Wenn mir jemand entgegenkommt', 'When someone comes towards me', true],
      ['Wenn ich dicht hinter einem anderen Fahrzeug fahre', 'When I drive closely behind another vehicle', true],
      ['Nur innerorts', 'Only in town', false],
    ],
    why: ['Fernlicht blendet Entgegenkommende und Vorausfahrende im Spiegel.', 'High beam dazzles oncoming drivers and those ahead via their mirrors.'],
  }),
  t.mc({
    id: 'wtr-04',
    points: 4,
    q: ['Nachts blendet Sie der Gegenverkehr. Wie verhalten Sie sich?', 'At night you are dazzled by oncoming traffic. What do you do?'],
    options: [
      ['Auf den rechten Fahrbahnrand schauen', 'Look at the right edge of the road', true],
      ['Geschwindigkeit verringern, notfalls anhalten', 'Slow down, stopping if necessary', true],
      ['Selbst kurz aufblenden', 'Flash my own high beam', false],
    ],
    why: ['Der Blick zum rechten Rand hält Sie in der Spur, ohne ins Licht zu sehen.', 'Looking to the right edge keeps you in lane without staring into the light.'],
  }),
  t.mc({
    id: 'wtr-05',
    points: 5,
    q: ['Ihr Auto gerät auf nasser Fahrbahn ins Aufschwimmen (Aquaplaning). Was tun Sie?', 'Your car starts aquaplaning on a wet road. What do you do?'],
    options: [
      ['Auskuppeln bzw. vom Gas gehen', 'Declutch or take my foot off the accelerator', true],
      ['Das Lenkrad ruhig geradeaus halten', 'Hold the steering wheel steady and straight', true],
      ['Kräftig bremsen und gegenlenken', 'Brake hard and steer against it', false],
    ],
    why: ['Die Räder haben keinen Kontakt zur Straße. Erst wenn sie wieder greifen, können Sie lenken und bremsen.', 'The wheels have lost contact. Only once they grip again can you steer and brake.'],
  }),
  t.mc({
    id: 'wtr-06',
    points: 4,
    q: ['Es hat gerade angefangen zu regnen. Womit müssen Sie rechnen?', 'It has just started to rain. What should you expect?'],
    options: [
      ['Die Fahrbahn kann durch Staub und Öl besonders glatt sein', 'The road may be especially slippery from dust and oil', true],
      ['Die Fahrbahn ist am Anfang des Regens am griffigsten', 'The road has most grip at the start of rain', false],
    ],
    why: ['Der erste Regen mischt sich mit Staub, Gummiabrieb und Öl zu einem rutschigen Film.', 'The first rain mixes with dust, rubber and oil into a slippery film.'],
  }),
  t.mc({
    id: 'wtr-07',
    points: 4,
    q: ['Die Temperatur liegt knapp über 0 °C. Wo müssen Sie zuerst mit Glätte rechnen?', 'The temperature is just above 0 °C. Where should you expect ice first?'],
    options: [
      ['Auf Brücken', 'On bridges', true],
      ['In Waldschneisen und schattigen Stellen', 'In forest clearings and shaded spots', true],
      ['In beheizten Garagenausfahrten', 'At heated garage exits', false],
    ],
    why: ['Brücken kühlen von unten aus, Schattenstellen tauen später auf.', 'Bridges cool from below; shaded spots thaw later.'],
  }),
  t.mc({
    id: 'wtr-08',
    points: 4,
    q: ['Ein Reh steht nachts im Scheinwerferlicht am Straßenrand. Was tun Sie?', 'At night a deer stands in your headlights at the roadside. What do you do?'],
    options: [
      ['Abblenden, hupen und bremsen', 'Dip the lights, sound the horn and brake', true],
      ['Mit weiteren Tieren rechnen', 'Expect more animals to follow', true],
      ['Kräftig ausweichen, auch in den Gegenverkehr', 'Swerve hard, even into oncoming traffic', false],
    ],
    why: ['Fernlicht lässt Wild erstarren. Ist ein Zusammenstoß unvermeidbar, Lenkrad festhalten und nicht ausweichen – ein Ausweichmanöver ist oft gefährlicher.', 'High beam freezes animals. If a collision is unavoidable, hold the wheel and don’t swerve – swerving is often more dangerous.'],
  }),
  t.mc({
    id: 'wtr-09',
    points: 3,
    q: ['Wann brauchen Sie Winterreifen?', 'When do you need winter tyres?'],
    options: [
      ['Bei Glatteis, Schneeglätte, Schneematsch, Eis- oder Reifglätte', 'In black ice, snow, slush, ice or frost on the road', true],
      ['Die Reifen müssen das Alpine-Symbol (Bergpiktogramm mit Schneeflocke) tragen', 'The tyres must carry the Alpine symbol (mountain with snowflake)', true],
      ['Nur von Januar bis März', 'Only from January to March', false],
    ],
    why: ['In Deutschland gilt eine situative Winterreifenpflicht. Reifen nur mit „M+S“ reichen seit Oktober 2024 nicht mehr.', 'Germany requires winter tyres according to conditions, not dates. Tyres marked only "M+S" no longer count since October 2024.'],
  }),
  t.mc({
    id: 'wtr-10',
    points: 3,
    q: ['Wo müssen Sie besonders mit Seitenwind rechnen?', 'Where should you especially expect crosswinds?'],
    options: [
      ['Auf Brücken', 'On bridges', true],
      ['An Waldschneisen und beim Überholen von Lkw', 'At gaps in woods and when overtaking trucks', true],
      ['In engen Ortsdurchfahrten', 'In narrow town streets', false],
    ],
    why: ['Seitenwind trifft Sie plötzlich, wenn eine Deckung wegfällt. Lenkrad fest halten, Geschwindigkeit anpassen.', 'Crosswinds hit suddenly when shelter ends. Hold the wheel firmly and adjust your speed.'],
  }),
  t.mc({
    id: 'wtr-11',
    points: 3,
    q: ['Die tief stehende Sonne blendet Sie. Was tun Sie?', 'The low sun is dazzling you. What do you do?'],
    options: [
      ['Sonnenblende herunterklappen und langsamer fahren', 'Lower the sun visor and slow down', true],
      ['Auf saubere Scheiben achten', 'Make sure the windscreen is clean', true],
      ['Kurz die Augen schließen', 'Close my eyes briefly', false],
    ],
    why: ['Schmutzige Scheiben streuen das Licht und verstärken die Blendung.', 'Dirty windows scatter the light and make glare worse.'],
  }),
  t.mc({
    id: 'wtr-12',
    points: 3,
    q: ['Wann dürfen Sie Nebelscheinwerfer einschalten?', 'When may you switch on front fog lights?'],
    options: [
      ['Wenn Nebel, Schneefall oder Regen die Sicht erheblich behindern', 'When fog, snow or rain seriously reduce visibility', true],
      ['Nachts zur besseren Ausleuchtung bei klarer Sicht', 'At night for more light when visibility is clear', false],
    ],
    why: ['Nebelscheinwerfer sind nur bei erheblicher Sichtbehinderung erlaubt.', 'Front fog lights are only allowed when visibility is seriously reduced.'],
  }),

  t.mc({
    id: 'wtr-13',
    points: 4,
    q: ['Ihr Auto hat ABS. Auf glatter Straße müssen Sie plötzlich stark bremsen. Was tun Sie?', 'Your car has ABS. On a slippery road you suddenly have to brake hard. What do you do?'],
    options: [
      ['Das Bremspedal kräftig durchtreten und gedrückt halten', 'Press the brake pedal hard and keep it down', true],
      ['Die Bremse mehrmals schnell treten und lösen (pumpen)', 'Pump the brake by pressing and releasing it quickly', false],
      ['Nur leicht bremsen, damit das ABS nicht eingreift', 'Brake only lightly so ABS does not engage', false],
    ],
    why: ['ABS verhindert blockierende Räder. Es arbeitet nur, wenn Sie voll durchtreten. Das Pulsieren im Pedal ist normal.', 'ABS stops the wheels locking. It only works if you press fully. A pulsing pedal is normal.'],
  }),
  t.mc({
    id: 'wtr-14',
    points: 3,
    q: ['Auf der Straße liegt nasses Laub. Womit müssen Sie rechnen?', 'There are wet leaves on the road. What should you expect?'],
    options: [
      ['Mit Rutschgefahr und einem längeren Bremsweg', 'A risk of skidding and a longer braking distance', true],
      ['Mit besserer Haftung, weil Laub weich ist', 'Better grip, because leaves are soft', false],
    ],
    why: ['Nasses Laub wirkt fast wie Glatteis. Langsamer fahren und mehr Abstand halten.', 'Wet leaves can be almost as slippery as ice. Slow down and keep a bigger gap.'],
  }),
  t.mc({
    id: 'wtr-15',
    points: 3,
    q: ['Sie fahren in einen Tunnel. Was müssen Sie tun?', 'You are driving into a tunnel. What must you do?'],
    options: [
      ['Abblendlicht einschalten, auch wenn der Tunnel beleuchtet ist', 'Switch on dipped headlights, even if the tunnel is lit', true],
      ['Eine Sonnenbrille vor der Einfahrt abnehmen', 'Take off sunglasses before entering', true],
      ['Nebelschlussleuchte einschalten', 'Switch on the rear fog light', false],
    ],
    why: ['Im Tunnel gilt Lichtpflicht mit Abblendlicht. Ihre Augen brauchen Zeit, sich an die Dunkelheit zu gewöhnen.', 'Dipped headlights are compulsory in tunnels. Your eyes need time to adjust to the darkness.'],
  }),
  t.mc({
    id: 'wtr-16',
    points: 3,
    q: ['Zu welcher Tageszeit kommt es besonders oft zu Wildwechsel?', 'At what time of day do animals cross the road most often?'],
    options: [
      ['In der Morgen- und Abenddämmerung', 'At dawn and dusk', true],
      ['Um die Mittagszeit', 'Around midday', false],
    ],
    why: ['Wildtiere sind vor allem in der Dämmerung unterwegs. Achten Sie besonders an Wald- und Feldrändern auf das Schild „Wildwechsel“.', 'Wild animals are most active at dawn and dusk. Watch especially at forest and field edges and for the "deer crossing" sign.'],
  }),
  t.mc({
    id: 'wtr-17',
    points: 3,
    q: ['Sie fahren nachts auf einer Landstraße, niemand ist vor Ihnen oder kommt Ihnen entgegen. Welches Licht nutzen Sie?', 'You are driving at night on a country road with nobody ahead or coming towards you. Which lights do you use?'],
    options: [
      ['Fernlicht, damit ich weiter sehen kann', 'High beam, so that I can see further', true],
      ['Nur das Standlicht', 'Only sidelights', false],
      ['Die Nebelscheinwerfer', 'The fog lights', false],
    ],
    why: ['Fernlicht ist erlaubt, wenn niemand geblendet wird. Sobald jemand entgegenkommt oder vor Ihnen fährt, blenden Sie ab.', 'High beam is allowed when it dazzles nobody. As soon as someone comes towards you or drives ahead of you, dip your lights.'],
  }),
];
