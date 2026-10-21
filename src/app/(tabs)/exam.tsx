/**
 * "Am I ready?" — the readiness programme in one screen: an honest 0–100 score,
 * the five criteria that must all be met, today's plan towards the exam date,
 * the weakest topics to practise, and the mock exams.
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import { TOPICS } from '@/content/path';
import { examDateIn, readiness, TARGETS, type CriterionId, type ReadinessLevel } from '@/domain/readiness';
import { localToday } from '@/domain/srs';
import { useAppState } from '@/state/app-state';
import { AppText, Card, ProgressBar, RaisedButton } from '@/ui/components';
import { t, tr, type StringKey } from '@/ui/i18n';
import { Mascot3DView } from '@/ui/mascot-3d-view';
import { colors, fonts, radius, space } from '@/ui/theme';

const LEVEL: Record<ReadinessLevel, { key: StringKey; color: string; mood: 'curious' | 'happy' | 'oops' }> = {
  start: { key: 'levelStart', color: colors.red, mood: 'curious' },
  building: { key: 'levelBuilding', color: colors.orange, mood: 'curious' },
  almost: { key: 'levelAlmost', color: colors.yellowDark, mood: 'curious' },
  ready: { key: 'levelReady', color: colors.green, mood: 'happy' },
};

const CRITERIA: Record<CriterionId, StringKey> = {
  coverage: 'critCoverage',
  mastery: 'critMastery',
  critical: 'critCritical',
  topics: 'critTopics',
  exams: 'critExams',
};

const DATE_OPTIONS = [2, 4, 6, 8] as const;

export default function ReadinessScreen() {
  const { state, catalog, dispatch } = useAppState();
  const locale = state.locale;
  const today = localToday();
  const report = readiness({
    questions: catalog.questions,
    topicIds: TOPICS.map((tp) => tp.id),
    progress: state.progress,
    exams: state.exams,
    today,
    examDate: state.examDate,
  });
  const level = LEVEL[report.level];
  const topicTitle = (id: string) => tr(TOPICS.find((tp) => tp.id === id)?.title, locale);
  const sortedTopics = [...report.topics].sort((a, b) => a.strength - b.strength);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Mascot3DView mood={level.mood} size={88} />
          <View style={styles.flex}>
            <AppText variant="display">{t('readyTitle', locale)}</AppText>
            <AppText style={[styles.levelText, { color: level.color }]}>{t(level.key, locale)}</AppText>
          </View>
        </View>

        {/* Score */}
        <Card style={styles.scoreCard}>
          <ScoreRing value={report.score} color={level.color} />
          <View style={styles.flex}>
            <AppText variant="title">{t('scoreLabel', locale)}</AppText>
            <AppText variant="small" color={colors.slate}>
              {t(report.level === 'ready' ? 'scoreReadyNote' : 'scoreNote', locale)}
            </AppText>
          </View>
        </Card>

        {/* Entry test, if not done yet */}
        {!state.entryTest ? (
          <Card style={[styles.gap, styles.entryCard]}>
            <AppText variant="title" color={colors.white}>
              {t('entryTitle', locale)}
            </AppText>
            <AppText color={colors.white}>{t('entryBody', locale)}</AppText>
            <RaisedButton label={t('entryStart', locale)} tone="light" onPress={() => router.push('/lesson/entry')} />
          </Card>
        ) : null}

        {/* Plan */}
        <Card style={styles.gap}>
          <View style={styles.row}>
            <Ionicons name="calendar" size={22} color={colors.blue} />
            <AppText variant="title" style={styles.flex}>
              {report.plan.daysLeft === null
                ? t('noExamDate', locale)
                : report.plan.daysLeft === 0
                  ? t('examToday', locale)
                  : t('daysLeft', locale, { n: report.plan.daysLeft })}
            </AppText>
          </View>
          <View style={styles.chips}>
            {DATE_OPTIONS.map((weeks) => {
              const date = examDateIn(today, weeks);
              const active = state.examDate === date;
              return (
                <Pressable
                  key={weeks}
                  onPress={() => dispatch({ type: 'set-exam-date', date })}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                  style={[styles.chip, active && styles.chipActive]}>
                  <AppText variant="small" color={active ? colors.blue : colors.slate}>
                    {t('inWeeks', locale, { n: weeks })}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
          {state.examDate ? (
            <AppText variant="small" color={colors.slate}>
              {t('examOn', locale, { date: formatDate(state.examDate, locale) })}
            </AppText>
          ) : null}
          <AppText color={colors.slate}>
            {t('todayPlan', locale, { fresh: Math.min(report.plan.newPerDay, 10, report.plan.unseen), due: report.plan.dueToday })}
          </AppText>
          <RaisedButton label={t('startToday', locale)} onPress={() => router.push('/lesson/daily')} />
        </Card>

        {/* Criteria */}
        <AppText variant="title" style={styles.section}>
          {t('criteriaTitle', locale)}
        </AppText>
        <Card style={styles.gap}>
          {report.criteria.map((c) => (
            <View key={c.id} style={styles.criterion}>
              <Ionicons
                name={c.met ? 'checkmark-circle' : 'ellipse-outline'}
                size={26}
                color={c.met ? colors.green : colors.line}
              />
              <View style={styles.flex}>
                <AppText variant="bodyStrong">
                  {t(CRITERIA[c.id], locale, {
                    target: Math.round(c.target * 100),
                    n: TARGETS.recentExams,
                    max: TARGETS.examMaxPoints,
                  })}
                </AppText>
                <View style={styles.row}>
                  <ProgressBar value={c.target ? Math.min(1, c.value / c.target) : 0} color={c.met ? colors.green : colors.blue} />
                  <AppText variant="small" color={colors.slate} style={styles.pct}>
                    {Math.round(c.value * 100)}%
                  </AppText>
                </View>
              </View>
            </View>
          ))}
        </Card>

        {/* Topics */}
        <AppText variant="title" style={styles.section}>
          {t('topicsTitle', locale)}
        </AppText>
        <Card style={styles.gap}>
          {sortedTopics.map((tp) => {
            const weak = tp.strength < TARGETS.topic;
            return (
              <Pressable
                key={tp.topicId}
                onPress={() => router.push(`/lesson/topic-${tp.topicId}`)}
                accessibilityRole="button"
                accessibilityLabel={`${topicTitle(tp.topicId)}, ${Math.round(tp.strength * 100)}%`}
                style={styles.topicRow}>
                <View style={styles.flex}>
                  <AppText variant="label">{topicTitle(tp.topicId)}</AppText>
                  <ProgressBar value={tp.strength} color={weak ? colors.orange : colors.green} />
                </View>
                <View style={[styles.practice, weak ? styles.practiceWeak : null]}>
                  <AppText variant="small" color={weak ? colors.white : colors.blue}>
                    {t('practise', locale)}
                  </AppText>
                </View>
              </Pressable>
            );
          })}
        </Card>

        {/* Mock exams */}
        <AppText variant="title" style={styles.section}>
          {t('examTitle', locale)}
        </AppText>
        <AppText color={colors.slate}>{t('examRules', locale)}</AppText>
        <RaisedButton label={t('startExam', locale)} tone="reward" onPress={() => router.push('/exam-run')} />
        {state.exams.length === 0 ? (
          <AppText color={colors.muted}>{t('noExams', locale)}</AppText>
        ) : (
          state.exams.slice(0, 8).map((exam, i) => (
            <View key={`${exam.day}-${i}`} style={styles.historyRow}>
              <Ionicons name={exam.passed ? 'checkmark-circle' : 'close-circle'} size={24} color={exam.passed ? colors.green : colors.red} />
              <AppText variant="bodyStrong" style={styles.flex}>
                {t(exam.passed ? 'passed' : 'failed', locale)}
              </AppText>
              <AppText color={exam.errorPoints <= TARGETS.examMaxPoints ? colors.greenDark : colors.slate}>
                {exam.errorPoints} {t('points', locale)}
              </AppText>
              <AppText variant="small" color={colors.muted}>
                {formatDate(exam.day, locale)}
              </AppText>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ScoreRing({ value, color }: { value: number; color: string }) {
  const size = 112;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <View style={{ width: size, height: size }} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: value }}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.slateTint} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${(c * value) / 100} ${c}`}
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.ringLabel}>
        <AppText style={[styles.ringValue, { color }]}>{value}</AppText>
        <AppText variant="small" color={colors.muted}>
          / 100
        </AppText>
      </View>
    </View>
  );
}

function formatDate(day: string, locale: 'de' | 'en'): string {
  const [y, m, d] = day.split('-');
  return locale === 'de' ? `${d}.${m}.${y}` : `${d}/${m}/${y}`;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  content: { padding: space.lg, gap: space.lg, paddingBottom: space.xxl * 2 },
  hero: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  flex: { flex: 1 },
  levelText: { fontFamily: fonts.black, fontSize: 18, lineHeight: 23 },
  scoreCard: { flexDirection: 'row', alignItems: 'center', gap: space.lg },
  ringLabel: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  ringValue: { fontFamily: fonts.black, fontSize: 36, lineHeight: 40 },
  gap: { gap: space.md },
  entryCard: { backgroundColor: colors.blue, borderColor: colors.blueDark, borderBottomWidth: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  chip: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.line,
  },
  chipActive: { borderColor: colors.blue, backgroundColor: colors.blueTint },
  section: { marginTop: space.sm },
  criterion: { flexDirection: 'row', gap: space.md, alignItems: 'flex-start' },
  pct: { width: 44, textAlign: 'right' },
  topicRow: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  practice: {
    paddingHorizontal: space.md,
    paddingVertical: 6,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.blueTint,
  },
  practiceWeak: { backgroundColor: colors.orange, borderColor: colors.orangeDark },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingVertical: space.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
});
