/**
 * Lesson player: the mascot asks, the learner answers, "Check" gives instant
 * feedback with a reaction, confetti and combo counter. Questions answered
 * wrong come back once at the end. Only the first attempt counts for spaced
 * repetition and XP.
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { SlideInDown, SlideInLeft, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TOPICS, UNITS } from '@/content/path';
import { LESSONS_PER_UNIT, pathStatus } from '@/content/path-progress';
import { isAnswerCorrect } from '@/domain/exam';
import {
  buildDailySession,
  buildEntryTest,
  buildLesson,
  buildMistakesReview,
  buildUnitTest,
  UNIT_TEST_PASS,
  unitTestPassed,
} from '@/domain/lesson';
import { readiness } from '@/domain/readiness';
import { localToday, type ProgressMap } from '@/domain/srs';
import { lessonXp } from '@/domain/streak';
import type { Answer, Catalog, Locale, Question } from '@/domain/types';
import { useAppState } from '@/state/app-state';
import { AppText, RaisedButton } from '@/ui/components';
import { Confetti } from '@/ui/confetti';
import { reaction, t, tr } from '@/ui/i18n';
import { StepCar } from '@/ui/sprites';
import { useFeedback } from '@/ui/feedback';
import { Mascot3DView } from '@/ui/mascot-3d-view';
import { formatNumber } from '@/ui/number-input';
import { QuestionView } from '@/ui/question-view';
import { RoadProgress } from '@/ui/road-progress';
import { colors, fonts, radius, space } from '@/ui/theme';

type Mode = 'lesson' | 'unit-test' | 'entry-test' | 'review' | 'daily' | 'topic';

/** What kind of session a route opens, and its questions. */
function startSession(
  route: string,
  catalog: Catalog,
  progress: ProgressMap,
  unitLessons: Record<string, number | undefined>,
  examDate: string | null,
  exams: Parameters<typeof readiness>[0]['exams'],
): { mode: Mode; questions: Question[] } {
  const pool = catalog.questions;
  const today = localToday();
  if (route === 'review') return { mode: 'review', questions: buildMistakesReview(pool, progress) };
  if (route === 'entry') return { mode: 'entry-test', questions: buildEntryTest(pool) };
  if (route === 'daily') {
    const order = TOPICS.map((t) => t.id);
    const plan = readiness({ questions: pool, topicIds: order, progress, exams, today, examDate }).plan;
    return { mode: 'daily', questions: buildDailySession(pool, order, progress, today, Math.min(plan.newPerDay, 10)) };
  }
  if (route.startsWith('topic-')) {
    return { mode: 'topic', questions: buildLesson(pool, [route.slice(6)], progress, today, { size: 12 }) };
  }
  const unit = UNITS.find((u) => u.id === route);
  if (!unit) return { mode: 'review', questions: [] };
  const status = pathStatus(UNITS, unitLessons).find((st) => st.unit.id === unit.id);
  // The last stop of every unit is a test: mixed questions from the whole unit, 80 % to pass.
  if (status && !status.completed && status.lessonsDone === LESSONS_PER_UNIT - 1) {
    return { mode: 'unit-test', questions: buildUnitTest(pool, unit.topicIds) };
  }
  return { mode: 'lesson', questions: buildLesson(pool, unit.topicIds, progress, today) };
}

export default function LessonScreen() {
  const { unitId } = useLocalSearchParams<{ unitId: string }>();
  const { state, catalog, dispatch } = useAppState();
  const feedback = useFeedback();
  const locale = state.locale;
  const unit = UNITS.find((u) => u.id === unitId);

  const [session] = useState(() =>
    startSession(String(unitId), catalog, state.progress, state.unitLessons, state.examDate, state.exams),
  );
  const isTest = session.mode === 'unit-test' || session.mode === 'entry-test';
  const [queue, setQueue] = useState<Question[]>(session.questions);
  const [firstRoundSize] = useState(queue.length);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<Answer | undefined>();
  const [numberText, setNumberText] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [confetti, setConfetti] = useState(0);
  const [finishedXp, setFinishedXp] = useState<number | null>(null);
  const [goalBefore] = useState(() => state.activity[localToday()]?.xp ?? 0);

  const question = queue[index];
  const isRetry = index >= firstRoundSize;
  const correct = question ? isAnswerCorrect(question, answer) : false;
  const hasAnswer =
    answer?.kind === 'multiple-choice' ? answer.selectedOptionIds.length > 0 : answer?.value != null;

  function check() {
    if (!question) return;
    setRevealed(true);
    if (correct) feedback.correct();
    else feedback.wrong();
    if (correct) {
      const next = combo + 1;
      setCombo(next);
      setBestCombo((b) => Math.max(b, next));
      setConfetti((n) => n + 1);
    } else {
      setCombo(0);
    }
    if (!isRetry) {
      dispatch({ type: 'answered', question, correct });
      if (correct) setFirstTryCorrect((n) => n + 1);
      // In tests there is no second chance; in lessons, mistakes come back at the end.
      else if (!isTest) setQueue((q) => [...q, question]);
    }
  }

  function next() {
    if (index + 1 < queue.length) {
      setIndex(index + 1);
      setAnswer(undefined);
      setNumberText('');
      setRevealed(false);
      return;
    }
    const xp = lessonXp(firstTryCorrect, firstRoundSize);
    if (session.mode === 'entry-test') {
      dispatch({ type: 'entry-test-finished', correct: firstTryCorrect, total: firstRoundSize, xp });
    } else {
      const counts = session.mode === 'lesson' || (session.mode === 'unit-test' && unitTestPassed(firstTryCorrect, firstRoundSize));
      dispatch({ type: 'lesson-finished', xp, unitId: unit && session.mode !== 'topic' ? unit.id : null, counts });
    }
    feedback.complete();
    setFinishedXp(xp);
  }

  function quit() {
    Alert.alert(t('quitLesson', locale), t('quitLessonBody', locale), [
      { text: t('keepGoing', locale), style: 'cancel' },
      { text: t('quit', locale), style: 'destructive', onPress: () => router.back() },
    ]);
  }

  if (finishedXp !== null || queue.length === 0) {
    return (
      <LessonComplete
        xp={finishedXp ?? 0}
        accuracy={firstRoundSize ? firstTryCorrect / firstRoundSize : 0}
        bestCombo={bestCombo}
        goalReached={goalBefore < state.dailyGoalXp && goalBefore + (finishedXp ?? 0) >= state.dailyGoalXp}
        locale={locale}
        mode={session.mode}
        passed={session.mode !== 'unit-test' || unitTestPassed(firstTryCorrect, firstRoundSize)}
      />
    );
  }

  const mood = !revealed ? 'curious' : correct ? 'happy' : 'oops';

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.top}>
        <Pressable onPress={quit} accessibilityRole="button" accessibilityLabel={t('close', locale)} hitSlop={12}>
          <Ionicons name="close" size={30} color={colors.muted} />
        </Pressable>
        <RoadProgress value={Math.min(index + (revealed ? 1 : 0), firstRoundSize) / firstRoundSize} />
        {isTest ? (
          <View style={styles.testChip}>
            <Ionicons name="school" size={15} color={colors.white} />
          </View>
        ) : null}
        {combo >= 2 ? (
          <Animated.View entering={ZoomIn.springify()} style={styles.comboChip}>
            <Ionicons name="flame" size={16} color="#F2541B" />
            <AppText style={styles.comboChipText}>{combo}</AppText>
          </Animated.View>
        ) : null}
      </View>

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <QuestionView
          key={`${question.id}-${index}`}
          question={question}
          locale={locale}
          answer={answer}
          onChange={(a) => {
            feedback.tap();
            setAnswer(a);
          }}
          revealed={revealed}
          numberText={numberText}
          onNumberTextChange={setNumberText}
          mood={mood}
        />
      </ScrollView>

      {revealed ? (
        <Animated.View
          entering={SlideInDown.springify().damping(16)}
          style={[styles.feedback, { backgroundColor: correct ? colors.greenTint : colors.redTint }]}>
          <View style={styles.feedbackHead}>
            <View style={[styles.feedbackIcon, { backgroundColor: correct ? colors.green : colors.red }]}>
              <Ionicons name={correct ? 'checkmark' : 'close'} size={24} color={colors.white} />
            </View>
            <AppText style={[styles.feedbackTitle, { color: correct ? colors.greenDark : colors.redDark }]}>
              {reaction(correct ? 'correct' : 'wrong', locale, index + firstTryCorrect)}
            </AppText>
            {correct && combo >= 3 ? (
              <View style={styles.comboBadge}>
                <AppText style={styles.comboBadgeText}>{t('combo', locale, { n: combo })}</AppText>
              </View>
            ) : null}
          </View>
          {!correct && question.kind === 'number' && question.numberAnswer ? (
            <AppText variant="bodyStrong" color={colors.redDark}>
              {t('correctAnswer', locale)} {formatNumber(question.numberAnswer.value, locale)}{' '}
              {tr(question.numberAnswer.unit, locale)}
            </AppText>
          ) : null}
          {question.explanation ? (
            <AppText color={correct ? colors.greenDark : colors.redDark}>{tr(question.explanation, locale)}</AppText>
          ) : null}
          <RaisedButton label={t('continue', locale)} tone={correct ? 'success' : 'danger'} onPress={next} />
        </Animated.View>
      ) : (
        <View style={styles.footer}>
          <RaisedButton label={t('check', locale)} disabled={!hasAnswer} onPress={check} />
        </View>
      )}

      <Confetti burst={confetti} />
    </SafeAreaView>
  );
}

function LessonComplete({
  xp,
  accuracy,
  bestCombo,
  goalReached,
  locale,
  mode,
  passed,
}: {
  xp: number;
  accuracy: number;
  bestCombo: number;
  goalReached: boolean;
  locale: Locale;
  mode: Mode;
  passed: boolean;
}) {
  // Count the XP up, like a slot machine.
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (shown >= xp) return;
    const id = setTimeout(() => setShown((n) => Math.min(xp, n + 1)), 45);
    return () => clearTimeout(id);
  }, [shown, xp]);

  return (
    <SafeAreaView style={[styles.screen, styles.complete]}>
      <Mascot3DView mood={passed ? 'happy' : 'oops'} size={150} />
      {/* The car rolls over the finish line. */}
      <View style={styles.finishRoad}>
        <View style={styles.finishLine}>
          {Array.from({ length: 12 }, (_, i) => (
            <View key={i} style={[styles.finishCell, { backgroundColor: (i + Math.floor(i / 2)) % 2 ? '#1F2A33' : '#FFFFFF' }]} />
          ))}
        </View>
        <Animated.View entering={SlideInLeft.duration(1100)} style={styles.finishCar}>
          <StepCar body={colors.red} size={64} />
        </Animated.View>
      </View>
      <Animated.View entering={ZoomIn.springify().delay(150)}>
        <AppText style={styles.completeTitle}>
          {mode === 'entry-test'
            ? t('entryDone', locale)
            : mode === 'unit-test'
              ? t(passed ? 'unitTestPassed' : 'unitTestFailed', locale)
              : t('lessonDone', locale)}
        </AppText>
        {mode === 'unit-test' && !passed ? (
          <AppText style={styles.completeHint}>{t('unitTestNeed', locale, { n: Math.round(UNIT_TEST_PASS * 100) })}</AppText>
        ) : null}
        {mode === 'entry-test' ? <AppText style={styles.completeHint}>{t('entryHint', locale)}</AppText> : null}
      </Animated.View>
      {goalReached ? (
        <Animated.View entering={ZoomIn.springify().delay(500)} style={styles.goalBadge}>
          <Ionicons name="speedometer" size={18} color={colors.white} />
          <AppText style={styles.goalBadgeText}>{t('goalReached', locale)}</AppText>
        </Animated.View>
      ) : null}
      <View style={styles.results}>
        <ResultTile label={t('xpEarned', locale)} value={String(shown)} icon="flash" color={colors.yellow} ink={colors.yellowDark} />
        <ResultTile label={t('accuracy', locale)} value={`${Math.round(accuracy * 100)}%`} icon="locate" color={colors.green} ink={colors.greenDark} />
        <ResultTile label={t('bestCombo', locale)} value={String(bestCombo)} icon="flame" color="#F2541B" ink="#B83A10" />
      </View>
      <RaisedButton
        label={mode === 'entry-test' ? t('seeMyPlan', locale) : t('continue', locale)}
        onPress={() => (mode === 'entry-test' ? router.replace('/exam') : router.back())}
        style={styles.completeButton}
      />
      {passed ? <Confetti burst={1} /> : null}
    </SafeAreaView>
  );
}

function ResultTile({
  label,
  value,
  icon,
  color,
  ink,
}: {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  ink: string;
}) {
  return (
    <View style={[styles.result, { borderColor: color }]}>
      <View style={[styles.resultHead, { backgroundColor: color }]}>
        <Ionicons name={icon} size={14} color={colors.white} />
        <AppText style={styles.resultLabel} numberOfLines={1}>
          {label}
        </AppText>
      </View>
      <AppText style={[styles.resultValue, { color: ink }]}>{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F2F7FB' },
  top: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingHorizontal: space.lg, paddingTop: space.md },
  comboChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#FFE3D6',
    borderRadius: radius.round,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  comboChipText: { fontFamily: fonts.black, fontSize: 15, lineHeight: 18, color: '#B83A10' },
  body: { padding: space.lg, paddingBottom: space.xxl },
  footer: { padding: space.lg, borderTopWidth: 2, borderTopColor: colors.line, backgroundColor: colors.white },
  feedback: {
    padding: space.lg,
    gap: space.sm,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  feedbackHead: { flexDirection: 'row', alignItems: 'center', gap: space.sm, flexWrap: 'wrap' },
  feedbackIcon: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  feedbackTitle: { fontFamily: fonts.black, fontSize: 24, lineHeight: 30 },
  comboBadge: { backgroundColor: '#F2541B', borderRadius: radius.round, paddingHorizontal: 10, paddingVertical: 3 },
  comboBadgeText: { fontFamily: fonts.bold, fontSize: 13, lineHeight: 17, color: colors.white },
  complete: { alignItems: 'center', justifyContent: 'center', padding: space.xl, gap: space.lg },
  completeHint: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 22, color: colors.slate, textAlign: 'center', marginTop: space.xs },
  testChip: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeTitle: { fontFamily: fonts.black, fontSize: 32, lineHeight: 38, color: colors.asphalt, textAlign: 'center' },
  goalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.blue,
    borderRadius: radius.round,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  goalBadgeText: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 19, color: colors.white },
  results: { flexDirection: 'row', gap: space.sm, alignSelf: 'stretch' },
  result: { flex: 1, borderWidth: 2.5, borderRadius: radius.md, overflow: 'hidden', backgroundColor: colors.white, alignItems: 'center' },
  resultHead: { alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 4 },
  resultLabel: { fontFamily: fonts.bold, fontSize: 12, lineHeight: 15, color: colors.white },
  resultValue: { fontFamily: fonts.black, fontSize: 30, lineHeight: 40 },
  completeButton: { alignSelf: 'stretch' },
  finishRoad: {
    alignSelf: 'stretch',
    height: 56,
    backgroundColor: '#5B6570',
    borderRadius: radius.md,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  finishLine: { position: 'absolute', right: 40, top: 0, bottom: 0, width: 16, flexDirection: 'row', flexWrap: 'wrap' },
  finishCell: { width: 8, height: 9.33 },
  finishCar: { position: 'absolute', right: 64, bottom: 6 },
});
