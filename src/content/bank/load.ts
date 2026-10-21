import { M, topic } from './build';

const t = topic('load', 'class');

export const LOAD = [
  t.mc({
    id: 'lad-01',
    points: 4,
    q: ['Wie muss Ladung gesichert sein?', 'How must a load be secured?'],
    options: [
      ['So, dass sie auch bei einer Vollbremsung oder plötzlichem Ausweichen nicht verrutscht oder herabfällt', 'So that it cannot slide or fall even in an emergency stop or swerve', true],
      ['Es reicht, wenn sie bei normaler Fahrt liegen bleibt', 'It is enough if it stays put in normal driving', false],
    ],
    why: ['Ungesicherte Ladung wird bei einem Unfall zum Geschoss.', 'An unsecured load becomes a projectile in a crash.'],
  }),
  t.num({
    id: 'lad-02',
    points: 3,
    q: ['Wie weit darf Ladung bei einem Pkw nach hinten höchstens hinausragen (normale Fahrten über 100 km)?', 'How far may a load stick out at the back of a car at most (normal trips over 100 km)?'],
    value: 1.5,
    unit: M,
    why: ['Nach hinten bis 1,5 m; auf Fahrten bis 100 km Entfernung bis 3 m.', 'Up to 1.5 m at the back; up to 3 m on trips of up to 100 km.'],
  }),
  t.mc({
    id: 'lad-03',
    points: 3,
    q: ['Ihre Ladung ragt mehr als 1 m über die Rückleuchten hinaus. Was müssen Sie tun?', 'Your load sticks out more than 1 m beyond the rear lights. What must you do?'],
    options: [
      ['Das Ende kenntlich machen, z. B. mit einer hellroten Fahne oder einem Schild (mindestens 30 × 30 cm)', 'Mark the end, e.g. with a bright red flag or sign (at least 30 × 30 cm)', true],
      ['Nichts, solange ich langsam fahre', 'Nothing, as long as I drive slowly', false],
    ],
    why: ['Bei Dunkelheit braucht das Ladungsende zusätzlich eine rote Leuchte.', 'In the dark the end of the load also needs a red light.'],
  }),
  t.mc({
    id: 'lad-04',
    points: 4,
    q: ['Welche Kinder müssen im Auto in einem Kindersitz gesichert werden?', 'Which children must travel in a child seat?'],
    options: [
      ['Kinder unter 12 Jahren, die kleiner als 150 cm sind', 'Children under 12 who are shorter than 150 cm', true],
      ['Nur Kinder unter 3 Jahren', 'Only children under 3', false],
    ],
    why: ['Der Sitz muss zu Größe und Gewicht des Kindes passen und zugelassen sein.', 'The seat must suit the child’s height and weight and be approved.'],
  }),
  t.mc({
    id: 'lad-05',
    points: 4,
    q: ['Wie viele Personen dürfen Sie in Ihrem Pkw mitnehmen?', 'How many people may you carry in your car?'],
    options: [
      ['Nicht mehr, als Sitzplätze mit Sicherheitsgurten vorhanden sind', 'No more than there are seats with seat belts', true],
      ['So viele, wie hineinpassen', 'As many as fit', false],
    ],
    why: ['Jede Person braucht einen eigenen Platz mit Gurt.', 'Every person needs their own seat with a belt.'],
  }),
  t.mc({
    id: 'lad-06',
    points: 3,
    q: ['Ihr Auto ist schwer beladen. Was ändert sich?', 'Your car is heavily loaded. What changes?'],
    options: [
      ['Der Bremsweg wird länger', 'The braking distance gets longer', true],
      ['Ich muss eventuell Reifendruck und Leuchtweite anpassen', 'I may need to adjust tyre pressure and headlight range', true],
      ['Das Auto wird in Kurven stabiler', 'The car becomes more stable in bends', false],
    ],
    why: ['Mehr Gewicht verändert Fahrverhalten, Bremsweg und die Ausrichtung der Scheinwerfer.', 'More weight changes handling, braking distance and headlight aim.'],
  }),
  t.mc({
    id: 'lad-07',
    points: 3,
    q: ['Sie transportieren eine Dachbox. Was ist zu beachten?', 'You carry a roof box. What should you note?'],
    options: [
      ['Die zulässige Dachlast darf nicht überschritten werden', 'The permitted roof load must not be exceeded', true],
      ['Das Auto reagiert anders auf Seitenwind und in Kurven', 'The car reacts differently to crosswinds and in bends', true],
      ['Die Dachbox gleicht das Gewicht aus und macht das Auto stabiler', 'The roof box balances the car and makes it more stable', false],
    ],
    why: ['Ein höherer Schwerpunkt macht das Auto kippeliger und windempfindlicher.', 'A higher centre of gravity makes the car less stable and more wind-sensitive.'],
  }),
  t.mc({
    id: 'lad-08',
    points: 3,
    q: ['Welchen Anhänger dürfen Sie mit Führerscheinklasse B ziehen?', 'Which trailer may you tow with a class B licence?'],
    options: [
      ['Einen Anhänger bis 750 kg zulässige Gesamtmasse', 'A trailer up to 750 kg permitted total mass', true],
      ['Einen schwereren Anhänger, wenn die Kombination insgesamt höchstens 3.500 kg wiegt', 'A heavier trailer if the whole combination is at most 3,500 kg', true],
      ['Jeden Anhänger, egal wie schwer', 'Any trailer, however heavy', false],
    ],
    why: ['Für Kombinationen bis 4.250 kg braucht man die Schlüsselzahl B96 (Schulung), darüber Klasse BE.', 'Combinations up to 4,250 kg need code B96 (training); above that, class BE.'],
  }),
  t.mc({
    id: 'lad-09',
    points: 3,
    q: ['Sie nehmen Ihren Hund im Auto mit. Was gilt?', 'You take your dog in the car. What applies?'],
    options: [
      ['Er muss so gesichert sein, dass er bei einer Bremsung nicht durch das Auto fliegt', 'It must be secured so it won’t fly through the car when braking', true],
      ['Er darf frei auf dem Beifahrersitz sitzen', 'It may sit freely on the passenger seat', false],
    ],
    why: ['Tiere gelten als Ladung und müssen gesichert werden, z. B. mit Box, Gurt oder Gitter.', 'Animals count as load and must be secured, e.g. with a crate, harness or guard.'],
  }),
  t.mc({
    id: 'lad-10',
    points: 4,
    q: ['Wer ist für die sichere Beladung und den Zustand des Fahrzeugs verantwortlich?', 'Who is responsible for safe loading and the vehicle’s condition?'],
    options: [
      ['Ich als Fahrer', 'Me, the driver', true],
      ['Nur der Halter des Fahrzeugs', 'Only the vehicle’s keeper', false],
    ],
    why: ['Der Fahrer muss vor der Fahrt prüfen, dass Fahrzeug und Ladung sicher sind – der Halter haftet zusätzlich.', 'The driver must check that vehicle and load are safe before driving – the keeper is liable too.'],
  }),

  t.mc({
    id: 'lad-11',
    points: 3,
    q: ['Was ändert sich, wenn Sie mit einem Anhänger fahren?', 'What changes when you drive with a trailer?'],
    options: [
      ['Der Bremsweg wird länger', 'The braking distance gets longer', true],
      ['Ich brauche in Kurven und beim Abbiegen mehr Platz', 'I need more room on bends and when turning', true],
      ['Ich darf außerorts schneller fahren', 'I may drive faster outside built-up areas', false],
    ],
    why: ['Das Gespann ist schwerer und länger. Überholen dauert länger und der Anhänger fährt in Kurven innen eine engere Linie.', 'The combination is heavier and longer. Overtaking takes longer, and the trailer cuts the corner on bends.'],
  }),
  t.mc({
    id: 'lad-12',
    points: 4,
    q: ['Ihr Anhänger beginnt zu schlingern. Was tun Sie?', 'Your trailer starts to sway. What do you do?'],
    options: [
      ['Vom Gas gehen und das Lenkrad ruhig und gerade halten', 'Lift off the accelerator and hold the steering wheel steady and straight', true],
      ['Kräftig beschleunigen, um das Gespann zu strecken', 'Accelerate hard to straighten the combination', false],
      ['Schnell gegenlenken', 'Steer quickly against the sway', false],
    ],
    why: ['Gegenlenken verstärkt das Schlingern oft. Langsamer werden beruhigt das Gespann; wenn nötig, gefühlvoll bremsen.', 'Steering against it often makes the sway worse. Slowing down calms the combination; brake gently if needed.'],
  }),
  t.mc({
    id: 'lad-13',
    points: 3,
    q: ['Wie verstauen Sie schweres Gepäck im Auto richtig?', 'How do you stow heavy luggage in the car correctly?'],
    options: [
      ['Unten im Kofferraum, direkt an der Rückenlehne der Rückbank', 'Low in the boot, right against the back of the rear seats', true],
      ['Oben auf der Hutablage', 'On the parcel shelf', false],
      ['Lose auf dem Rücksitz', 'Loose on the back seat', false],
    ],
    why: ['Lose Gegenstände werden bei einer Vollbremsung zu Geschossen. Schweres gehört tief und nach vorne.', 'Loose objects become projectiles in an emergency stop. Heavy items go low and forward.'],
  }),
  t.num({
    id: 'lad-14',
    points: 3,
    q: ['Wie weit darf Ladung nach hinten hinausragen, wenn Sie höchstens 100 km weit fahren?', 'How far may a load stick out at the back if you are driving no more than 100 km?'],
    value: 3,
    unit: M,
    why: ['Bis 100 km Fahrstrecke darf Ladung bis zu 3 m nach hinten hinausragen, sonst bis zu 1,5 m. Ab 1 m über die Rückleuchten hinaus muss sie gekennzeichnet sein.', 'For trips up to 100 km the load may stick out up to 3 m, otherwise up to 1.5 m. Beyond 1 m past the rear lights it must be marked.'],
  }),
  t.mc({
    id: 'lad-15',
    points: 3,
    q: ['Ein Fahrradträger an der Anhängerkupplung verdeckt Ihr Kennzeichen und die Rückleuchten. Was müssen Sie tun?', 'A bike rack on the tow bar covers your number plate and rear lights. What must you do?'],
    options: [
      ['Am Träger ein zusätzliches Kennzeichen und Leuchten anbringen', 'Fit an extra number plate and lights to the rack', true],
      ['Nichts, solange es hell ist', 'Nothing, as long as it is daylight', false],
    ],
    why: ['Kennzeichen und Leuchten müssen immer sichtbar sein. Fahrradträger haben dafür eigene Leuchten und eine Halterung für ein Wiederholungskennzeichen.', 'Plates and lights must always be visible. Bike racks have their own lights and a holder for a duplicate plate.'],
  }),
];
