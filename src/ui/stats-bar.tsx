import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { localToday } from '@/domain/srs';
import { currentStreak, totalXp } from '@/domain/streak';
import { useAppState } from '@/state/app-state';

import { AppText } from './components';
import { t } from './i18n';
import { colors, fonts, radius, space } from './theme';

/**
 * Streak, XP and today's goal shown as a fuel gauge: the three numbers that
 * bring learners back.
 */
export function StatsBar() {
  const { state } = useAppState();
  const today = localToday();
  const streak = currentStreak(state.activity, today);
  const todayXp = state.activity[today]?.xp ?? 0;
  const fill = Math.min(1, todayXp / state.dailyGoalXp);
  const locale = state.locale;

  return (
    <View style={styles.wrap}>
      <View style={[styles.chip, { backgroundColor: streak > 0 ? '#FFE3D6' : colors.slateTint }]} accessibilityLabel={`${streak} ${t('streak', locale)}`}>
        <Ionicons name="flame" size={22} color={streak > 0 ? '#F2541B' : colors.muted} />
        <AppText style={styles.chipNumber}>{streak}</AppText>
      </View>
      <View style={[styles.chip, { backgroundColor: colors.yellowTint }]} accessibilityLabel={`${totalXp(state.activity)} XP`}>
        <Ionicons name="flash" size={20} color={colors.yellowDark} />
        <AppText style={styles.chipNumber}>{totalXp(state.activity)}</AppText>
      </View>
      <View
        style={[styles.chip, styles.tank]}
        accessibilityLabel={`${t('dailyGoal', locale)} ${Math.min(todayXp, state.dailyGoalXp)} / ${state.dailyGoalXp} XP`}>
        <Ionicons name="speedometer" size={20} color={fill >= 1 ? colors.green : colors.blue} />
        <View style={styles.gauge}>
          <View style={[styles.gaugeFill, { width: `${fill * 100}%`, backgroundColor: fill >= 1 ? colors.green : colors.blue }]} />
          {[0.25, 0.5, 0.75].map((m) => (
            <View key={m} style={[styles.tick, { left: `${m * 100}%` }]} />
          ))}
        </View>
        <AppText style={styles.goalText}>
          {Math.min(todayXp, state.dailyGoalXp)}/{state.dailyGoalXp}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 3,
    borderBottomColor: '#B4DD93',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: space.md,
    paddingVertical: 6,
    borderRadius: radius.round,
  },
  chipNumber: { fontFamily: fonts.black, fontSize: 18, lineHeight: 22, color: colors.asphalt },
  tank: { flex: 1, backgroundColor: colors.blueTint },
  gauge: { flex: 1, height: 12, borderRadius: 6, backgroundColor: colors.white, overflow: 'hidden' },
  gaugeFill: { height: '100%', borderRadius: 6 },
  tick: { position: 'absolute', top: 2, bottom: 2, width: 1.5, backgroundColor: 'rgba(0,0,0,0.12)' },
  goalText: { fontFamily: fonts.bold, fontSize: 13, lineHeight: 16, color: colors.asphalt },
});
