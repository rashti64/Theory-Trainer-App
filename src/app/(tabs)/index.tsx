/**
 * The learning path as a living city: each unit is a district behind a
 * town-entry sign, lessons are cars waiting along the route, and the city
 * moves around them — traffic, people, traffic lights, clouds.
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { UNITS } from '@/content/path';
import { pathStatus } from '@/content/path-progress';
import { useAppState } from '@/state/app-state';
import { District } from '@/ui/city/district';
import { AppText } from '@/ui/components';
import { t } from '@/ui/i18n';
import { StatsBar } from '@/ui/stats-bar';
import { colors, fonts, radius, space } from '@/ui/theme';

const MAX_MAP_WIDTH = 520;

export default function LearnScreen() {
  const { state, catalog } = useAppState();
  const { width: screenWidth } = useWindowDimensions();
  const width = Math.min(screenWidth, MAX_MAP_WIDTH);
  const statuses = pathStatus(UNITS, state.unitLessons);
  const hasMistakes = Object.values(state.progress).some((p) => (p?.timesWrong ?? 0) > 0 && (p?.box ?? 0) < 3);
  const locale = state.locale;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatsBar />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={{ width }}>
          {statuses.map((status, i) => (
            <District
              key={status.unit.id}
              index={i}
              status={status}
              width={width}
              first={i === 0}
              last={i === statuses.length - 1}
              locale={locale}
              onOpenLesson={() => router.push(`/lesson/${status.unit.id}`)}
            />
          ))}

          {/* The repair shop: where mistakes get fixed. */}
          <View style={styles.garageArea}>
            <Pressable
              onPress={() => router.push('/lesson/review')}
              disabled={!hasMistakes}
              accessibilityRole="button"
              accessibilityState={{ disabled: !hasMistakes }}>
              {({ pressed }) => (
                <View style={[styles.garage, pressed && styles.garagePressed, !hasMistakes && styles.garageIdle]}>
                  <View style={styles.garageRoof}>
                    <AppText style={styles.garageName}>{t('mistakes', locale)}</AppText>
                  </View>
                  <View style={styles.garageBody}>
                    <View style={styles.garageDoor}>
                      {[0, 1, 2, 3].map((i) => (
                        <View key={i} style={styles.doorSlat} />
                      ))}
                    </View>
                    <Ionicons name="construct" size={34} color={hasMistakes ? colors.blue : colors.muted} />
                  </View>
                </View>
              )}
            </Pressable>
            {!hasMistakes ? (
              <AppText variant="small" color={colors.slateDark} style={styles.garageHint}>
                {t('mistakesNone', locale)}
              </AppText>
            ) : null}
          </View>

          {catalog.isPlaceholder ? (
            <AppText variant="small" color={colors.slateDark} style={styles.notice}>
              {t('placeholderNotice', locale)}
            </AppText>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#CBE9AE' },
  content: { alignItems: 'center', paddingBottom: space.xxl },
  garageArea: { paddingHorizontal: space.lg, paddingTop: space.lg, gap: space.sm, alignItems: 'center' },
  garage: { width: 260, alignItems: 'center' },
  garagePressed: { transform: [{ translateY: 3 }] },
  garageIdle: { opacity: 0.7 },
  garageRoof: {
    backgroundColor: colors.red,
    alignSelf: 'stretch',
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: radius.md,
    paddingVertical: space.sm,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: colors.redDark,
  },
  garageName: { fontFamily: fonts.black, fontSize: 18, lineHeight: 22, color: colors.white },
  garageBody: {
    alignSelf: 'stretch',
    backgroundColor: '#F3E6CF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: space.md,
    borderBottomLeftRadius: radius.sm,
    borderBottomRightRadius: radius.sm,
  },
  garageDoor: { width: 120, height: 64, backgroundColor: '#C7CED5', borderRadius: 4, padding: 6, gap: 6 },
  doorSlat: { flex: 1, backgroundColor: '#AEB7C0', borderRadius: 2 },
  garageHint: { textAlign: 'center', maxWidth: 300 },
  notice: { textAlign: 'center', paddingHorizontal: space.xl, marginTop: space.lg },
});
