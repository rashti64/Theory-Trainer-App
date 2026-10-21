/**
 * The learning path as a living 3D city. Each unit is a district behind a
 * town-entry sign; lessons are cars on floating pads along the route; the
 * mascot waits at the next lesson; the light follows the real time of day.
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { UNITS } from '@/content/path';
import { pathStatus } from '@/content/path-progress';
import { useAppState } from '@/state/app-state';
import { CityMap } from '@/ui/city3d/city-map';
import { t } from '@/ui/i18n';
import { StatsBar } from '@/ui/stats-bar';
import { colors, space } from '@/ui/theme';

export default function LearnScreen() {
  const { state } = useAppState();
  const statuses = pathStatus(UNITS, state.unitLessons);
  const mistakes = Object.values(state.progress).filter((p) => (p?.timesWrong ?? 0) > 0 && (p?.box ?? 0) < 3).length;
  const locale = state.locale;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatsBar />
      <View style={styles.map}>
        <CityMap statuses={statuses} locale={locale} onOpenLesson={(id) => router.push(`/lesson/${id}`)} />
        {/* The repair shop: where mistakes get fixed. */}
        <Pressable
          onPress={() => router.push('/lesson/review')}
          disabled={mistakes === 0}
          accessibilityRole="button"
          accessibilityLabel={t('mistakes', locale)}
          accessibilityHint={mistakes === 0 ? t('mistakesNone', locale) : undefined}
          style={[styles.garage, mistakes === 0 && styles.garageIdle]}>
          <Ionicons name="construct" size={24} color={colors.white} />
          {mistakes > 0 ? (
            <View style={styles.count}>
              <Ionicons name="alert" size={12} color={colors.white} />
            </View>
          ) : null}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  map: { flex: 1 },
  garage: {
    position: 'absolute',
    left: space.lg,
    bottom: space.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.red,
    borderBottomWidth: 5,
    borderBottomColor: colors.redDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  garageIdle: { backgroundColor: '#AEB7C0', borderBottomColor: '#8F99A3' },
  count: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.orange,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
