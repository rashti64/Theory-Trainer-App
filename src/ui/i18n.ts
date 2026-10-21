import type { Locale, LocalizedText } from '@/domain/types';

/** Pick the text for the locale, falling back to German (the official language). */
export function tr(text: LocalizedText | undefined, locale: Locale): string {
  if (!text) return '';
  return text[locale] ?? text.de;
}

const strings = {
  learn: { de: 'Lernen', en: 'Learn' },
  exam: { de: 'Prüfung', en: 'Exam' },
  profile: { de: 'Profil', en: 'Profile' },
  start: { de: 'Starten', en: 'Start' },
  check: { de: 'Prüfen', en: 'Check' },
  continue: { de: 'Weiter', en: 'Continue' },
  correct: { de: 'Richtig!', en: 'Correct!' },
  wrong: { de: 'Nicht ganz.', en: 'Not quite.' },
  correctAnswer: { de: 'Richtige Antwort:', en: 'Correct answer:' },
  chooseAll: { de: 'Wähle alle richtigen Antworten.', en: 'Choose every correct answer.' },
  enterNumber: { de: 'Gib eine Zahl ein.', en: 'Enter a number.' },
  points: { de: 'Fehlerpunkte', en: 'error points' },
  pointsShort: { de: 'Pkt.', en: 'pts' },
  lessonDone: { de: 'Lektion geschafft', en: 'Lesson complete' },
  xpEarned: { de: 'XP verdient', en: 'XP earned' },
  accuracy: { de: 'Treffer', en: 'Accuracy' },
  streak: { de: 'Tage in Folge', en: 'day streak' },
  dailyGoal: { de: 'Tagesziel', en: 'Daily goal' },
  mistakes: { de: 'Fehler wiederholen', en: 'Review mistakes' },
  mistakesNone: {
    de: 'Noch keine Fehler. Mach eine Lektion, dann sammeln sich hier deine schwierigen Fragen.',
    en: 'No mistakes yet. Do a lesson and your tricky questions will collect here.',
  },
  examTitle: { de: 'Prüfungs\u00ADsimulation Klasse B', en: 'Class B exam simulation' },
  examRules: {
    de: '30 Fragen, keine Zeitbegrenzung. Bestanden mit höchstens 10 Fehlerpunkten – aber zwei falsche 5-Punkte-Fragen bedeuten durchgefallen.',
    en: '30 questions, no time limit. Pass with at most 10 error points, but two wrong 5-point questions mean a fail.',
  },
  startExam: { de: 'Simulation starten', en: 'Start simulation' },
  finishExam: { de: 'Prüfung abgeben', en: 'Hand in exam' },
  next: { de: 'Nächste', en: 'Next' },
  previous: { de: 'Zurück', en: 'Back' },
  passed: { de: 'Bestanden', en: 'Passed' },
  failed: { de: 'Nicht bestanden', en: 'Not passed' },
  failTooMany: {
    de: 'Mehr als 10 Fehlerpunkte.',
    en: 'More than 10 error points.',
  },
  failFive: {
    de: 'Zwei 5-Punkte-Fragen waren falsch.',
    en: 'Two 5-point questions were wrong.',
  },
  readiness: { de: 'Prüfungsreife', en: 'Exam readiness' },
  lastExams: { de: 'Letzte Simulationen', en: 'Recent simulations' },
  noExams: { de: 'Noch keine Simulation gemacht.', en: 'No simulations yet.' },
  close: { de: 'Schließen', en: 'Close' },
  quitLesson: { de: 'Lektion beenden?', en: 'Quit the lesson?' },
  quitLessonBody: { de: 'Dein Fortschritt in dieser Lektion geht verloren.', en: 'Your progress in this lesson will be lost.' },
  quit: { de: 'Beenden', en: 'Quit' },
  keepGoing: { de: 'Weitermachen', en: 'Keep going' },
  language: { de: 'Sprache', en: 'Language' },
  account: { de: 'Konto', en: 'Account' },
  signIn: { de: 'Anmelden', en: 'Sign in' },
  signUp: { de: 'Konto erstellen', en: 'Create account' },
  signOut: { de: 'Abmelden', en: 'Sign out' },
  deleteAccount: { de: 'Konto löschen', en: 'Delete account' },
  deleteAccountBody: {
    de: 'Dein Konto und dein gespeicherter Fortschritt werden endgültig gelöscht.',
    en: 'Your account and saved progress will be deleted permanently.',
  },
  deleteFailed: {
    de: 'Das Konto konnte nicht gelöscht werden. Prüfe deine Verbindung und versuche es erneut.',
    en: 'The account could not be deleted. Check your connection and try again.',
  },
  email: { de: 'E-Mail', en: 'Email' },
  password: { de: 'Passwort', en: 'Password' },
  signedInAs: { de: 'Angemeldet als', en: 'Signed in as' },
  guest: {
    de: 'Du lernst ohne Konto. Dein Fortschritt ist nur auf diesem Gerät gespeichert.',
    en: 'You are learning without an account. Your progress is saved on this device only.',
  },
  backendMissing: {
    de: 'Die Anmeldung ist noch nicht eingerichtet. Du kannst trotzdem lernen.',
    en: 'Sign-in is not set up yet. You can still learn.',
  },
  checkEmail: {
    de: 'Fast fertig: Bestätige deine E-Mail-Adresse über den Link, den wir dir geschickt haben.',
    en: 'Almost done: confirm your email address with the link we sent you.',
  },
  placeholderNotice: {
    de: 'Übungsfragen unseres Teams. Der amtliche Fragenkatalog folgt.',
    en: 'Practice questions by our team. The official catalog is coming.',
  },
  xp: { de: 'XP', en: 'XP' },
  questionOf: { de: 'Frage {n} von {total}', en: 'Question {n} of {total}' },
  unanswered: { de: '{n} Fragen noch offen', en: '{n} questions still open' },
  reviewAnswers: { de: 'Antworten ansehen', en: 'Review answers' },
  yourAnswer: { de: 'Deine Antwort', en: 'Your answer' },
  noAnswer: { de: 'Keine Antwort', en: 'No answer' },
  backToPath: { de: 'Zurück zum Lernpfad', en: 'Back to the path' },
  delete: { de: 'Löschen', en: 'Delete' },
  jumpToLesson: { de: 'Zu meiner Lektion', en: 'Go to my lesson' },
  lessonOf: { de: 'Lektion {n} von {total}', en: 'Lesson {n} of {total}' },
  lockedHint: {
    de: 'Schließe zuerst die Lektionen davor ab, dann geht es hier weiter.',
    en: 'Finish the lessons before this one to unlock it.',
  },
  practiseAgain: { de: 'Nochmal üben', en: 'Practise again' },
  sound: { de: 'Töne', en: 'Sound effects' },
  readyTab: { de: 'Bereit?', en: 'Ready?' },
  readyTitle: { de: 'Bin ich bereit?', en: 'Am I ready?' },
  levelStart: { de: 'Am Anfang', en: 'Just starting' },
  levelBuilding: { de: 'Im Aufbau', en: 'Building up' },
  levelAlmost: { de: 'Fast bereit', en: 'Almost there' },
  levelReady: { de: 'Bereit für die Prüfung', en: 'Ready for the exam' },
  scoreLabel: { de: 'Prüfungsreife', en: 'Exam readiness' },
  scoreNote: {
    de: '„Bereit“ erst, wenn alle fünf Kriterien erfüllt sind. Gemessen an den Übungsfragen dieser App.',
    en: '"Ready" only once all five criteria are met. Measured on this app\'s practice questions.',
  },
  scoreReadyNote: {
    de: 'Alle Kriterien erfüllt. Übe jetzt auch mit dem amtlichen Fragenkatalog, z. B. über deine Fahrschule.',
    en: 'All criteria met. Now also practise the official catalog, e.g. through your driving school.',
  },
  entryTitle: { de: 'Wo stehst du?', en: 'Where do you stand?' },
  entryBody: {
    de: 'Der Einstufungstest stellt 20 Fragen aus allen Themen. Danach kennt dein Plan deine Stärken und Lücken.',
    en: 'The entry test asks 20 questions from every topic. Then your plan knows your strengths and gaps.',
  },
  entryStart: { de: 'Einstufungstest starten', en: 'Start entry test' },
  noExamDate: { de: 'Wann ist deine Prüfung?', en: 'When is your exam?' },
  examToday: { de: 'Deine Prüfung ist heute. Viel Erfolg!', en: 'Your exam is today. Good luck!' },
  daysLeft: { de: 'Noch {n} Tage bis zur Prüfung', en: '{n} days to your exam' },
  inWeeks: { de: 'In {n} Wochen', en: 'In {n} weeks' },
  examOn: { de: 'Prüfungstermin: {date}', en: 'Exam date: {date}' },
  todayPlan: { de: 'Heute: {fresh} neue Fragen und {due} Wiederholungen.', en: 'Today: {fresh} new questions and {due} reviews.' },
  startToday: { de: 'Heutigen Plan starten', en: "Start today's plan" },
  criteriaTitle: { de: 'Die 5 Kriterien', en: 'The 5 criteria' },
  critCoverage: { de: 'Mindestens {target} % aller Fragen gesehen', en: 'Seen at least {target} % of all questions' },
  critMastery: { de: 'Wissen zu {target} % gefestigt', en: 'Knowledge {target} % solid' },
  critCritical: { de: '5-Punkte-Fragen zu {target} % sicher', en: '5-point questions {target} % solid' },
  critTopics: { de: 'Kein Thema unter {target} %', en: 'No topic below {target} %' },
  critExams: {
    de: 'Letzte {n} Simulationen bestanden, je max. {max} Fehlerpunkte',
    en: 'Last {n} simulations passed, max. {max} error points each',
  },
  topicsTitle: { de: 'Deine Themen', en: 'Your topics' },
  practise: { de: 'Üben', en: 'Practise' },
  obWelcomeTitle: { de: 'Hallo! Ich bin Ampelino.', en: "Hi! I'm Ampelino." },
  obWelcomeBody: {
    de: 'Ich bringe dich Schritt für Schritt zur Theorieprüfung: ein paar Minuten am Tag, bis du wirklich bereit bist.',
    en: "I'll take you to your theory exam step by step: a few minutes a day, until you're really ready.",
  },
  obDateTitle: { de: 'Wann ist deine Prüfung?', en: 'When is your exam?' },
  obDateBody: { de: 'Ich plane dein tägliches Pensum bis dahin.', en: "I'll plan your daily load until then." },
  obNoDate: { de: 'Noch kein Termin', en: 'No date yet' },
  obGoalTitle: { de: 'Wie viel pro Tag?', en: 'How much per day?' },
  obGoalBody: { de: 'Kleine, tägliche Schritte wirken am besten.', en: 'Small daily steps work best.' },
  obGoal10: { de: 'Locker · ca. 5 Min.', en: 'Casual · about 5 min' },
  obGoal20: { de: 'Normal · ca. 10 Min.', en: 'Regular · about 10 min' },
  obGoal30: { de: 'Ernsthaft · ca. 15 Min.', en: 'Serious · about 15 min' },
  obGoal50: { de: 'Intensiv · ca. 25 Min.', en: 'Intense · about 25 min' },
  obTestTitle: { de: 'Wo stehst du gerade?', en: 'Where are you right now?' },
  obTestBody: {
    de: '20 Fragen aus allen Themen, ca. 5 Minuten. Keine Sorge, wenn du vieles noch nicht weißt.',
    en: "20 questions from every topic, about 5 minutes. Don't worry if you don't know much yet.",
  },
  obSkip: { de: 'Später', en: 'Later' },
  next2: { de: 'Weiter', en: 'Next' },
  entryDone: { de: 'Einstufung geschafft', en: 'Entry test done' },
  entryHint: { de: 'Jetzt weißt du, wo du stehst. Dein Plan ist bereit.', en: 'Now you know where you stand. Your plan is ready.' },
  seeMyPlan: { de: 'Meinen Plan ansehen', en: 'See my plan' },
  unitTestPassed: { de: 'Test bestanden!', en: 'Test passed!' },
  unitTestFailed: { de: 'Noch nicht bestanden', en: 'Not passed yet' },
  unitTestNeed: { de: 'Du brauchst {n} % richtige Antworten. Übe noch etwas und versuch es nochmal.', en: 'You need {n} % right. Practise a little more and try again.' },
  on: { de: 'An', en: 'On' },
  off: { de: 'Aus', en: 'Off' },
  combo: { de: '{n} richtig in Folge!', en: '{n} in a row!' },
  goalReached: { de: 'Tagesziel erreicht!', en: 'Daily goal reached!' },
  bestCombo: { de: 'Beste Serie', en: 'Best streak' },
} satisfies Record<string, LocalizedText>;

export type StringKey = keyof typeof strings;

export function t(key: StringKey, locale: Locale, vars: Record<string, string | number> = {}): string {
  let text = tr(strings[key], locale);
  for (const [name, value] of Object.entries(vars)) text = text.replace(`{${name}}`, String(value));
  return text;
}

/** Short, varied reactions so feedback never feels repetitive. */
const REACTIONS = {
  correct: {
    de: ['Richtig!', 'Super!', 'Freie Fahrt!', 'Klasse!', 'Genau so!'],
    en: ['Correct!', 'Great!', 'Clear road ahead!', 'Nice one!', 'Exactly!'],
  },
  wrong: {
    de: ['Nicht ganz.', 'Kurzer Stopp.', 'Fast!', 'Noch mal hinschauen.'],
    en: ['Not quite.', 'Quick stop.', 'Almost!', 'Take another look.'],
  },
} as const;

export function reaction(kind: keyof typeof REACTIONS, locale: Locale, seed: number): string {
  const list = REACTIONS[kind][locale];
  return list[Math.abs(seed) % list.length];
}
