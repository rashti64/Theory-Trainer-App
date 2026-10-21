/**
 * Shared building blocks. Raised controls use a darker bottom edge that
 * disappears on press, so taps feel physical without heavy animation.
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState, type ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type TextProps,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { SignMarker } from './sign-marker';
import { colors, EDGE, radius, space, type } from './theme';

type TextVariant = keyof typeof type;

export function AppText({
  variant = 'body',
  color = colors.asphalt,
  style,
  ...rest
}: TextProps & { variant?: TextVariant; color?: string }) {
  return <Text {...rest} style={[type[variant], { color }, style]} />;
}

type ButtonTone = 'primary' | 'success' | 'danger' | 'neutral' | 'reward';

const tones: Record<ButtonTone, { fill: string; edge: string; ink: string; border?: string }> = {
  primary: { fill: colors.blue, edge: colors.blueDark, ink: colors.white },
  success: { fill: colors.green, edge: colors.greenDark, ink: colors.white },
  danger: { fill: colors.red, edge: colors.redDark, ink: colors.white },
  reward: { fill: colors.yellow, edge: colors.yellowDark, ink: colors.asphalt },
  neutral: { fill: colors.surface, edge: colors.line, ink: colors.asphalt, border: colors.line },
};

export function RaisedButton({
  label,
  tone = 'primary',
  disabled,
  style,
  ...rest
}: Omit<PressableProps, 'style' | 'children'> & {
  label: string;
  tone?: ButtonTone;
  style?: StyleProp<ViewStyle>;
}) {
  const t = disabled
    ? { fill: colors.slateTint, edge: colors.line, ink: colors.muted, border: undefined }
    : tones[tone];
  return (
    <Pressable accessibilityRole="button" disabled={disabled} {...rest} style={style}>
      {({ pressed }) => (
        <View
          style={[
            styles.button,
            {
              backgroundColor: t.fill,
              borderColor: t.border ?? t.fill,
              borderBottomColor: t.edge,
              borderBottomWidth: pressed ? 2 : EDGE,
              marginTop: pressed ? EDGE - 2 : 0,
            },
          ]}>
          <AppText variant="label" color={t.ink} style={styles.buttonLabel}>
            {label}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

export function ProgressBar({ value, color = colors.green }: { value: number; color?: string }) {
  const clamped = Math.max(0, Math.min(1, value));
  return (
    <View
      style={styles.track}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}>
      <View style={[styles.fill, { width: `${clamped * 100}%`, backgroundColor: color }]} />
    </View>
  );
}

/** A selectable answer tile with a road-sign letter. Pops when chosen, shakes when wrong. */
export function OptionTile({
  label,
  selected,
  state,
  onPress,
  disabled,
  index,
}: {
  label: string;
  selected: boolean;
  /** After checking: whether this tile is a correct or a wrong choice. */
  state?: 'correct' | 'wrong' | 'missed';
  onPress: () => void;
  disabled?: boolean;
  index: number;
}) {
  const reduced = useReducedMotion();
  const scale = useSharedValue(1);
  const shake = useSharedValue(0);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (reduced || !selected) return;
    scale.value = withSequence(withTiming(1.04, { duration: 90 }), withSpring(1, { damping: 8 }));
  }, [reduced, scale, selected]);

  useEffect(() => {
    if (reduced || state !== 'wrong') return;
    shake.value = withSequence(
      withTiming(-8, { duration: 50 }),
      withTiming(8, { duration: 70 }),
      withTiming(-5, { duration: 60 }),
      withTiming(0, { duration: 50 }),
    );
  }, [reduced, shake, state]);

  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }, { translateX: shake.value }] }));

  let fill: string = colors.surface;
  let border: string = colors.line;
  let edge: string = '#C9D0D7';
  if (selected) {
    fill = colors.blueTint;
    border = colors.blue;
    edge = colors.blueDark;
  }
  if (state === 'correct') {
    fill = colors.greenTint;
    border = colors.green;
    edge = colors.greenDark;
  } else if (state === 'wrong') {
    fill = colors.redTint;
    border = colors.red;
    edge = colors.redDark;
  } else if (state === 'missed') {
    fill = '#F1FBF3';
    border = colors.green;
    edge = colors.green;
  }
  return (
    <Animated.View style={anim}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: selected, disabled }}
        onPress={onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        disabled={disabled}>
        <View
          style={[
            styles.option,
            {
              backgroundColor: fill,
              borderColor: border,
              borderBottomColor: edge,
              borderBottomWidth: pressed ? 2 : EDGE + 1,
              marginTop: pressed ? EDGE - 1 : 0,
            },
          ]}>
          <SignMarker index={index} letter={String.fromCharCode(65 + index)} />
          <AppText variant="bodyStrong" style={styles.optionText}>
            {label}
          </AppText>
          {state === 'correct' || state === 'missed' ? (
            <Ionicons name="checkmark-circle" size={26} color={colors.green} />
          ) : state === 'wrong' ? (
            <Ionicons name="close-circle" size={26} color={colors.red} />
          ) : (
            <View style={[styles.check, selected && styles.checkOn]}>
              {selected ? <Ionicons name="checkmark" size={16} color={colors.white} /> : null}
            </View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

/** Small pill: shows a question's error-point weight. 5-point questions are red, like a stop sign. */
export function PointsBadge({ points, label }: { points: number; label: string }) {
  const critical = points === 5;
  return (
    <View style={[styles.badge, { backgroundColor: critical ? colors.redTint : colors.slateTint }]}>
      <AppText variant="small" color={critical ? colors.redDark : colors.slateDark}>
        {points} {label}
      </AppText>
    </View>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.xl,
  },
  buttonLabel: { fontSize: 17, letterSpacing: 0.3 },
  track: {
    height: 14,
    borderRadius: radius.round,
    backgroundColor: colors.slateTint,
    overflow: 'hidden',
    flex: 1,
  },
  fill: { height: '100%', borderRadius: radius.round },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    borderWidth: 2,
    borderRadius: radius.lg,
    paddingVertical: space.md,
    paddingHorizontal: space.md,
    minHeight: 68,
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2.5,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: { backgroundColor: colors.blue, borderColor: colors.blue },
  optionText: { flex: 1 },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.round,
    paddingHorizontal: space.md,
    paddingVertical: 3,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.line,
    padding: space.lg,
  },
});
