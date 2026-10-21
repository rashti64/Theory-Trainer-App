import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { localToday } from '@/domain/srs';
import { currentStreak, totalXp } from '@/domain/streak';
import { useAppState } from '@/state/app-state';

import { AppText, ProgressBar } from './components';
import { t } from './i18n';
import { colors, space } from './theme';

/** Streak, total XP and today's goal: the three numbers that bring learners back. */
export function StatsBar() {
  const { state } = useAppState();
  const today = localToday();
  const streak = currentStreak(state.activity, today);
  const todayXp = state.activity[today]?.xp ?? 0;
  const locale = state.locale;

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <View style={styles.stat} accessibilityLabel={`${streak} ${t('streak', locale)}`}>
          <Ionicons name="flame" size={24} color={streak > 0 ? colors.red : colors.line} />
          <AppText variant="title" color={streak > 0 ? colors.asphalt : colors.muted}>
            {streak}
          </AppText>
        </View>
        <View style={styles.stat} accessibilityLabel={`${totalXp(state.activity)} XP`}>
          <Ionicons name="flash" size={22} color={colors.yellowDark} />
          <AppText variant="title">{totalXp(state.activity)}</AppText>
        </View>
      </View>
      <View style={styles.goal}>
        <AppText variant="small" color={colors.slate} style={styles.goalLabel}>
          {t('dailyGoal', locale)} {Math.min(todayXp, state.dailyGoalXp)}/{state.dailyGoalXp} XP
        </AppText>
        <ProgressBar value={todayXp / state.dailyGoalXp} color={colors.yellow} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: space.lg,
    paddingTop: space.sm,
    paddingBottom: space.md,
    gap: space.sm,
    backgroundColor: colors.background,
    borderBottomWidth: 2,
    borderBottomColor: colors.line,
  },
  row: { flexDirection: 'row', gap: space.xl },
  stat: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  goal: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  goalLabel: { minWidth: 130 },
});
