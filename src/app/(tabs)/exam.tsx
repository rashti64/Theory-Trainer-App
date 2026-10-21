import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { mastery } from '@/domain/srs';
import { useAppState } from '@/state/app-state';
import { AppText, Card, ProgressBar, RaisedButton } from '@/ui/components';
import { Mascot3DView } from '@/ui/mascot-3d-view';
import { t } from '@/ui/i18n';
import { colors, space } from '@/ui/theme';

export default function ExamTab() {
  const { state, catalog } = useAppState();
  const locale = state.locale;
  const readiness = mastery(
    catalog.questions.filter((q) => q.classes.includes('B')),
    state.progress,
  );

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Mascot3DView mood={readiness >= 0.8 ? 'happy' : 'curious'} size={92} />
          <View style={styles.flex}>
            <AppText variant="display">{t('examTitle', locale)}</AppText>
          </View>
        </View>
        <AppText color={colors.slate}>{t('examRules', locale)}</AppText>

        <Card style={styles.gap}>
          <AppText variant="label">{t('readiness', locale)}</AppText>
          <View style={styles.readinessRow}>
            <ProgressBar value={readiness} color={readiness >= 0.8 ? colors.green : colors.yellow} />
            <AppText variant="title">{Math.round(readiness * 100)}%</AppText>
          </View>
        </Card>

        <RaisedButton label={t('startExam', locale)} onPress={() => router.push('/exam-run')} />

        <AppText variant="title" style={styles.historyTitle}>
          {t('lastExams', locale)}
        </AppText>
        {state.exams.length === 0 ? (
          <AppText color={colors.muted}>{t('noExams', locale)}</AppText>
        ) : (
          state.exams.map((exam, i) => (
            <View key={`${exam.day}-${i}`} style={styles.historyRow}>
              <Ionicons
                name={exam.passed ? 'checkmark-circle' : 'close-circle'}
                size={24}
                color={exam.passed ? colors.green : colors.red}
              />
              <AppText variant="bodyStrong" style={styles.flex}>
                {t(exam.passed ? 'passed' : 'failed', locale)}
              </AppText>
              <AppText color={colors.slate}>
                {exam.errorPoints} {t('points', locale)}
              </AppText>
              <AppText variant="small" color={colors.muted}>
                {exam.day}
              </AppText>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: space.lg, gap: space.lg, paddingBottom: space.xxl },
  gap: { gap: space.sm },
  readinessRow: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  historyTitle: { marginTop: space.md },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingVertical: space.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  flex: { flex: 1 },
  hero: { flexDirection: 'row', alignItems: 'center', gap: space.md },
});
