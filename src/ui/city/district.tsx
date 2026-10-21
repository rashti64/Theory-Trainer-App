/**
 * One district of the city map: the static backdrop plus everything that
 * lives on it — traffic in both lanes, people on the sidewalk, traffic lights,
 * drifting clouds, and the lesson stops (cute cars) the learner taps.
 * All motion respects the system "reduce motion" setting.
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import type { UnitStatus } from '@/content/path-progress';
import type { Locale } from '@/domain/types';

import { AppText } from '../components';
import { t, tr } from '../i18n';
import { colors, fonts, unitPalette } from '../theme';
import { Backdrop } from './backdrop';
import {
  CONNECTOR_INSET,
  CONNECTOR_W,
  districtStops,
  ROAD_H,
  SIGN_H,
  STREET_H,
  streetY,
  UNIT_H,
} from './geometry';
import { Cloud, StepCar, TopBus, TopCar, TrafficLightSprite, Walker, type LightState } from './sprites';

const CAR_COLORS = ['#E5484D', '#1C5DB0', '#FFFFFF', '#239B48', '#F59E0B', '#8B5CF6', '#14B8A6'];
const PEOPLE = [
  { shirt: '#E5484D', skin: '#F2C8A0', hair: '#3B2A20' },
  { shirt: '#1C5DB0', skin: '#8D5B3E', hair: '#1F1A17' },
  { shirt: '#FFC20E', skin: '#E7B48F', hair: '#A0522D' },
  { shirt: '#239B48', skin: '#C68A62', hair: '#2B2B2B' },
  { shirt: '#8B5CF6', skin: '#F5D3B5', hair: '#E3B341' },
];

/** A looping 0→1 clock. Returns null when motion is reduced. */
function useLoop(durationMs: number) {
  const reduced = useReducedMotion();
  const progress = useSharedValue(0);
  useEffect(() => {
    if (reduced) return;
    progress.value = withRepeat(withTiming(1, { duration: durationMs, easing: Easing.linear }), -1, false);
  }, [durationMs, progress, reduced]);
  return progress;
}

function MovingVehicle({
  width,
  y,
  direction,
  durationMs,
  phase,
  children,
  spriteWidth,
}: {
  width: number;
  y: number;
  direction: 1 | -1;
  durationMs: number;
  phase: number;
  children: ReactNode;
  spriteWidth: number;
}) {
  const progress = useLoop(durationMs);
  const style = useAnimatedStyle(() => {
    const p = (progress.value + phase) % 1;
    const span = width + spriteWidth * 2;
    const x = direction === 1 ? -spriteWidth + p * span : width + spriteWidth - p * span - spriteWidth;
    return { transform: [{ translateX: x }, { scaleX: direction }] };
  });
  return <Animated.View style={[styles.sprite, { top: y }, style]}>{children}</Animated.View>;
}

function VerticalCar({ x, top, length, durationMs, phase, color }: { x: number; top: number; length: number; durationMs: number; phase: number; color: string }) {
  const progress = useLoop(durationMs);
  const style = useAnimatedStyle(() => {
    const p = (progress.value + phase) % 1;
    return { transform: [{ translateY: -20 + p * (length + 20) }, { rotate: '90deg' }] };
  });
  return (
    <Animated.View style={[styles.sprite, { left: x - 18, top }, style]}>
      <TopCar color={color} />
    </Animated.View>
  );
}

function Pedestrian({ width, y, direction, durationMs, phase, look }: { width: number; y: number; direction: 1 | -1; durationMs: number; phase: number; look: (typeof PEOPLE)[number] }) {
  const progress = useLoop(durationMs);
  // How many steps the walker takes while crossing the screen once.
  const steps = Math.round(width / 9);
  const body = useAnimatedStyle(() => {
    const p = (progress.value + phase) % 1;
    const x = direction === 1 ? -20 + p * (width + 40) : width + 20 - p * (width + 40);
    const stride = Math.floor(p * steps) % 2;
    return { transform: [{ translateX: x }, { translateY: stride ? -1.5 : 0 }, { scaleX: direction }] };
  });
  const legsA = useAnimatedStyle(() => ({ opacity: Math.floor(((progress.value + phase) % 1) * steps) % 2 ? 0 : 1 }));
  const legsB = useAnimatedStyle(() => ({ opacity: Math.floor(((progress.value + phase) % 1) * steps) % 2 ? 1 : 0 }));
  return (
    <Animated.View style={[styles.sprite, { top: y }, body]}>
      <Animated.View style={legsA}>
        <Walker {...look} legPhase={0} />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, legsB]}>
        <Walker {...look} legPhase={1} />
      </Animated.View>
    </Animated.View>
  );
}

function CyclingTrafficLight({ x, y, offset }: { x: number; y: number; offset: number }) {
  const reduced = useReducedMotion();
  const [state, setState] = useState<LightState>(offset % 2 ? 'red' : 'green');
  useEffect(() => {
    if (reduced) return;
    const order: LightState[] = ['green', 'yellow', 'red', 'red'];
    let i = offset % order.length;
    const id = setInterval(() => {
      i = (i + 1) % order.length;
      setState(order[i]);
    }, 1800);
    return () => clearInterval(id);
  }, [offset, reduced]);
  return (
    <View style={[styles.sprite, { left: x, top: y }]} pointerEvents="none">
      <TrafficLightSprite state={state} />
    </View>
  );
}

function DriftingCloud({ width, y, durationMs, phase, scale }: { width: number; y: number; durationMs: number; phase: number; scale: number }) {
  const progress = useLoop(durationMs);
  const style = useAnimatedStyle(() => {
    const p = (progress.value + phase) % 1;
    return { transform: [{ translateX: -80 + p * (width + 160) }, { scale }] };
  });
  return (
    <Animated.View style={[styles.sprite, { top: y }, style]} pointerEvents="none">
      <Cloud />
    </Animated.View>
  );
}

/** Town-entry sign (yellow Ortstafel) with the unit's name, on two posts. */
function TownSign({ status, locale, left }: { status: UnitStatus; locale: Locale; left: number }) {
  return (
    <View style={[styles.signWrap, { left }]} accessibilityRole="header" pointerEvents="none">
      <View>
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
        <View style={styles.signPosts}>
          <View style={styles.post} />
          <View style={styles.post} />
        </View>
      </View>
    </View>
  );
}

function LessonStop({
  x,
  y,
  facing,
  state,
  color,
  label,
  startLabel,
  onPress,
}: {
  x: number;
  y: number;
  facing: 1 | -1;
  state: 'done' | 'next' | 'open' | 'locked';
  color: keyof typeof unitPalette;
  label: string;
  startLabel: string;
  onPress: () => void;
}) {
  const reduced = useReducedMotion();
  const bounce = useSharedValue(0);
  const ring = useSharedValue(0);
  const isNext = state === 'next';

  useEffect(() => {
    if (!isNext || reduced) return;
    bounce.value = withRepeat(
      withSequence(
        withTiming(-7, { duration: 420, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 420, easing: Easing.in(Easing.quad) }),
      ),
      -1,
      false,
    );
    ring.value = withRepeat(withTiming(1, { duration: 1600, easing: Easing.out(Easing.quad) }), -1, false);
  }, [bounce, isNext, reduced, ring]);

  const bounceStyle = useAnimatedStyle(() => ({ transform: [{ translateY: bounce.value }] }));
  const ringStyle = useAnimatedStyle(() => ({
    opacity: 0.55 * (1 - ring.value),
    transform: [{ scale: 1 + ring.value * 0.6 }],
  }));

  const palette = unitPalette[color];
  const locked = state === 'locked';
  const size = isNext ? 78 : 68;

  return (
    <View style={[styles.stop, { left: x - 50, top: y - 50 }]}>
      {isNext ? <Animated.View style={[styles.ring, { width: size, height: size, borderRadius: size / 2 }, ringStyle]} /> : null}
      <Animated.View style={[styles.stopInner, bounceStyle]}>
        {isNext ? (
          <View style={styles.bubble}>
            <AppText style={styles.bubbleText}>{startLabel}</AppText>
            <View style={styles.bubbleTail} />
          </View>
        ) : null}
        <Pressable
          onPress={onPress}
          disabled={locked}
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityState={{ disabled: locked }}>
          {({ pressed }) => (
            <View style={{ transform: [{ translateY: pressed ? 4 : 0 }] }}>
              <View
                style={[
                  styles.disc,
                  {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: locked ? '#AEB7C0' : palette.fill,
                    shadowColor: locked ? '#7D8790' : palette.edge,
                  },
                ]}>
                <View style={{ transform: [{ scaleX: facing }] }}>
                  <StepCar body={locked ? '#E3E7EB' : '#FFFFFF'} eyes={!locked} size={isNext ? 52 : 46} />
                </View>
              </View>
              {state === 'done' ? (
                <View style={[styles.corner, { backgroundColor: colors.green }]}>
                  <Ionicons name="checkmark" size={15} color={colors.white} />
                </View>
              ) : null}
              {locked ? (
                <View style={[styles.corner, { backgroundColor: colors.slate }]}>
                  <Ionicons name="lock-closed" size={12} color={colors.white} />
                </View>
              ) : null}
            </View>
          )}
        </Pressable>
      </Animated.View>
    </View>
  );
}

export function District({
  index,
  status,
  width,
  first,
  last,
  locale,
  onOpenLesson,
}: {
  index: number;
  status: UnitStatus;
  width: number;
  first: boolean;
  last: boolean;
  locale: Locale;
  onOpenLesson: () => void;
}) {
  const stops = districtStops(width);
  const lane = ROAD_H / 4;
  const carSpeed = 55; // px per second
  const crossMs = ((width + 80) / carSpeed) * 1000;
  const walkMs = ((width + 40) / 16) * 1000;

  return (
    <View style={{ width, height: UNIT_H }}>
      <Backdrop width={width} seed={index + 3} first={first} last={last} dim={!status.unlocked} />

      {first ? (
        <>
          <DriftingCloud width={width} y={8} durationMs={60000} phase={0.15} scale={0.9} />
          <DriftingCloud width={width} y={44} durationMs={80000} phase={0.6} scale={0.7} />
        </>
      ) : null}

      <TownSign status={status} locale={locale} left={first ? 16 : CONNECTOR_INSET + CONNECTOR_W / 2 + 22} />

      {[0, 1].map((row) => {
        const y = streetY(row);
        return (
          <View key={row} style={StyleSheet.absoluteFill} pointerEvents="none">
            {/* People on the upper sidewalk, in front of the shops. */}
            <Pedestrian width={width} y={y - STREET_H / 2 - 18} direction={1} durationMs={walkMs} phase={(index * 0.37 + row * 0.21) % 1} look={PEOPLE[(index + row) % PEOPLE.length]} />
            <Pedestrian width={width} y={y - STREET_H / 2 - 16} direction={-1} durationMs={walkMs * 1.2} phase={(index * 0.53 + row * 0.4 + 0.5) % 1} look={PEOPLE[(index + row + 2) % PEOPLE.length]} />
            {/* Right-hand traffic: eastbound in the lower lane, westbound in the upper lane. */}
            <MovingVehicle width={width} y={y + lane - 10} direction={1} durationMs={crossMs} phase={(index * 0.29 + row * 0.5) % 1} spriteWidth={36}>
              <TopCar color={CAR_COLORS[(index + row) % CAR_COLORS.length]} />
            </MovingVehicle>
            <MovingVehicle width={width} y={y + lane - 10} direction={1} durationMs={crossMs} phase={(index * 0.29 + row * 0.5 + 0.55) % 1} spriteWidth={36}>
              <TopCar color={CAR_COLORS[(index + row + 3) % CAR_COLORS.length]} />
            </MovingVehicle>
            <MovingVehicle width={width} y={y - lane - 10} direction={-1} durationMs={crossMs * 1.15} phase={(index * 0.41 + row * 0.3) % 1} spriteWidth={36}>
              <TopCar color={CAR_COLORS[(index + row + 5) % CAR_COLORS.length]} />
            </MovingVehicle>
            {row === 1 ? (
              <MovingVehicle width={width} y={y - lane - 11} direction={-1} durationMs={crossMs * 1.6} phase={(index * 0.17 + 0.7) % 1} spriteWidth={64}>
                <TopBus />
              </MovingVehicle>
            ) : null}
          </View>
        );
      })}

      {/* A car turning down the side road between the two streets. */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <VerticalCar
          x={width - CONNECTOR_INSET + CONNECTOR_W / 4}
          top={streetY(0)}
          length={streetY(1) - streetY(0)}
          durationMs={5200}
          phase={(index * 0.33) % 1}
          color={CAR_COLORS[(index + 4) % CAR_COLORS.length]}
        />
      </View>

      <CyclingTrafficLight x={width - CONNECTOR_INSET - CONNECTOR_W / 2 - 30} y={streetY(0) + ROAD_H / 2 - 4} offset={index} />
      <CyclingTrafficLight x={CONNECTOR_INSET + CONNECTOR_W / 2 + 12} y={streetY(1) + ROAD_H / 2 - 4} offset={index + 1} />

      {stops.map((stop) => {
        const done = stop.index < status.lessonsDone;
        const isNext = status.current && stop.index === status.lessonsDone;
        const open = status.unlocked && (done || isNext || status.completed);
        const state = isNext ? 'next' : done ? 'done' : open ? 'open' : 'locked';
        return (
          <LessonStop
            key={stop.index}
            x={stop.x}
            y={stop.y}
            facing={stop.row % 2 === 0 ? 1 : -1}
            state={state}
            color={status.unit.color}
            label={`${tr(status.unit.title, locale)}, ${stop.index + 1}`}
            startLabel={t('start', locale)}
            onPress={onOpenLesson}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  sprite: { position: 'absolute', left: 0 },
  signWrap: { position: 'absolute', top: 12, right: 16, height: SIGN_H - 12, alignItems: 'center' },
  signPosts: { flexDirection: 'row', justifyContent: 'space-around', marginTop: -2 },
  post: { width: 5, height: SIGN_H - 12 - 66, backgroundColor: '#8D98A3', borderRadius: 2 },
  sign: {
    backgroundColor: '#FFD200',
    borderRadius: 10,
    padding: 4,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  signLocked: { backgroundColor: '#E6D27A' },
  signInner: {
    borderWidth: 2.5,
    borderColor: '#1B1B1B',
    borderRadius: 7,
    paddingHorizontal: 22,
    paddingVertical: 4,
    alignItems: 'center',
  },
  signTitle: { fontFamily: fonts.black, fontSize: 22, lineHeight: 26, color: '#1B1B1B' },
  signSub: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 16, color: '#1B1B1B' },
  signBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  stop: { position: 'absolute', width: 100, height: 100, alignItems: 'center', justifyContent: 'center' },
  stopInner: { alignItems: 'center' },
  ring: { position: 'absolute', borderWidth: 4, borderColor: colors.white },
  disc: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.white,
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  corner: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  bubble: {
    position: 'absolute',
    bottom: '100%',
    marginBottom: 6,
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: colors.blue,
  },
  bubbleText: { fontFamily: fonts.black, fontSize: 15, lineHeight: 19, color: colors.blue },
  bubbleTail: {
    position: 'absolute',
    bottom: -7,
    alignSelf: 'center',
    width: 12,
    height: 12,
    backgroundColor: colors.white,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.blue,
    transform: [{ rotate: '45deg' }],
  },
});
