import type { Situation } from '@/domain/types';

import { topic } from './build';

const t = topic('right-of-way', 'basic');

const me = (turn: Situation['vehicles'][number]['turn']) => ({ arm: 's' as const, kind: 'car' as const, color: 'orange' as const, turn, me: true });

export const RIGHT_OF_WAY = [
  t.mc({
    id: 'vfr-01',
    points: 5,
    q: ['Kreuzung ohne Schilder und ohne Ampel. Sie fahren geradeaus, der blaue Pkw kommt von rechts. Wer darf zuerst fahren?', 'A junction without signs or lights. You go straight on; the blue car comes from the right. Who goes first?'],
    situation: {
      spec: { kind: 'crossroads', vehicles: [me('straight'), { arm: 'e', kind: 'car', color: 'blue', turn: 'straight' }] },
      alt: ['Kreuzung ohne Schilder; Sie von unten, blauer Pkw von rechts, beide geradeaus.', 'Unsigned junction; you from below, blue car from the right, both straight on.'],
    },
    options: [
      ['Der blaue Pkw', 'The blue car', true],
      ['Ich', 'Me', false],
      ['Wer zuerst an der Kreuzung ist', 'Whoever reaches the junction first', false],
    ],
    why: ['Ohne Regelung gilt „rechts vor links“: Der blaue Pkw kommt von rechts.', 'Without any signs, "right before left" applies: the blue car comes from your right.'],
  }),
  t.mc({
    id: 'vfr-02',
    points: 5,
    q: ['Kreuzung ohne Schilder. Sie fahren geradeaus, der rote Pkw kommt von links. Wer darf zuerst fahren?', 'Unsigned junction. You go straight on; the red car comes from the left. Who goes first?'],
    situation: {
      spec: { kind: 'crossroads', vehicles: [me('straight'), { arm: 'w', kind: 'car', color: 'red', turn: 'straight' }] },
      alt: ['Kreuzung ohne Schilder; roter Pkw von links.', 'Unsigned junction; red car from the left.'],
    },
    options: [
      ['Ich', 'Me', true],
      ['Der rote Pkw', 'The red car', false],
    ],
    why: ['Für den roten Pkw kommen Sie von rechts – er muss warten.', 'For the red car you are coming from its right – it has to wait.'],
  }),
  t.mc({
    id: 'vfr-03',
    points: 5,
    q: ['Kreuzung ohne Schilder. Der blaue Pkw kommt von rechts, der rote von links, alle fahren geradeaus. In welcher Reihenfolge wird gefahren?', 'Unsigned junction. Blue comes from the right, red from the left, everyone goes straight on. In which order do you drive?'],
    situation: {
      spec: {
        kind: 'crossroads',
        vehicles: [me('straight'), { arm: 'e', kind: 'car', color: 'blue', turn: 'straight' }, { arm: 'w', kind: 'car', color: 'red', turn: 'straight' }],
      },
      alt: ['Drei Pkw an einer Kreuzung ohne Schilder.', 'Three cars at an unsigned junction.'],
    },
    options: [
      ['Blau, dann ich, dann rot', 'Blue, then me, then red', true],
      ['Ich, dann blau, dann rot', 'Me, then blue, then red', false],
      ['Rot, dann ich, dann blau', 'Red, then me, then blue', false],
    ],
    why: ['Blau hat rechts von sich niemanden und fährt zuerst. Dann haben Sie niemanden mehr rechts. Rot muss auf alle warten.', 'Blue has nobody on its right and goes first. Then nobody is on your right. Red waits for everyone.'],
  }),
  t.mc({
    id: 'vfr-04',
    points: 5,
    q: ['Sie wollen links abbiegen. Der blaue Pkw kommt Ihnen entgegen und fährt geradeaus. Wer fährt zuerst?', 'You want to turn left. The blue car comes towards you and goes straight on. Who goes first?'],
    situation: {
      spec: { kind: 'crossroads', vehicles: [me('left'), { arm: 'n', kind: 'car', color: 'blue', turn: 'straight' }] },
      alt: ['Sie biegen links ab, blauer Gegenverkehr fährt geradeaus.', 'You turn left, the oncoming blue car goes straight on.'],
    },
    options: [
      ['Der blaue Pkw', 'The blue car', true],
      ['Ich, weil ich schon geblinkt habe', 'Me, because I indicated first', false],
    ],
    why: ['Wer links abbiegt, muss den Gegenverkehr durchfahren lassen – auch auf einer Vorfahrtstraße.', 'When turning left you must let oncoming traffic through – even on a priority road.'],
  }),
  t.mc({
    id: 'vfr-05',
    points: 5,
    q: ['Sie wollen links abbiegen, der blaue Gegenverkehr will rechts abbiegen. Wer fährt zuerst?', 'You want to turn left; the oncoming blue car wants to turn right. Who goes first?'],
    situation: {
      spec: { kind: 'crossroads', vehicles: [me('left'), { arm: 'n', kind: 'car', color: 'blue', turn: 'right' }] },
      alt: ['Sie links, blauer Gegenverkehr rechts abbiegend.', 'You turning left, oncoming blue car turning right.'],
    },
    options: [
      ['Der blaue Pkw', 'The blue car', true],
      ['Ich', 'Me', false],
    ],
    why: ['Linksabbieger lassen entgegenkommende Rechtsabbieger durchfahren. Sie wollen in dieselbe Straße.', 'Left turners let oncoming right turners go first. You both want the same street.'],
  }),
  t.mc({
    id: 'vfr-06',
    points: 4,
    q: ['Sie und der rote Gegenverkehr wollen beide links abbiegen. Wie fahren Sie?', 'You and the oncoming red car both want to turn left. How do you drive?'],
    situation: {
      spec: { kind: 'crossroads', vehicles: [me('left'), { arm: 'n', kind: 'car', color: 'red', turn: 'left' }] },
      alt: ['Sie und roter Gegenverkehr biegen beide links ab.', 'You and the oncoming red car both turn left.'],
    },
    options: [
      ['Wir biegen gleichzeitig voreinander ab', 'We both turn at the same time, in front of each other', true],
      ['Wer zuerst blinkt, fährt zuerst', 'Whoever indicates first goes first', false],
      ['Wir müssen erst aneinander vorbeifahren', 'We must always pass each other first', false],
    ],
    why: ['Gegenüberliegende Linksabbieger biegen normalerweise voreinander ab – außer Markierungen oder die Kreuzung verlangen etwas anderes.', 'Opposite left turners normally turn in front of each other – unless markings or the junction layout require otherwise.'],
  }),
  t.mc({
    id: 'vfr-07',
    points: 5,
    q: ['Für Sie gilt „Vorfahrtstraße“. Der blaue Pkw kommt von rechts und hat „Vorfahrt gewähren“. Wer fährt zuerst?', 'You are on the priority road. The blue car comes from the right and has a "give way" sign. Who goes first?'],
    situation: {
      spec: { kind: 'crossroads', signs: { s: 'priority', n: 'priority', e: 'give-way', w: 'give-way' }, vehicles: [me('straight'), { arm: 'e', kind: 'car', color: 'blue', turn: 'straight' }] },
      alt: ['Sie auf der Vorfahrtstraße, blauer Pkw von rechts mit „Vorfahrt gewähren“.', 'You on the priority road, blue car from the right with "give way".'],
    },
    options: [
      ['Ich', 'Me', true],
      ['Der blaue Pkw, weil er von rechts kommt', 'The blue car, because it comes from the right', false],
    ],
    why: ['Verkehrszeichen gehen „rechts vor links“ vor. Wer „Vorfahrt gewähren“ hat, muss warten.', 'Signs override "right before left". Whoever has "give way" must wait.'],
  }),
  t.mc({
    id: 'vfr-08',
    points: 5,
    q: ['Für Sie gilt „Vorfahrt gewähren“. Der rote Pkw kommt von links auf der Vorfahrtstraße. Wer fährt zuerst?', 'You have a "give way" sign. The red car comes from the left on the priority road. Who goes first?'],
    situation: {
      spec: { kind: 'crossroads', signs: { s: 'give-way', n: 'give-way', e: 'priority', w: 'priority' }, vehicles: [me('straight'), { arm: 'w', kind: 'car', color: 'red', turn: 'straight' }] },
      alt: ['Sie mit „Vorfahrt gewähren“, roter Pkw von links auf der Vorfahrtstraße.', 'You with "give way", red car from the left on the priority road.'],
    },
    options: [
      ['Der rote Pkw', 'The red car', true],
      ['Ich, weil der rote Pkw von links kommt', 'Me, because the red car comes from the left', false],
    ],
    why: ['Mit „Vorfahrt gewähren“ warten Sie auf den Verkehr der Vorfahrtstraße – von links und von rechts.', 'With "give way" you wait for traffic on the priority road – from the left and the right.'],
  }),
  t.mc({
    id: 'vfr-09',
    points: 5,
    q: ['An Ihrer Einmündung steht „Halt. Vorfahrt gewähren.“ (Stoppschild). Was müssen Sie tun?', 'There is a stop sign at your junction. What must you do?'],
    situation: {
      spec: { kind: 'crossroads', signs: { s: 'stop', n: 'stop', e: 'priority', w: 'priority' }, vehicles: [me('straight')] },
      alt: ['Stoppschild an Ihrer Zufahrt, die Querstraße ist frei.', 'Stop sign at your approach, the crossing road is clear.'],
    },
    options: [
      ['An der Haltlinie vollständig anhalten, auch wenn die Straße frei ist', 'Stop completely at the stop line, even if the road is clear', true],
      ['Den Verkehr auf der Querstraße durchlassen', 'Let traffic on the crossing road go first', true],
      ['Langsam rollend weiterfahren, wenn niemand kommt', 'Roll through slowly if nobody is coming', false],
    ],
    why: ['Am Stoppschild ist immer ein vollständiger Halt Pflicht. Danach gilt dasselbe wie bei „Vorfahrt gewähren“.', 'A full stop is always required at a stop sign. After that, the same applies as with "give way".'],
  }),
  t.mc({
    id: 'vfr-10',
    points: 5,
    q: ['Sie fahren auf der Vorfahrtstraße geradeaus. Der blaue Gegenverkehr will links abbiegen. Wer fährt zuerst?', 'You go straight on along the priority road. The oncoming blue car wants to turn left. Who goes first?'],
    situation: {
      spec: { kind: 'crossroads', signs: { s: 'priority', n: 'priority', e: 'give-way', w: 'give-way' }, vehicles: [me('straight'), { arm: 'n', kind: 'car', color: 'blue', turn: 'left' }] },
      alt: ['Sie geradeaus, blauer Gegenverkehr will links abbiegen.', 'You straight on, oncoming blue car turning left.'],
    },
    options: [
      ['Ich', 'Me', true],
      ['Der blaue Pkw', 'The blue car', false],
    ],
    why: ['Der Linksabbieger muss den Gegenverkehr durchlassen.', 'The left turner must let oncoming traffic through.'],
  }),
  t.mc({
    id: 'vfr-11',
    points: 5,
    q: ['Einmündung ohne Schilder. Sie kommen von unten und wollen rechts abbiegen. Der rote Pkw kommt auf der durchgehenden Straße von links. Wer fährt zuerst?', 'T-junction without signs. You come from below and want to turn right. The red car comes along the through road from the left. Who goes first?'],
    situation: {
      spec: { kind: 't-junction', vehicles: [me('right'), { arm: 'w', kind: 'car', color: 'red', turn: 'straight' }] },
      alt: ['Einmündung ohne Schilder; roter Pkw von links auf der Querstraße.', 'Unsigned T-junction; red car from the left on the through road.'],
    },
    options: [
      ['Ich', 'Me', true],
      ['Der rote Pkw, weil er auf der durchgehenden Straße fährt', 'The red car, because it is on the through road', false],
    ],
    why: ['Auch an Einmündungen ohne Schilder gilt „rechts vor links“. Für den roten Pkw kommen Sie von rechts.', '"Right before left" also applies at unsigned T-junctions. For the red car you come from its right.'],
  }),
  t.mc({
    id: 'vfr-12',
    points: 5,
    q: ['Sie biegen rechts ab. Ein Fußgänger überquert die Straße, in die Sie einbiegen. Wie verhalten Sie sich?', 'You turn right. A pedestrian is crossing the street you are turning into. What do you do?'],
    situation: {
      spec: { kind: 'crossroads', vehicles: [me('right')], pedestrians: ['e'] },
      alt: ['Sie biegen rechts ab, ein Fußgänger quert die Straße rechts.', 'You turn right, a pedestrian crosses the street on the right.'],
    },
    options: [
      ['Ich lasse den Fußgänger zuerst gehen', 'I let the pedestrian cross first', true],
      ['Ich fahre zuerst, Fußgänger müssen warten', 'I go first; pedestrians must wait', false],
    ],
    why: ['Beim Abbiegen müssen Sie auf Fußgänger, die die Straße überqueren, besondere Rücksicht nehmen und sie durchlassen.', 'When turning you must take special care of pedestrians crossing and let them go.'],
  }),
  t.mc({
    id: 'vfr-13',
    points: 5,
    q: ['Sie wollen rechts abbiegen. Rechts neben Ihnen fährt ein Radfahrer geradeaus. Was gilt?', 'You want to turn right. A cyclist next to you on the right is going straight on. What applies?'],
    situation: {
      spec: { kind: 'crossroads', vehicles: [me('right'), { arm: 's', kind: 'bike', color: 'green', turn: 'straight' }] },
      alt: ['Grüner Radfahrer rechts neben Ihnen, fährt geradeaus.', 'Green cyclist on your right, going straight on.'],
    },
    options: [
      ['Der Radfahrer darf zuerst geradeaus fahren', 'The cyclist may go straight on first', true],
      ['Ich muss vor dem Abbiegen in Spiegel und toten Winkel schauen', 'Before turning I must check my mirror and blind spot', true],
      ['Ich darf zuerst abbiegen, weil ich größer bin', 'I may turn first because I am bigger', false],
    ],
    why: ['Radfahrer, die neben Ihnen geradeaus fahren, haben Vorrang. Schulterblick nicht vergessen – Abbiegeunfälle mit Radfahrern sind besonders schwer.', 'Cyclists going straight on beside you have priority. Check the blind spot – turning crashes with cyclists are severe.'],
  }),
  t.mc({
    id: 'vfr-14',
    points: 5,
    q: ['Ein Polizist regelt den Verkehr, gleichzeitig zeigt die Ampel Grün. Wonach richten Sie sich?', 'A police officer is directing traffic while the light shows green. Which do you follow?'],
    options: [
      ['Nach den Zeichen des Polizisten', 'The police officer’s signals', true],
      ['Nach der Ampel', 'The traffic light', false],
      ['Nach den Verkehrsschildern', 'The traffic signs', false],
    ],
    why: ['Reihenfolge: Polizei vor Ampel vor Verkehrszeichen vor allgemeinen Regeln.', 'Order: police first, then lights, then signs, then general rules.'],
  }),
  t.mc({
    id: 'vfr-15',
    points: 4,
    q: ['Sie fahren in einen Kreisverkehr (Zeichen „Kreisverkehr“ mit „Vorfahrt gewähren“). Was ist richtig?', 'You enter a roundabout (roundabout sign with "give way"). What is right?'],
    options: [
      ['Fahrzeuge im Kreisverkehr haben Vorfahrt', 'Vehicles in the roundabout have priority', true],
      ['Beim Ausfahren muss ich blinken', 'I must indicate when leaving', true],
      ['Beim Einfahren muss ich links blinken', 'I must indicate left when entering', false],
    ],
    why: ['Beim Einfahren wird nicht geblinkt, beim Ausfahren rechts. Wer im Kreis fährt, hat Vorfahrt.', 'No indicating when entering; indicate right when leaving. Traffic already in the roundabout has priority.'],
  }),
  t.mc({
    id: 'vfr-16',
    points: 5,
    q: ['Ein Einsatzfahrzeug kommt mit Blaulicht und Martinshorn. Was müssen Sie tun?', 'An emergency vehicle approaches with blue lights and siren. What must you do?'],
    options: [
      ['Sofort freie Bahn schaffen', 'Clear the way immediately', true],
      ['Nur Platz machen, wenn ich gerade Vorfahrt hätte', 'Only make room if I currently have priority', false],
      ['Weiterfahren, bis die Ampel grün wird', 'Keep going until my light turns green', false],
    ],
    why: ['Blaulicht zusammen mit Einsatzhorn heißt: allen anderen Verkehr sofort freie Bahn machen.', 'Blue lights together with a siren mean: everyone must clear the way at once.'],
  }),
  t.mc({
    id: 'vfr-17',
    points: 5,
    q: ['Sie kommen aus einer Grundstücksausfahrt auf die Straße. Wen müssen Sie durchlassen?', 'You are pulling out of a driveway onto the road. Whom must you let pass?'],
    options: [
      ['Den gesamten Fahrzeugverkehr auf der Straße', 'All vehicle traffic on the road', true],
      ['Fußgänger auf dem Gehweg', 'Pedestrians on the pavement', true],
      ['Nur Fahrzeuge von rechts', 'Only vehicles from the right', false],
    ],
    why: ['Wer aus einem Grundstück, Feldweg oder vom Fahrbahnrand anfährt, muss andere durchlassen und darf niemanden gefährden.', 'Pulling out of a driveway, dirt track or from the kerb, you must let others pass and endanger nobody.'],
  }),

  t.mc({
    id: 'vfr-18',
    points: 5,
    q: ['Einmündung ohne Schilder. Sie wollen links abbiegen, der blaue Pkw kommt von rechts und fährt geradeaus. Wer fährt zuerst?', 'T-junction without signs. You want to turn left; the blue car comes from the right and goes straight on. Who goes first?'],
    situation: {
      spec: { kind: 't-junction', vehicles: [me('left'), { arm: 'e', kind: 'car', color: 'blue', turn: 'straight' }] },
      alt: ['Einmündung ohne Schilder; Sie von unten, links abbiegen; blauer Pkw von rechts geradeaus.', 'Unsigned T-junction; you from below turning left; blue car from the right going straight.'],
    },
    options: [
      ['Der blaue Pkw', 'The blue car', true],
      ['Ich', 'Me', false],
    ],
    why: ['Auch an Einmündungen gilt ohne Schilder „rechts vor links“. Der blaue Pkw kommt von rechts.', '"Right before left" also applies at unsigned T-junctions. The blue car comes from your right.'],
  }),
  t.mc({
    id: 'vfr-19',
    points: 5,
    q: ['Einmündung ohne Schilder. Sie wollen rechts abbiegen, der rote Pkw kommt von links und fährt geradeaus. Wer fährt zuerst?', 'T-junction without signs. You want to turn right; the red car comes from the left and goes straight on. Who goes first?'],
    situation: {
      spec: { kind: 't-junction', vehicles: [me('right'), { arm: 'w', kind: 'car', color: 'red', turn: 'straight' }] },
      alt: ['Einmündung ohne Schilder; Sie biegen rechts ab; roter Pkw von links geradeaus.', 'Unsigned T-junction; you turn right; red car from the left going straight.'],
    },
    options: [
      ['Ich', 'Me', true],
      ['Der rote Pkw', 'The red car', false],
    ],
    why: ['Für den roten Pkw kommen Sie von rechts. Deshalb muss er warten.', 'For the red car you come from its right, so it has to wait.'],
  }),
  t.mc({
    id: 'vfr-20',
    points: 5,
    q: ['Für Sie gilt „Vorfahrt gewähren“. Der blaue Pkw von rechts und der rote von links fahren auf der Vorfahrtstraße geradeaus. Wer fährt zuerst?', 'You have a give-way sign. The blue car from the right and the red car from the left are on the priority road going straight on. Who goes first?'],
    situation: {
      spec: {
        kind: 'crossroads',
        signs: { s: 'give-way', n: 'give-way', e: 'priority', w: 'priority' },
        vehicles: [me('straight'), { arm: 'e', kind: 'car', color: 'blue', turn: 'straight' }, { arm: 'w', kind: 'car', color: 'red', turn: 'straight' }],
      },
      alt: ['Kreuzung: Sie mit „Vorfahrt gewähren“, Blau und Rot auf der Vorfahrtstraße.', 'Crossroads: you with a give-way sign, blue and red on the priority road.'],
    },
    options: [
      ['Blau und Rot, danach ich', 'Blue and red, then me', true],
      ['Ich zuerst, weil ich geradeaus fahre', 'Me first, because I go straight on', false],
      ['Blau, dann ich, dann Rot', 'Blue, then me, then red', false],
    ],
    why: ['Auf der Vorfahrtstraße haben beide Vorfahrt. Sie warten, bis die Straße in beide Richtungen frei ist.', 'Both have priority on the priority road. You wait until the road is clear in both directions.'],
  }),
  t.mc({
    id: 'vfr-21',
    points: 5,
    q: ['Sie sind auf der Vorfahrtstraße und wollen links abbiegen. Der rote Gegenverkehr fährt geradeaus, der blaue Pkw von rechts hat „Vorfahrt gewähren“. In welcher Reihenfolge wird gefahren?', 'You are on the priority road and want to turn left. Red oncoming traffic goes straight on; the blue car from the right has a give-way sign. In which order do you go?'],
    situation: {
      spec: {
        kind: 'crossroads',
        signs: { s: 'priority', n: 'priority', e: 'give-way', w: 'give-way' },
        vehicles: [me('left'), { arm: 'n', kind: 'car', color: 'red', turn: 'straight' }, { arm: 'e', kind: 'car', color: 'blue', turn: 'straight' }],
      },
      alt: ['Sie und Rot auf der Vorfahrtstraße, Blau von rechts mit „Vorfahrt gewähren“.', 'You and red on the priority road, blue from the right with a give-way sign.'],
    },
    options: [
      ['Rot, dann ich, dann Blau', 'Red, then me, then blue', true],
      ['Ich, dann Rot, dann Blau', 'Me, then red, then blue', false],
      ['Blau, dann Rot, dann ich', 'Blue, then red, then me', false],
    ],
    why: ['Blau muss allen auf der Vorfahrtstraße Vorfahrt lassen. Unter Ihnen beiden gilt: Wer links abbiegt, lässt den Gegenverkehr zuerst fahren.', 'Blue must give way to everyone on the priority road. Between you and red: whoever turns left lets oncoming traffic go first.'],
  }),
  t.mc({
    id: 'vfr-22',
    points: 5,
    q: ['Kreuzung ohne Schilder. Sie fahren geradeaus. Der blaue Pkw von rechts will links abbiegen, der rote Gegenverkehr fährt geradeaus. In welcher Reihenfolge wird gefahren?', 'Unsigned crossroads. You go straight on. The blue car from the right wants to turn left; red oncoming traffic goes straight on. In which order do you go?'],
    situation: {
      spec: {
        kind: 'crossroads',
        vehicles: [me('straight'), { arm: 'e', kind: 'car', color: 'blue', turn: 'left' }, { arm: 'n', kind: 'car', color: 'red', turn: 'straight' }],
      },
      alt: ['Kreuzung ohne Schilder; Blau von rechts biegt links ab, Rot kommt entgegen.', 'Unsigned crossroads; blue from the right turns left, red comes towards you.'],
    },
    options: [
      ['Rot, dann Blau, dann ich', 'Red, then blue, then me', true],
      ['Ich, dann Rot, dann Blau', 'Me, then red, then blue', false],
      ['Blau, dann ich, dann Rot', 'Blue, then me, then red', false],
    ],
    why: ['Rot hat niemanden rechts von sich und fährt zuerst. Blau muss Rot durchlassen, weil Rot für Blau von rechts kommt. Sie müssen Blau durchlassen, weil Blau von rechts kommt.', 'Red has nobody on its right and goes first. Blue must let red through, because red comes from blue’s right. You must let blue through, because blue comes from your right.'],
  }),
  t.mc({
    id: 'vfr-23',
    points: 5,
    q: ['Die Ampel zeigt für Sie und den blauen Gegenverkehr Grün. Sie wollen links abbiegen, Blau fährt geradeaus. Wer fährt zuerst?', 'The lights are green for you and for the blue oncoming car. You want to turn left; blue goes straight on. Who goes first?'],
    situation: {
      spec: { kind: 'crossroads', vehicles: [me('left'), { arm: 'n', kind: 'car', color: 'blue', turn: 'straight' }] },
      alt: ['Ampelkreuzung; Sie biegen links ab, Blau kommt entgegen und fährt geradeaus.', 'Junction with lights; you turn left, blue comes towards you going straight.'],
    },
    options: [
      ['Der blaue Pkw', 'The blue car', true],
      ['Ich, weil ich Grün habe', 'Me, because my light is green', false],
    ],
    why: ['Grün heißt nicht freie Fahrt für Linksabbieger: Sie müssen den entgegenkommenden Verkehr durchlassen, außer ein grüner Pfeil zeigt, dass er Rot hat.', 'Green does not clear a left turn: you must let oncoming traffic through, unless a green arrow shows that it has red.'],
  }),
  t.mc({
    id: 'vfr-24',
    points: 4,
    q: ['Die Vorfahrtstraße knickt nach links ab (Zusatzzeichen unter dem Schild). Sie folgen ihr nach links. Was gilt?', 'The priority road bends to the left (plate under the sign). You follow it to the left. What applies?'],
    options: [
      ['Ich muss links blinken', 'I must indicate left', true],
      ['Ich behalte meine Vorfahrt gegenüber den untergeordneten Straßen', 'I keep my priority over the minor roads', true],
      ['Ich muss nicht blinken, weil ich auf der Vorfahrtstraße bleibe', 'I need not indicate because I stay on the priority road', false],
    ],
    why: ['Wer der abknickenden Vorfahrt folgt, ändert die Richtung und muss blinken – behält aber die Vorfahrt.', 'Following a bending priority road changes your direction, so you indicate – but you keep priority.'],
  }),
  t.mc({
    id: 'vfr-25',
    points: 4,
    q: ['An einer Kreuzung ist die Ampel ausgefallen (dunkel oder gelbes Blinken). Wonach richten Sie sich?', 'At a junction the traffic lights are out (dark or flashing yellow). What do you follow?'],
    options: [
      ['Nach den Verkehrszeichen an der Kreuzung', 'The traffic signs at the junction', true],
      ['Gibt es keine Schilder, gilt „rechts vor links“', 'If there are no signs, "right before left" applies', true],
      ['Wer zuerst an der Kreuzung ist, fährt zuerst', 'Whoever gets to the junction first goes first', false],
    ],
    why: ['Ohne Ampel gelten die Vorfahrtsschilder darunter. Fehlen sie, gilt die Grundregel „rechts vor links“.', 'Without working lights, the priority signs below them apply. If there are none, the basic rule "right before left" applies.'],
  }),
];
