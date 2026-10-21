/**
 * The learning path, drawn as a road: each unit opens with a blue direction
 * sign, its lessons are stops along the road, and the next stop is marked.
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { UNITS } from '@/content/path';
import { LESSONS_PER_UNIT, pathStatus, type UnitStatus } from '@/content/path-progress';
import { useAppState } from '@/state/app-state';
import { AppText, RaisedButton } from '@/ui/components';
import { t, tr } from '@/ui/i18n';
import { StatsBar } from '@/ui/stats-bar';
import { colors, EDGE, radius, space, unitPalette } from '@/ui/theme';
import type { Locale } from '@/domain/types';

const NODE = 72;
const ROW = 104;
/** Gentle sideways sway so the road reads as a route, not a list. */
const SWAY = [0, 44, 64, 44, 0, -44, -64, -44];

export default function LearnScreen() {
  const { state, catalog } = useAppState();
  const statuses = pathStatus(UNITS, state.unitLessons);
  const hasMistakes = Object.values(state.progress).some((p) => (p?.timesWrong ?? 0) > 0 && (p?.box ?? 0) < 3);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatsBar />
      <ScrollView contentContainerStyle={styles.content}>
        {catalog.isPlaceholder ? (
          <AppText variant="small" color={colors.muted} style={styles.notice}>
            {t('placeholderNotice', state.locale)}
          </AppText>
        ) : null}

        {statuses.map((status, i) => (
          <UnitSection
            key={status.unit.id}
            status={status}
            firstStop={i * LESSONS_PER_UNIT}
            locale={state.locale}
          />
        ))}

        <View style={styles.reviewBlock}>
          <RaisedButton
            label={t('mistakes', state.locale)}
            tone="neutral"
            disabled={!hasMistakes}
            onPress={() => router.push('/lesson/review')}
          />
          {!hasMistakes ? (
            <AppText variant="small" color={colors.muted} style={styles.reviewHint}>
              {t('mistakesNone', state.locale)}
            </AppText>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function UnitSection({ status, firstStop, locale }: { status: UnitStatus; firstStop: number; locale: Locale }) {
  const { unit, unlocked, lessonsDone, completed, current } = status;
  const palette = unitPalette[unit.color];

  return (
    <View style={styles.unit}>
      {/* Direction sign: the unit's title on a road-sign panel. */}
      <View
        style={[styles.sign, { backgroundColor: unlocked ? colors.blue : colors.slate }]}
        accessibilityRole="header">
        <View style={styles.signInner}>
          <View style={styles.signText}>
            <AppText variant="title" color={colors.white}>
              {tr(unit.title, locale)}
            </AppText>
            <AppText variant="label" color={colors.white} style={styles.signSub}>
              {tr(unit.subtitle, locale)}
            </AppText>
          </View>
          <Ionicons
            name={completed ? 'trophy' : unlocked ? 'arrow-up' : 'lock-closed'}
            size={28}
            color={completed ? colors.yellow : colors.white}
          />
        </View>
      </View>

      {/* The road and its stops. */}
      <View style={[styles.road, { height: LESSONS_PER_UNIT * ROW }]}>
        <View style={styles.asphalt}>
          {Array.from({ length: LESSONS_PER_UNIT * 4 }, (_, i) => (
            <View key={i} style={styles.dash} />
          ))}
        </View>
        {Array.from({ length: LESSONS_PER_UNIT }, (_, i) => {
          const done = i < lessonsDone;
          const isNext = current && i === lessonsDone;
          const open = unlocked && (done || isNext || completed);
          const offset = SWAY[(firstStop + i) % SWAY.length];
          return (
            <View key={i} style={[styles.stopRow, { top: i * ROW, transform: [{ translateX: offset }] }]}>
              {isNext ? (
                <View style={styles.startTag}>
                  <AppText variant="label" color={colors.blue}>
                    {t('start', locale)}
                  </AppText>
                </View>
              ) : null}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${tr(unit.title, locale)} ${i + 1}`}
                accessibilityState={{ disabled: !open }}
                disabled={!open}
                onPress={() => router.push(`/lesson/${unit.id}`)}>
                {({ pressed }) => (
                  <View
                    style={[
                      styles.node,
                      {
                        backgroundColor: open ? palette.fill : colors.slateTint,
                        borderBottomColor: open ? palette.edge : colors.line,
                        borderBottomWidth: pressed ? 2 : EDGE + 2,
                        marginTop: pressed ? EDGE : 0,
                        borderColor: isNext ? colors.white : 'transparent',
                      },
                      isNext && styles.nodeNext,
                    ]}>
                    <Ionicons
                      name={done ? 'checkmark' : open ? 'car-sport' : 'lock-closed'}
                      size={30}
                      color={open ? palette.ink : colors.muted}
                    />
                  </View>
                )}
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxl * 2, gap: space.xl },
  notice: { textAlign: 'center', marginTop: space.md },
  unit: { gap: space.lg },
  sign: {
    borderRadius: radius.md,
    padding: 4,
    marginTop: space.md,
  },
  signInner: {
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: radius.md - 4,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  signText: { flex: 1 },
  signSub: { opacity: 0.85 },
  road: { alignItems: 'center' },
  asphalt: {
    position: 'absolute',
    top: -space.lg,
    bottom: -space.lg,
    width: 40,
    borderRadius: 20,
    backgroundColor: colors.slateTint,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  dash: { width: 4, height: 12, borderRadius: 2, backgroundColor: colors.white },
  stopRow: {
    position: 'absolute',
    height: ROW,
    alignItems: 'center',
    justifyContent: 'center',
  },
  node: {
    width: NODE,
    height: NODE,
    borderRadius: NODE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
  },
  nodeNext: {
    shadowColor: colors.blue,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  startTag: {
    position: 'absolute',
    top: -6,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.line,
    borderRadius: radius.sm,
    paddingHorizontal: space.md,
    paddingVertical: 2,
    zIndex: 1,
  },
  reviewBlock: { gap: space.sm, marginTop: space.xl },
  reviewHint: { textAlign: 'center' },
});
