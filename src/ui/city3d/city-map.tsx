/**
 * The 3D learning map. The city renders in WebGL; everything you read or tap
 * (town signs, lesson buttons, badges, popups) lives in a native layer on top,
 * pinned to the 3D positions, so text stays crisp and accessible.
 * Drag to travel along the route; the camera glides with momentum.
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { Pressable, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import type { UnitStatus } from '@/content/path-progress';
import type { Locale } from '@/domain/types';

import { AppText, RaisedButton } from '../components';
import { t, tr } from '../i18n';
import { colors, fonts, radius, space } from '../theme';
import { CameraRig, projectPoint } from './camera-rig';
import { Canvas } from './r3f';
import { CityScene, type DistrictInfo, type PadState } from './scene';
import { lightingFor, type Lighting } from './time-of-day';
import { signPosition, stops, type Stop3D } from './world';

const PAD_Y = 2.5;

type Selection = { status: UnitStatus; stop: Stop3D; state: PadState } | null;

export function CityMap({
  statuses,
  locale,
  onOpenLesson,
  lighting: lightingOverride,
}: {
  statuses: UnitStatus[];
  locale: Locale;
  onOpenLesson: (unitId: string) => void;
  lighting?: Lighting;
}) {
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState<Selection>(null);
  const [lighting] = useState(() => lightingOverride ?? lightingFor());

  const districts: DistrictInfo[] = useMemo(
    () =>
      statuses.map((s) => ({
        color: s.unit.color,
        pads: [0, 1, 2, 3].map((i): PadState => {
          if (s.current && i === s.lessonsDone) return 'next';
          if (i < s.lessonsDone) return 'done';
          return s.unlocked && s.completed ? 'open' : 'locked';
        }),
      })),
    [statuses],
  );

  const allStops = useMemo(() => statuses.flatMap((_, u) => stops(u)), [statuses]);
  const currentStop = useMemo(() => {
    const u = statuses.findIndex((s) => s.current);
    return u >= 0 ? stops(u)[statuses[u].lessonsDone] : allStops[0];
  }, [allStops, statuses]);

  const [rig] = useState(() => new CameraRig(currentStop.z + 3));
  const snap = useSyncExternalStore(rig.subscribe, rig.getSnapshot, rig.getSnapshot);

  useEffect(() => rig.setReduced(reduced), [reduced, rig]);
  useEffect(() => rig.setLimits(2, allStops[allStops.length - 1].z + 4), [allStops, rig]);
  useEffect(() => {
    rig.setOnDragStart(() => setSelected(null));
    return () => rig.dispose();
  }, [rig]);

  const current = projectPoint(snap, currentStop.x, PAD_Y, currentStop.z);
  const currentOffscreen = !current.visible || current.y < 60 || current.y > snap.height - 60;

  return (
    <View style={styles.wrap} onLayout={(e: LayoutChangeEvent) => rig.setSize(e.nativeEvent.layout.width, e.nativeEvent.layout.height)}>
      {snap.width > 0 ? (
        <Canvas shadows flat camera={rig.camera} dpr={[1, 2]} gl={{ antialias: true }} style={StyleSheet.absoluteFill}>
          <CityScene districts={districts} lighting={lighting} camera={rig.camera} motion={!reduced} />
        </Canvas>
      ) : null}

      {/* Native layer: signs, lesson buttons and badges pinned to the 3D world. */}
      <View style={StyleSheet.absoluteFill} {...rig.pan.panHandlers}>
        {statuses.map((status, u) => {
          const pos = signPosition(u);
          const p = projectPoint(snap, pos.x, 2.3, pos.z);
          if (!p.visible) return null;
          const k = Math.max(0.5, Math.min(1, p.scale / 26));
          return (
            <View key={status.unit.id} pointerEvents="none" style={[styles.signAnchor, { left: p.x, top: p.y, transform: [{ translateX: '-50%' }, { translateY: '-100%' }, { scale: k }] }]}>
              <View style={[styles.sign, !status.unlocked && styles.signLocked]}>
                <View style={styles.signInner}>
                  <AppText style={styles.signTitle} numberOfLines={1}>
                    {tr(status.unit.title, locale)}
                  </AppText>
                  <AppText style={styles.signSub} numberOfLines={1}>
                    {tr(status.unit.subtitle, locale)}
                  </AppText>
                </View>
                {status.completed || !status.unlocked ? (
                  <View style={[styles.signBadge, { backgroundColor: status.completed ? colors.green : colors.slate }]}>
                    <Ionicons name={status.completed ? 'trophy' : 'lock-closed'} size={14} color={colors.white} />
                  </View>
                ) : null}
              </View>
            </View>
          );
        })}

        {statuses.flatMap((status, u) =>
          stops(u).map((stop) => {
            const state = districts[u].pads[stop.index];
            const p = projectPoint(snap, stop.x, PAD_Y, stop.z);
            if (!p.visible) return null;
            const r = Math.max(26, p.scale * 1.8);
            const top = projectPoint(snap, stop.x, PAD_Y + 3.4, stop.z);
            return (
              <View key={`${u}-${stop.index}`} style={StyleSheet.absoluteFill} pointerEvents="box-none">
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${tr(status.unit.title, locale)}, ${stop.index + 1}`}
                  onPress={() => setSelected({ status, stop, state })}
                  style={[styles.hit, { left: p.x - r, top: p.y - r, width: r * 2, height: r * 2, borderRadius: r }]}
                />
                {state === 'next' ? (
                  <View pointerEvents="none" style={[styles.bubble, { left: top.x, top: top.y }]}>
                    <AppText style={styles.bubbleText}>{t('start', locale)}</AppText>
                    <View style={styles.bubbleTail} />
                  </View>
                ) : null}
                {state === 'done' || state === 'locked' ? (
                  <View
                    pointerEvents="none"
                    style={[styles.badge, { left: p.x + r * 0.55, top: p.y - r * 1.25, backgroundColor: state === 'done' ? colors.green : colors.slate }]}>
                    <Ionicons name={state === 'done' ? 'checkmark' : 'lock-closed'} size={14} color={colors.white} />
                  </View>
                ) : null}
              </View>
            );
          }),
        )}
      </View>

      {currentOffscreen ? (
        <Pressable onPress={() => rig.glideTo(currentStop.z + 3)} accessibilityRole="button" accessibilityLabel={t('jumpToLesson', locale)} style={styles.fab}>
          <Ionicons name={current.y < snap.height / 2 ? 'arrow-up' : 'arrow-down'} size={26} color={colors.blue} />
        </Pressable>
      ) : null}

      {selected ? (
        <LessonCard
          selection={selected}
          locale={locale}
          onClose={() => setSelected(null)}
          onStart={() => {
            setSelected(null);
            onOpenLesson(selected.status.unit.id);
          }}
        />
      ) : null}
    </View>
  );
}

/** Duolingo-style popover: what the lesson is about and a big start button. */
function LessonCard({
  selection,
  locale,
  onStart,
  onClose,
}: {
  selection: NonNullable<Selection>;
  locale: Locale;
  onStart: () => void;
  onClose: () => void;
}) {
  const { status, stop, state } = selection;
  const locked = state === 'locked';
  return (
    <View style={styles.cardWrap} pointerEvents="box-none">
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel={t('close', locale)} />
      <View style={[styles.card, locked && styles.cardLocked]}>
        <AppText style={styles.cardTitle}>{tr(status.unit.title, locale)}</AppText>
        <AppText style={styles.cardSub}>
          {locked ? t('lockedHint', locale) : t('lessonOf', locale, { n: stop.index + 1, total: 4 })}
        </AppText>
        {!locked ? (
          <RaisedButton
            label={state === 'done' ? t('practiseAgain', locale) : t('start', locale)}
            tone={state === 'done' ? 'reward' : 'light'}
            onPress={onStart}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, overflow: 'hidden', backgroundColor: '#BFE6FF' },
  signAnchor: { position: 'absolute' },
  sign: {
    backgroundColor: '#FFD200',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  signLocked: { backgroundColor: '#E8D68A' },
  signInner: { borderWidth: 3, borderColor: '#1B1B1B', borderRadius: 8, paddingHorizontal: 18, paddingVertical: 4, alignItems: 'center' },
  signTitle: { fontFamily: fonts.black, fontSize: 20, lineHeight: 24, color: '#1B1B1B' },
  signSub: { fontFamily: fonts.bold, fontSize: 12, lineHeight: 15, color: '#1B1B1B' },
  signBadge: {
    position: 'absolute',
    top: -9,
    right: -9,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: colors.white,
  },
  hit: { position: 'absolute' },
  bubble: {
    position: 'absolute',
    transform: [{ translateX: '-50%' }, { translateY: '-100%' }],
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 2.5,
    borderColor: colors.line,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  bubbleText: { fontFamily: fonts.black, fontSize: 16, lineHeight: 20, color: colors.blue },
  bubbleTail: {
    position: 'absolute',
    bottom: -8,
    alignSelf: 'center',
    width: 13,
    height: 13,
    backgroundColor: colors.white,
    borderRightWidth: 2.5,
    borderBottomWidth: 2.5,
    borderColor: colors.line,
    transform: [{ rotate: '45deg' }],
  },
  badge: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: colors.white,
  },
  fab: {
    position: 'absolute',
    right: space.lg,
    bottom: space.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.white,
    borderWidth: 2.5,
    borderColor: colors.line,
    borderBottomWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'flex-end', padding: space.lg },
  card: {
    backgroundColor: colors.blue,
    borderRadius: radius.lg,
    padding: space.lg,
    gap: space.sm,
    borderBottomWidth: 6,
    borderBottomColor: colors.blueDark,
  },
  cardLocked: { backgroundColor: colors.slate, borderBottomColor: colors.slateDark },
  cardTitle: { fontFamily: fonts.black, fontSize: 22, lineHeight: 27, color: colors.white },
  cardSub: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 20, color: 'rgba(255,255,255,0.9)', marginBottom: space.xs },
});
