/**
 * Number answers: a dashboard display and a chunky keypad, so the system
 * keyboard never covers the question.
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from './components';
import { applyKey, NUMBER_KEYS as KEYS } from './number-input';
import { colors, fonts, radius, space } from './theme';

export function NumberPad({
  text,
  unit,
  onChange,
  disabled,
  state,
  deleteLabel,
}: {
  text: string;
  unit: string;
  onChange: (text: string) => void;
  disabled: boolean;
  state?: 'correct' | 'wrong';
  deleteLabel: string;
}) {
  const border = state === 'correct' ? colors.green : state === 'wrong' ? colors.red : '#11161A';
  return (
    <View style={styles.wrap}>
      <View style={[styles.display, { borderColor: border }]} accessibilityLiveRegion="polite">
        <AppText style={styles.digits}>{text || '0'}</AppText>
        <AppText style={styles.unit}>{unit}</AppText>
      </View>
      <View style={styles.keys}>
        {KEYS.map((key) => (
          <Pressable
            key={key}
            disabled={disabled}
            onPress={() => onChange(applyKey(text, key))}
            accessibilityRole="button"
            accessibilityLabel={key === 'del' ? deleteLabel : key}
            style={styles.keyWrap}>
            {({ pressed }) => (
              <View
                style={[
                  styles.key,
                  key === 'del' && styles.keyDelete,
                  disabled && styles.keyDisabled,
                  { borderBottomWidth: pressed ? 2 : 5, marginTop: pressed ? 3 : 0 },
                ]}>
                {key === 'del' ? (
                  <Ionicons name="backspace" size={24} color={colors.red} />
                ) : (
                  <AppText style={styles.keyText}>{key}</AppText>
                )}
              </View>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.md },
  display: {
    backgroundColor: '#1F2A33',
    borderRadius: radius.lg,
    borderWidth: 4,
    paddingHorizontal: space.xl,
    paddingVertical: space.md,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: space.sm,
  },
  digits: { fontFamily: fonts.black, fontSize: 48, lineHeight: 56, color: '#FFC20E', letterSpacing: 2 },
  unit: { fontFamily: fonts.bold, fontSize: 22, lineHeight: 28, color: '#C9D3DC' },
  keys: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, justifyContent: 'space-between' },
  keyWrap: { width: '31.5%' },
  key: {
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.line,
    borderBottomColor: '#B9C1C9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyDelete: { backgroundColor: colors.redTint, borderColor: '#F3C5C7', borderBottomColor: '#E79A9E' },
  keyDisabled: { opacity: 0.5 },
  keyText: { fontFamily: fonts.black, fontSize: 24, lineHeight: 28, color: colors.asphalt },
});
