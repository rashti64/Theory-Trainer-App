/**
 * Lesson player: one question per screen, "Check", instant feedback, "Continue".
 * Questions answered wrong come back once at the end of the lesson.
 * Only the first attempt counts for spaced repetition and XP.
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { UNITS } from '@/content/path';
import { isAnswerCorrect } from '@/domain/exam';
import { buildLesson, buildMistakesReview } from '@/domain/lesson';
import { localToday } from '@/domain/srs';
import { lessonXp } from '@/domain/streak';
import type { Answer, Question } from '@/domain/types';
import { useAppState } from '@/state/app-state';
import { AppText, ProgressBar, RaisedButton } from '@/ui/components';
import { t, tr } from '@/ui/i18n';
import { formatNumber, QuestionView } from '@/ui/question-view';
import { colors, radius, space } from '@/ui/theme';

export default function LessonScreen() {
  const { unitId } = useLocalSearchParams<{ unitId: string }>();
  const { state, catalog, dispatch } = useAppState();
  const locale = state.locale;
  const unit = UNITS.find((u) => u.id === unitId);

  const [queue, setQueue] = useState<Question[]>(() =>
    unitId === 'review' || !unit
      ? buildMistakesReview(catalog.questions, state.progress)
      : buildLesson(catalog.questions, unit.topicIds, state.progress, localToday()),
  );
  const [firstRoundSize] = useState(queue.length);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<Answer | undefined>();
  const [numberText, setNumberText] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [finishedXp, setFinishedXp] = useState<number | null>(null);

  const question = queue[index];
  const isRetry = index >= firstRoundSize;
  const correct = question ? isAnswerCorrect(question, answer) : false;
  const hasAnswer =
    answer?.kind === 'multiple-choice' ? answer.selectedOptionIds.length > 0 : answer?.value != null;

  function check() {
    if (!question) return;
    setRevealed(true);
    if (!isRetry) {
      dispatch({ type: 'answered', question, correct });
      if (correct) setFirstTryCorrect((n) => n + 1);
      else setQueue((q) => [...q, question]);
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
    dispatch({ type: 'lesson-finished', xp, unitId: unit ? unit.id : null });
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
        locale={locale}
      />
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.top}>
        <Pressable onPress={quit} accessibilityRole="button" accessibilityLabel={t('close', locale)} hitSlop={12}>
          <Ionicons name="close" size={30} color={colors.muted} />
        </Pressable>
        <ProgressBar value={Math.min(index, firstRoundSize) / firstRoundSize} />
      </View>

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <QuestionView
          key={`${question.id}-${index}`}
          question={question}
          locale={locale}
          answer={answer}
          onChange={setAnswer}
          revealed={revealed}
          numberText={numberText}
          onNumberTextChange={setNumberText}
        />
      </ScrollView>

      {revealed ? (
        <View style={[styles.feedback, { backgroundColor: correct ? colors.greenTint : colors.redTint }]}>
          <View style={styles.feedbackHead}>
            <Ionicons
              name={correct ? 'checkmark-circle' : 'close-circle'}
              size={28}
              color={correct ? colors.green : colors.red}
            />
            <AppText variant="title" color={correct ? colors.greenDark : colors.redDark}>
              {t(correct ? 'correct' : 'wrong', locale)}
            </AppText>
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
        </View>
      ) : (
        <View style={styles.footer}>
          <RaisedButton label={t('check', locale)} disabled={!hasAnswer} onPress={check} />
        </View>
      )}
    </SafeAreaView>
  );
}

function LessonComplete({ xp, accuracy, locale }: { xp: number; accuracy: number; locale: 'de' | 'en' }) {
  return (
    <SafeAreaView style={[styles.screen, styles.complete]}>
      <View style={styles.trophy}>
        <Ionicons name="flag" size={64} color={colors.asphalt} />
      </View>
      <AppText variant="display" style={styles.center}>
        {t('lessonDone', locale)}
      </AppText>
      <View style={styles.results}>
        <View style={[styles.result, { borderColor: colors.yellow }]}>
          <AppText variant="small" color={colors.yellowDark}>
            {t('xpEarned', locale)}
          </AppText>
          <AppText variant="display">{xp}</AppText>
        </View>
        <View style={[styles.result, { borderColor: colors.green }]}>
          <AppText variant="small" color={colors.greenDark}>
            {t('accuracy', locale)}
          </AppText>
          <AppText variant="display">{Math.round(accuracy * 100)}%</AppText>
        </View>
      </View>
      <RaisedButton label={t('continue', locale)} onPress={() => router.back()} style={styles.completeButton} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  top: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingHorizontal: space.lg, paddingTop: space.md },
  body: { padding: space.lg, paddingBottom: space.xxl },
  footer: { padding: space.lg, borderTopWidth: 2, borderTopColor: colors.line },
  feedback: {
    padding: space.lg,
    gap: space.sm,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  feedbackHead: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  complete: { alignItems: 'center', justifyContent: 'center', padding: space.xl, gap: space.xl },
  trophy: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.yellow,
    borderWidth: 6,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { textAlign: 'center' },
  results: { flexDirection: 'row', gap: space.md },
  result: {
    borderWidth: 2,
    borderRadius: radius.md,
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
    alignItems: 'center',
    minWidth: 140,
    backgroundColor: colors.surface,
  },
  completeButton: { alignSelf: 'stretch' },
});
