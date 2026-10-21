import { M, topic } from './build';

const t = topic('people', 'basic');

export const PEOPLE = [
  t.mc({
    id: 'mns-01',
    points: 4,
    q: ['Am Straßenrand spielen Kinder mit einem Ball. Wie verhalten Sie sich?', 'Children are playing with a ball at the roadside. What do you do?'],
    options: [
      ['Langsamer fahren und bremsbereit sein', 'Slow down and be ready to brake', true],
      ['Damit rechnen, dass ein Kind plötzlich auf die Straße läuft', 'Expect a child to run into the road suddenly', true],
      ['Hupen und zügig vorbeifahren', 'Sound the horn and pass quickly', false],
    ],
    why: ['Kinder können Gefahren oft nicht einschätzen und laufen dem Ball hinterher. Gegenüber Kindern gilt: Gefährdung ausschließen.', 'Children often cannot judge danger and chase the ball. With children you must rule out any danger.'],
  }),
  t.mc({
    id: 'mns-02',
    points: 5,
    q: ['Ein Fußgänger will an einem Zebrastreifen die Straße überqueren. Was müssen Sie tun?', 'A pedestrian wants to cross at a zebra crossing. What must you do?'],
    options: [
      ['Mit mäßiger Geschwindigkeit heranfahren und, wenn nötig, anhalten', 'Approach at moderate speed and stop if necessary', true],
      ['Ihn über die Straße gehen lassen', 'Let them cross', true],
      ['Hupen, damit er wartet', 'Sound the horn so they wait', false],
    ],
    why: ['Am Fußgängerüberweg haben Fußgänger, die erkennbar hinüber wollen, Vorrang. Überholen ist dort verboten.', 'At a zebra crossing, pedestrians who clearly want to cross have priority. Overtaking there is forbidden.'],
  }),
  t.mc({
    id: 'mns-03',
    points: 4,
    q: ['Ein Linienbus hält mit eingeschaltetem Warnblinklicht an einer Haltestelle. Wie dürfen Sie vorbeifahren?', 'A bus is stopped at a bus stop with its hazard lights on. How may you pass?'],
    options: [
      ['Nur mit Schrittgeschwindigkeit', 'Only at walking pace', true],
      ['Auch im Gegenverkehr auf derselben Fahrbahn nur mit Schrittgeschwindigkeit', 'At walking pace in the opposite direction too, on the same carriageway', true],
      ['Normal, wenn ich hupe', 'At normal speed if I sound the horn', false],
    ],
    why: ['Fahrgäste dürfen nicht gefährdet werden; notfalls müssen Sie warten. Das gilt auch für den Gegenverkehr auf derselben Fahrbahn, nicht bei baulich getrennten Fahrbahnen.', 'Passengers must not be endangered; if necessary you must wait. This also applies to oncoming traffic on the same carriageway, but not across a separated carriageway.'],
  }),
  t.mc({
    id: 'mns-04',
    points: 4,
    q: ['Ein Linienbus oder Schulbus nähert sich einer Haltestelle und hat das Warnblinklicht eingeschaltet. Was gilt?', 'A scheduled bus or school bus approaches a stop with its hazard lights on. What applies?'],
    options: [
      ['Ich darf ihn nicht überholen', 'I must not overtake it', true],
      ['Ich darf ihn überholen, wenn ich mich beeile', 'I may overtake if I hurry', false],
    ],
    why: ['Linien- und Schulbusse, die sich mit Warnblinklicht einer Haltestelle nähern, dürfen nicht überholt werden.', 'Scheduled and school buses approaching a stop with hazard lights on must not be overtaken.'],
  }),
  t.mc({
    id: 'mns-05',
    points: 4,
    q: ['Ein Linienbus oder Schulbus will von einer gekennzeichneten Haltestelle abfahren und blinkt. Was müssen Sie tun?', 'A scheduled bus or school bus wants to pull away from a marked stop and is indicating. What must you do?'],
    options: [
      ['Ihm das Abfahren ermöglichen, wenn nötig warten', 'Let it pull away, waiting if necessary', true],
      ['Schnell vorbeifahren, bevor er losfährt', 'Pass quickly before it moves', false],
    ],
    why: ['Linienbussen und Schulbussen müssen Sie das Abfahren von gekennzeichneten Haltestellen ermöglichen – innerorts wie außerorts. Wenn nötig, warten Sie.', 'You must let scheduled and school buses pull away from marked stops – inside and outside built-up areas. Wait if necessary.'],
  }),
  t.num({
    id: 'mns-06',
    points: 4,
    q: ['Welchen seitlichen Mindestabstand müssen Sie innerorts beim Überholen eines Radfahrers einhalten?', 'What minimum side gap must you leave in town when overtaking a cyclist?'],
    value: 1.5,
    unit: M,
    why: ['Innerorts mindestens 1,5 m, außerorts mindestens 2 m.', 'At least 1.5 m in town and at least 2 m outside towns.'],
  }),
  t.num({
    id: 'mns-07',
    points: 4,
    q: ['Welchen seitlichen Mindestabstand müssen Sie außerorts beim Überholen eines Radfahrers einhalten?', 'What minimum side gap must you leave outside towns when overtaking a cyclist?'],
    value: 2,
    unit: M,
    why: ['Außerorts mindestens 2 m, innerorts mindestens 1,5 m. Reicht der Platz nicht, warten Sie.', 'At least 2 m outside towns, 1.5 m in town. If there isn’t room, wait.'],
  }),
  t.mc({
    id: 'mns-08',
    points: 4,
    q: ['Ein älterer Mensch geht unsicher über die Straße. Wie verhalten Sie sich?', 'An elderly person is crossing the road unsteadily. What do you do?'],
    options: [
      ['Anhalten und ihn in Ruhe gehen lassen', 'Stop and let them cross in peace', true],
      ['Nicht hupen und nicht drängeln', 'Don’t sound the horn or pressure them', true],
      ['Knapp hinter ihm vorbeifahren', 'Pass closely behind them', false],
    ],
    why: ['Ältere und hilfsbedürftige Menschen brauchen mehr Zeit. Gefährdung muss ausgeschlossen sein.', 'Elderly and vulnerable people need more time. Any danger must be ruled out.'],
  }),
  t.mc({
    id: 'mns-09',
    points: 4,
    q: ['Bevor Sie die Fahrertür öffnen, worauf müssen Sie achten?', 'Before opening your driver’s door, what must you check?'],
    options: [
      ['Auf Radfahrer und Fahrzeuge von hinten', 'Cyclists and vehicles coming from behind', true],
      ['Ich öffne die Tür am besten mit der rechten Hand („Holländischer Griff“)', 'I open it with my right hand (the "Dutch reach")', true],
      ['Ich darf die Tür schnell öffnen, wenn ich in einer Parklücke stehe', 'I may open it quickly when parked', false],
    ],
    why: ['Mit der rechten Hand drehen Sie sich automatisch um und sehen Radfahrer hinter sich.', 'Using your right hand turns your body so you see cyclists behind you.'],
  }),
  t.mc({
    id: 'mns-10',
    points: 3,
    q: ['Wo dürfen E-Scooter (Elektrokleinstfahrzeuge) fahren?', 'Where may e-scooters ride?'],
    options: [
      ['Auf Radwegen und Radfahrstreifen', 'On cycle paths and cycle lanes', true],
      ['Wenn es keinen Radweg gibt, auf der Fahrbahn', 'On the road if there is no cycle path', true],
      ['Auf dem Gehweg', 'On the pavement', false],
    ],
    why: ['E-Scooter gehören auf Radwege oder, wenn es keine gibt, auf die Fahrbahn – nicht auf den Gehweg.', 'E-scooters belong on cycle paths or, if there are none, on the road – not on the pavement.'],
  }),
  t.mc({
    id: 'mns-11',
    points: 4,
    q: ['Ein Kind steht zwischen parkenden Autos am Fahrbahnrand. Was tun Sie?', 'A child is standing between parked cars at the roadside. What do you do?'],
    options: [
      ['Geschwindigkeit verringern und bremsbereit sein', 'Reduce speed and be ready to brake', true],
      ['Möglichst großen Abstand halten', 'Keep as much distance as possible', true],
      ['Hupen und unverändert weiterfahren', 'Sound the horn and carry on unchanged', false],
    ],
    why: ['Kinder sind klein und hinter Autos schlecht zu sehen. Sie können jederzeit loslaufen.', 'Children are small and hard to see behind cars. They may run out at any moment.'],
  }),
  t.mc({
    id: 'mns-12',
    points: 4,
    q: ['Radfahrer fahren nebeneinander vor Ihnen. Ist das erlaubt?', 'Cyclists are riding side by side ahead of you. Is that allowed?'],
    options: [
      ['Ja, wenn der Verkehr dadurch nicht behindert wird', 'Yes, if it doesn’t obstruct traffic', true],
      ['Nein, Radfahrer müssen immer hintereinander fahren', 'No, cyclists must always ride in single file', false],
    ],
    why: ['Radfahrer dürfen nebeneinander fahren, wenn andere nicht behindert werden. Bleiben Sie geduldig und überholen Sie nur mit genug Abstand.', 'Cyclists may ride two abreast if they don’t obstruct others. Be patient and only overtake with enough room.'],
  }),
  t.mc({
    id: 'mns-13',
    points: 4,
    q: ['Ein Schulbus hält am Fahrbahnrand. Kinder steigen aus. Womit müssen Sie rechnen?', 'A school bus stops at the roadside and children get off. What must you expect?'],
    options: [
      ['Kinder laufen vor oder hinter dem Bus über die Straße', 'Children run across the road in front of or behind the bus', true],
      ['Die Kinder warten immer, bis der Bus weggefahren ist', 'The children always wait until the bus has left', false],
    ],
    why: ['Fahren Sie langsam und bremsbereit vorbei – bei Warnblinklicht nur mit Schrittgeschwindigkeit.', 'Pass slowly and ready to brake – at walking pace if the hazard lights are on.'],
  }),
  t.mc({
    id: 'mns-14',
    points: 3,
    q: ['Ein Mensch mit weißem Stock steht an der Bordsteinkante. Was bedeutet das?', 'A person with a white cane is standing at the kerb. What does that mean?'],
    options: [
      ['Er ist blind oder stark sehbehindert', 'They are blind or severely visually impaired', true],
      ['Ich muss besonders vorsichtig sein und ihn gehen lassen', 'I must be extra careful and let them cross', true],
      ['Er wartet auf ein Taxi', 'They are waiting for a taxi', false],
    ],
    why: ['Blinde Menschen kennzeichnen sich mit weißem Stock, gelber Armbinde oder Blindenhund. Gefährdung ausschließen.', 'Blind people are marked by a white cane, a yellow armband or a guide dog. Rule out any danger.'],
  }),

  t.mc({
    id: 'mns-15',
    points: 4,
    q: ['Dürfen Sie an einem Fußgängerüberweg (Zebrastreifen) überholen?', 'May you overtake at a pedestrian crossing (zebra crossing)?'],
    options: [
      ['Nein, an Fußgängerüberwegen ist Überholen verboten', 'No, overtaking at pedestrian crossings is forbidden', true],
      ['Ja, wenn gerade niemand über die Straße geht', 'Yes, if nobody is crossing at that moment', false],
    ],
    why: ['Ein haltendes Fahrzeug kann einen Fußgänger verdecken. Deshalb wird am Zebrastreifen nicht überholt.', 'A stopped vehicle can hide a pedestrian. That is why you never overtake at a zebra crossing.'],
  }),
  t.mc({
    id: 'mns-16',
    points: 4,
    q: ['Eine Straßenbahn hält an einer Haltestelle ohne Verkehrsinsel. Fahrgäste steigen aus. Was gilt?', 'A tram stops at a stop without a traffic island. Passengers are getting off. What applies?'],
    options: [
      ['Ich darf rechts nur mit Schrittgeschwindigkeit vorbeifahren und muss notfalls warten', 'I may only pass on the right at walking pace and must wait if necessary', true],
      ['Ich darf zügig vorbeifahren, wenn ich hupe', 'I may pass quickly if I sound the horn', false],
      ['Ich muss links an der Straßenbahn vorbeifahren', 'I must pass the tram on the left', false],
    ],
    why: ['Aussteigende Fahrgäste gehen direkt über die Fahrbahn. Sie dürfen sie nicht gefährden.', 'Passengers getting off step straight onto the road. You must not endanger them.'],
  }),
  t.mc({
    id: 'mns-17',
    points: 3,
    q: ['Ein etwa siebenjähriges Kind fährt mit dem Fahrrad auf dem Gehweg. Ist das erlaubt?', 'A child of about seven is cycling on the pavement. Is that allowed?'],
    options: [
      ['Ja, Kinder bis 8 Jahre müssen auf dem Gehweg fahren (oder auf einem baulich getrennten Radweg)', 'Yes, children up to 8 must ride on the pavement (or on a physically separated cycle path)', true],
      ['Nein, Fahrräder gehören immer auf die Fahrbahn', 'No, bicycles always belong on the road', false],
    ],
    why: ['Kinder bis zum vollendeten 8. Lebensjahr müssen den Gehweg benutzen, außer es gibt einen baulich getrennten Radweg; bis 10 Jahre dürfen sie den Gehweg benutzen. Rechnen Sie damit, dass sie plötzlich auf die Fahrbahn fahren.', 'Children up to their 8th birthday must use the pavement unless there is a physically separated cycle path; up to 10 they may use the pavement. Expect them to ride onto the road suddenly.'],
  }),
  t.mc({
    id: 'mns-18',
    points: 3,
    q: ['Sie wollen eine Gruppe Reiter auf einer Landstraße überholen. Wie verhalten Sie sich?', 'You want to overtake a group of horse riders on a country road. What do you do?'],
    options: [
      ['Langsam und mit großem seitlichem Abstand überholen', 'Overtake slowly with a wide gap', true],
      ['Vorher kurz hupen, damit die Reiter Bescheid wissen', 'Sound the horn briefly first so the riders know', false],
      ['Zügig beschleunigen, damit es schnell vorbei ist', 'Accelerate hard to get past quickly', false],
    ],
    why: ['Pferde können vor Lärm und schnellen Autos scheuen. Leise und langsam vorbeifahren.', 'Horses can bolt at noise or fast cars. Pass quietly and slowly.'],
  }),
  t.mc({
    id: 'mns-19',
    points: 4,
    q: ['Sie biegen ab und sehen, dass ein Fußgänger am Fahrbahnrand steht und auf die Straße schaut. Was tun Sie?', 'You are turning and see a pedestrian at the kerb looking at the road. What do you do?'],
    options: [
      ['Langsamer werden und bremsbereit sein', 'Slow down and be ready to brake', true],
      ['Ihm durch Hupen zeigen, dass ich komme', 'Sound the horn to show I am coming', false],
      ['Mein Tempo beibehalten, er muss warten', 'Keep my speed, he has to wait', false],
    ],
    why: ['Beim Abbiegen haben Fußgänger, die die Straße überqueren, Vorrang. Rechnen Sie damit, dass er losgeht.', 'When you turn, pedestrians crossing the road have priority. Expect him to step out.'],
  }),
];
