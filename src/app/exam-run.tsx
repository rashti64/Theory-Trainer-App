/**
 * Exam simulator: 30 questions, free navigation, no feedback until hand-in,
 * then the official pass/fail rules from domain/exam.ts.
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { assembleExam, isAnswerCorrect, scoreExam, type ExamResult } from '@/domain/exam';
import { examXp } from '@/domain/streak';
import type { Answer, Locale, Question } from '@/domain/types';
import { useAppState } from '@/state/app-state';
import { AppText, Card, RaisedButton } from '@/ui/components';
import { t, tr } from '@/ui/i18n';
import { formatNumber } from '@/ui/number-input';
import { QuestionView } from '@/ui/question-view';
import { colors, radius, space } from '@/ui/theme';

export default function ExamRunScreen() {
  const { state, catalog, dispatch } = useAppState();
  const locale = state.locale;
  const [questions] = useState(() => assembleExam(catalog.questions));
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer | undefined>>({});
  const [numberTexts, setNumberTexts] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ExamResult | null>(null);

  const question = questions[index];
  const isAnswered = (q: Question) => {
    const a = answers[q.id];
    return a?.kind === 'multiple-choice' ? a.selectedOptionIds.length > 0 : a?.value != null;
  };
  const openCount = questions.filter((q) => !isAnswered(q)).length;

  function handIn() {
    const finish = () => {
      const scored = scoreExam(questions, answers);
      for (const q of questions) {
        dispatch({ type: 'answered', question: q, correct: !scored.wrongQuestionIds.includes(q.id) });
      }
      dispatch({ type: 'exam-finished', result: scored, xp: examXp(scored.passed) });
      setResult(scored);
    };
    if (openCount === 0) return finish();
    Alert.alert(t('finishExam', locale), t('unanswered', locale, { n: openCount }), [
      { text: t('keepGoing', locale), style: 'cancel' },
      { text: t('finishExam', locale), style: 'destructive', onPress: finish },
    ]);
  }

  if (result) return <ExamResultView result={result} questions={questions} answers={answers} locale={locale} />;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.top}>
        <Pressable
          onPress={() =>
            Alert.alert(t('quitLesson', locale), t('quitLessonBody', locale), [
              { text: t('keepGoing', locale), style: 'cancel' },
              { text: t('quit', locale), style: 'destructive', onPress: () => router.back() },
            ])
          }
          accessibilityRole="button"
          accessibilityLabel={t('close', locale)}
          hitSlop={12}>
          <Ionicons name="close" size={30} color={colors.muted} />
        </Pressable>
        <AppText variant="label" color={colors.slate}>
          {t('questionOf', locale, { n: index + 1, total: questions.length })}
        </AppText>
      </View>

      {/* Question grid: jump anywhere, see what is still open. */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.gridScroll}
        contentContainerStyle={styles.grid}>
        {questions.map((q, i) => (
          <Pressable
            key={q.id}
            onPress={() => setIndex(i)}
            accessibilityRole="button"
            accessibilityLabel={t('questionOf', locale, { n: i + 1, total: questions.length })}
            style={[
              styles.cell,
              isAnswered(q) && styles.cellDone,
              i === index && styles.cellCurrent,
            ]}>
            <AppText variant="small" color={i === index ? colors.white : colors.asphalt}>
              {i + 1}
            </AppText>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <QuestionView
          key={question.id}
          question={question}
          locale={locale}
          answer={answers[question.id]}
          onChange={(a) => setAnswers((prev) => ({ ...prev, [question.id]: a }))}
          revealed={false}
          numberText={numberTexts[question.id] ?? ''}
          onNumberTextChange={(text) => setNumberTexts((prev) => ({ ...prev, [question.id]: text }))}
        />
      </ScrollView>

      <View style={styles.footer}>
        <RaisedButton
          label={t('previous', locale)}
          tone="neutral"
          disabled={index === 0}
          onPress={() => setIndex(index - 1)}
          style={styles.flex}
        />
        {index < questions.length - 1 ? (
          <RaisedButton label={t('next', locale)} onPress={() => setIndex(index + 1)} style={styles.flex} />
        ) : (
          <RaisedButton label={t('finishExam', locale)} tone="reward" onPress={handIn} style={styles.flex} />
        )}
      </View>
    </SafeAreaView>
  );
}

function ExamResultView({
  result,
  questions,
  answers,
  locale,
}: {
  result: ExamResult;
  questions: Question[];
  answers: Record<string, Answer | undefined>;
  locale: Locale;
}) {
  const wrong = questions.filter((q) => !isAnswerCorrect(q, answers[q.id]));
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.body}>
        <View style={[styles.verdict, { backgroundColor: result.passed ? colors.green : colors.red }]}>
          <Ionicons name={result.passed ? 'ribbon' : 'refresh'} size={48} color={colors.white} />
          <AppText variant="display" color={colors.white}>
            {t(result.passed ? 'passed' : 'failed', locale)}
          </AppText>
          <AppText variant="bodyStrong" color={colors.white}>
            {result.errorPoints} / {result.maxErrorPoints} {t('points', locale)}
          </AppText>
          {result.failReason ? (
            <AppText color={colors.white}>
              {t(result.failReason === 'two-five-point-questions' ? 'failFive' : 'failTooMany', locale)}
            </AppText>
          ) : null}
        </View>

        {wrong.map((q) => (
          <Card key={q.id} style={styles.wrongCard}>
            <AppText variant="small" color={q.points === 5 ? colors.redDark : colors.slate}>
              {q.points} {t('points', locale)}
            </AppText>
            <AppText variant="bodyStrong">{tr(q.prompt, locale)}</AppText>
            <AppText variant="small" color={colors.redDark}>
              {t('yourAnswer', locale)}: {describeAnswer(q, answers[q.id], locale)}
            </AppText>
            <AppText variant="small" color={colors.greenDark}>
              {t('correctAnswer', locale)} {describeCorrect(q, locale)}
            </AppText>
          </Card>
        ))}

        <RaisedButton label={t('backToPath', locale)} onPress={() => router.back()} />
      </ScrollView>
    </SafeAreaView>
  );
}

function describeAnswer(q: Question, a: Answer | undefined, locale: Locale): string {
  if (!a) return t('noAnswer', locale);
  if (a.kind === 'number') return a.value === null ? t('noAnswer', locale) : formatNumber(a.value, locale);
  const texts = (q.options ?? []).filter((o) => a.selectedOptionIds.includes(o.id)).map((o) => tr(o.text, locale));
  return texts.length ? texts.join('; ') : t('noAnswer', locale);
}

function describeCorrect(q: Question, locale: Locale): string {
  if (q.kind === 'number' && q.numberAnswer) {
    return `${formatNumber(q.numberAnswer.value, locale)} ${tr(q.numberAnswer.unit, locale)}`;
  }
  return (q.options ?? []).filter((o) => o.correct).map((o) => tr(o.text, locale)).join('; ');
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  top: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingHorizontal: space.lg, paddingTop: space.md },
  gridScroll: { flexGrow: 0 },
  grid: { gap: space.xs, paddingHorizontal: space.lg, paddingVertical: space.md },
  cell: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  cellDone: { backgroundColor: colors.blueTint, borderColor: colors.blue },
  cellCurrent: { backgroundColor: colors.blue, borderColor: colors.blueDark },
  body: { padding: space.lg, gap: space.lg, paddingBottom: space.xxl },
  footer: { flexDirection: 'row', gap: space.md, padding: space.lg, borderTopWidth: 2, borderTopColor: colors.line },
  flex: { flex: 1 },
  verdict: { alignItems: 'center', gap: space.sm, padding: space.xl, borderRadius: radius.lg },
  wrongCard: { gap: space.xs },
});
