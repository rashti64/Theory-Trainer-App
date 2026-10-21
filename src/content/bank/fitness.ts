import { topic } from './build';

const t = topic('fitness', 'basic');

export const FITNESS = [
  t.mc({
    id: 'fit-01',
    points: 5,
    q: ['Sie sind in der Probezeit oder unter 21 Jahre alt. Welche Alkoholgrenze gilt beim Fahren?', 'You are on probation or under 21. Which alcohol limit applies when driving?'],
    options: [
      ['0,0 Promille – absolutes Alkoholverbot', '0.0 per mille – no alcohol at all', true],
      ['0,3 Promille', '0.3 per mille', false],
      ['0,5 Promille', '0.5 per mille', false],
    ],
    why: ['Fahranfänger und alle unter 21 dürfen keinen Alkohol trinken, bevor sie fahren.', 'Novice drivers and everyone under 21 must not drink at all before driving.'],
  }),
  t.mc({
    id: 'fit-02',
    points: 5,
    q: ['Ab welchem Blutalkoholwert begehen Fahrer (außerhalb der Probezeit, ab 21) auch ohne Ausfallerscheinungen eine Ordnungswidrigkeit?', 'From which blood alcohol level do drivers (past probation, 21+) commit an offence even without signs of impairment?'],
    options: [
      ['Ab 0,5 Promille', 'From 0.5 per mille', true],
      ['Ab 0,8 Promille', 'From 0.8 per mille', false],
      ['Ab 1,1 Promille', 'From 1.1 per mille', false],
    ],
    why: ['Ab 0,5 ‰ drohen Bußgeld, Punkte und Fahrverbot. Schon ab 0,3 ‰ mit Ausfallerscheinungen oder einem Unfall ist es eine Straftat.', 'From 0.5 ‰ you face a fine, points and a ban. From 0.3 ‰ with signs of impairment or a crash it is a criminal offence.'],
  }),
  t.mc({
    id: 'fit-03',
    points: 5,
    q: ['Ab welchem Wert gilt man als absolut fahruntüchtig (Straftat, auch ohne Fahrfehler)?', 'From which level are you considered absolutely unfit to drive (a crime even without driving errors)?'],
    options: [
      ['Ab 1,1 Promille', 'From 1.1 per mille', true],
      ['Ab 0,5 Promille', 'From 0.5 per mille', false],
      ['Ab 1,6 Promille', 'From 1.6 per mille', false],
    ],
    why: ['Ab 1,1 ‰ ist Fahren immer eine Straftat. Ab 1,6 ‰ wird zusätzlich eine MPU angeordnet.', 'From 1.1 ‰ driving is always a crime. From 1.6 ‰ a medical-psychological assessment (MPU) is also ordered.'],
  }),
  t.mc({
    id: 'fit-04',
    points: 4,
    q: ['Wie wirkt Alkohol auf das Fahren?', 'How does alcohol affect driving?'],
    options: [
      ['Die Reaktionszeit wird länger', 'Reaction time gets longer', true],
      ['Man überschätzt sich und wird risikobereiter', 'You overrate yourself and take more risks', true],
      ['Man sieht nachts besser', 'Your night vision improves', false],
    ],
    why: ['Alkohol verengt außerdem das Blickfeld („Tunnelblick“) und verschlechtert das Sehen bei Dunkelheit.', 'Alcohol also narrows your field of view ("tunnel vision") and worsens night vision.'],
  }),
  t.mc({
    id: 'fit-05',
    points: 4,
    q: ['Wie können Sie den Alkoholabbau beschleunigen?', 'How can you speed up how fast your body breaks down alcohol?'],
    options: [
      ['Gar nicht – nur Zeit hilft', 'You can’t – only time helps', true],
      ['Mit starkem Kaffee', 'With strong coffee', false],
      ['Mit frischer Luft und Sport', 'With fresh air and exercise', false],
    ],
    why: ['Der Körper baut nur etwa 0,1 Promille pro Stunde ab. Kaffee macht wacher, aber nicht nüchterner.', 'The body breaks down only about 0.1 per mille per hour. Coffee makes you more alert, not more sober.'],
  }),
  t.mc({
    id: 'fit-06',
    points: 5,
    q: ['Welcher THC-Grenzwert gilt für erfahrene Fahrer (außerhalb der Probezeit, ab 21)?', 'What THC limit applies to experienced drivers (past probation, 21+)?'],
    options: [
      ['3,5 Nanogramm THC pro Milliliter Blut', '3.5 nanograms of THC per millilitre of blood', true],
      ['Es gibt keinen Grenzwert, Cannabis ist legal', 'There is no limit; cannabis is legal', false],
    ],
    why: ['Seit August 2024 gilt 3,5 ng/ml. Fahranfänger in der Probezeit und unter 21 dürfen nicht unter Cannabiseinfluss fahren; Mischkonsum mit Alkohol wird besonders hart bestraft.', 'Since August 2024 the limit is 3.5 ng/ml. Novice drivers on probation and under-21s must not drive under the influence of cannabis; mixing with alcohol is punished especially hard.'],
  }),
  t.mc({
    id: 'fit-07',
    points: 4,
    q: ['Sie nehmen ein neues Medikament. Was sollten Sie vor der Fahrt tun?', 'You are taking a new medicine. What should you do before driving?'],
    options: [
      ['Den Beipackzettel lesen und im Zweifel Arzt oder Apotheke fragen', 'Read the leaflet and ask a doctor or pharmacist if in doubt', true],
      ['Bedenken, dass die Wirkung zusammen mit Alkohol stärker sein kann', 'Remember the effect can be stronger combined with alcohol', true],
      ['Nichts – rezeptpflichtige Medikamente sind immer unbedenklich', 'Nothing – prescription medicines are always safe', false],
    ],
    why: ['Viele Medikamente machen müde oder verlangsamen die Reaktion.', 'Many medicines make you tired or slow your reactions.'],
  }),
  t.mc({
    id: 'fit-08',
    points: 4,
    q: ['Was gilt für die Benutzung des Handys während der Fahrt?', 'What applies to using a phone while driving?'],
    options: [
      ['Ich darf es nicht in die Hand nehmen oder halten', 'I must not pick it up or hold it', true],
      ['Sprachsteuerung und Freisprechen sind erlaubt, wenn ich nur kurz hinsehe', 'Voice control and hands-free are allowed with only brief glances', true],
      ['An der roten Ampel darf ich es bei laufendem Motor bedienen', 'At a red light I may use it with the engine running', false],
    ],
    why: ['In der Hand halten ist nur bei vollständig ausgeschaltetem Motor erlaubt – eine Start-Stopp-Automatik zählt nicht.', 'Holding it is only allowed with the engine fully off – automatic start-stop does not count.'],
  }),
  t.mc({
    id: 'fit-09',
    points: 4,
    q: ['Woran erkennen Sie Übermüdung am Steuer?', 'How do you recognise dangerous tiredness at the wheel?'],
    options: [
      ['Häufiges Gähnen und schwere Augenlider', 'Frequent yawning and heavy eyelids', true],
      ['Ich kann mich an die letzten Kilometer nicht erinnern', 'I can’t remember the last few kilometres', true],
      ['Ich fahre besonders konzentriert', 'I am driving especially attentively', false],
    ],
    why: ['Bei Müdigkeit hilft nur eine Pause, am besten mit einem kurzen Schlaf. Sekundenschlaf kann tödlich sein.', 'When tired, only a break helps – ideally a short nap. Microsleep can be fatal.'],
  }),
  t.mc({
    id: 'fit-10',
    points: 3,
    q: ['Wie oft sollten Sie auf langen Fahrten eine Pause machen?', 'How often should you take a break on long journeys?'],
    options: [
      ['Etwa alle zwei Stunden', 'About every two hours', true],
      ['Erst nach sechs Stunden', 'Only after six hours', false],
    ],
    why: ['Regelmäßige Pausen mit Bewegung und frischer Luft beugen Ermüdung vor.', 'Regular breaks with movement and fresh air prevent fatigue.'],
  }),
  t.mc({
    id: 'fit-11',
    points: 4,
    q: ['Sie sind sehr wütend oder aufgeregt. Was bedeutet das für Ihr Fahren?', 'You are very angry or upset. What does that mean for your driving?'],
    options: [
      ['Ich neige zu riskantem Fahren und sollte mich zuerst beruhigen', 'I tend to drive riskily and should calm down first', true],
      ['Gefühle haben keinen Einfluss auf das Fahren', 'Emotions don’t affect driving', false],
    ],
    why: ['Starke Gefühle lenken ab und verleiten zu Aggression und Risiko.', 'Strong emotions distract you and push you towards aggression and risk.'],
  }),
  t.mc({
    id: 'fit-12',
    points: 3,
    q: ['Was müssen Sie tun, wenn Ihre Brille oder Kontaktlinsen im Führerschein eingetragen sind?', 'What must you do if glasses or contact lenses are noted on your licence?'],
    options: [
      ['Beim Fahren immer die Sehhilfe tragen', 'Always wear them when driving', true],
      ['Nur nachts eine Sehhilfe tragen', 'Wear them only at night', false],
    ],
    why: ['Die Auflage gilt bei jeder Fahrt. Ohne Sehhilfe zu fahren ist eine Ordnungswidrigkeit.', 'The condition applies to every drive. Driving without them is an offence.'],
  }),

  t.num({
    id: 'fit-13',
    points: 4,
    q: ['Ab welchem Blutalkoholwert (in Promille) machen Sie sich strafbar, wenn Sie Ausfallerscheinungen zeigen oder einen Unfall verursachen?', 'From which blood alcohol level (per mille) is it a criminal offence if you show impairment or cause a crash?'],
    value: 0.3,
    unit: ['‰', '‰'],
    why: ['Schon ab 0,3 ‰ ist es eine Straftat, wenn Sie alkoholbedingt Fehler machen. Ohne Fehler gilt ab 0,5 ‰ eine Ordnungswidrigkeit, ab 1,1 ‰ immer eine Straftat.', 'From 0.3 ‰ it is a crime if alcohol makes you drive badly. Without errors, 0.5 ‰ is an administrative offence, and from 1.1 ‰ it is always a crime.'],
  }),
  t.mc({
    id: 'fit-14',
    points: 4,
    q: ['Sie haben am Abend viel Alkohol getrunken. Was gilt am nächsten Morgen?', 'You drank a lot of alcohol in the evening. What applies the next morning?'],
    options: [
      ['Ich kann noch Restalkohol im Blut haben und fahruntüchtig sein', 'I may still have alcohol in my blood and be unfit to drive', true],
      ['Nach dem Schlafen ist der Alkohol immer abgebaut', 'After sleeping, the alcohol is always gone', false],
      ['Ein starker Kaffee macht mich wieder fahrtüchtig', 'A strong coffee makes me fit to drive again', false],
    ],
    why: ['Der Körper baut nur etwa 0,1 ‰ pro Stunde ab. Nichts beschleunigt das.', 'The body breaks down only about 0.1 ‰ per hour. Nothing speeds it up.'],
  }),
  t.mc({
    id: 'fit-15',
    points: 3,
    q: ['Dürfen Sie das Navigationsgerät während der Fahrt bedienen?', 'May you operate the navigation system while driving?'],
    options: [
      ['Nur ohne es in die Hand zu nehmen und mit kurzem Blick', 'Only without holding it and with just a brief glance', true],
      ['Ja, ich darf es in die Hand nehmen, um das Ziel einzugeben', 'Yes, I may hold it to enter a destination', false],
    ],
    why: ['Elektronische Geräte dürfen Sie nur mit kurzer Blickzuwendung bedienen und nicht halten. Ziele geben Sie besser vor der Fahrt ein.', 'You may only operate electronic devices with a brief glance and without holding them. Enter destinations before you set off.'],
  }),
  t.mc({
    id: 'fit-16',
    points: 3,
    q: ['Was hilft wirklich gegen Müdigkeit am Steuer?', 'What really helps against tiredness at the wheel?'],
    options: [
      ['Anhalten und eine Pause machen, am besten kurz schlafen', 'Stopping for a break, ideally a short nap', true],
      ['Fenster öffnen und laut Musik hören', 'Opening the window and playing loud music', false],
      ['Schneller fahren, um früher anzukommen', 'Driving faster to arrive sooner', false],
    ],
    why: ['Frische Luft und Musik helfen nur Minuten. Gegen Sekundenschlaf hilft nur eine echte Pause.', 'Fresh air and music only help for minutes. Only a real break prevents microsleep.'],
  }),
];
