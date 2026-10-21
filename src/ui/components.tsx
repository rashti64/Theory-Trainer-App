/**
 * Shared building blocks. Raised controls use a darker bottom edge that
 * disappears on press, so taps feel physical without heavy animation.
 */
import { useState, type ReactNode } from 'react';
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

/** A selectable answer tile. */
export function OptionTile({
  label,
  selected,
  state,
  onPress,
  disabled,
  marker,
}: {
  label: string;
  selected: boolean;
  /** After checking: whether this tile is a correct or a wrong choice. */
  state?: 'correct' | 'wrong' | 'missed';
  onPress: () => void;
  disabled?: boolean;
  marker: string;
}) {
  const [pressed, setPressed] = useState(false);
  let fill: string = colors.surface;
  let border: string = colors.line;
  let edge: string = colors.line;
  if (selected) {
    fill = colors.blueTint;
    border = colors.blue;
    edge = colors.blue;
  }
  if (state === 'correct') {
    fill = colors.greenTint;
    border = colors.green;
    edge = colors.green;
  } else if (state === 'wrong') {
    fill = colors.redTint;
    border = colors.red;
    edge = colors.red;
  } else if (state === 'missed') {
    border = colors.green;
    edge = colors.green;
  }
  return (
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
            borderBottomWidth: pressed ? 2 : EDGE,
            marginTop: pressed ? EDGE - 2 : 0,
          },
        ]}>
        <View style={[styles.marker, { borderColor: selected ? colors.blue : colors.line }]}>
          <AppText variant="small" color={selected ? colors.blue : colors.muted}>
            {marker}
          </AppText>
        </View>
        <AppText style={styles.optionText}>{label}</AppText>
      </View>
    </Pressable>
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
    borderRadius: radius.md,
    paddingVertical: space.lg,
    paddingHorizontal: space.lg,
  },
  marker: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
