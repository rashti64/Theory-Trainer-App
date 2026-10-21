import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import type { Answer, Locale, Question } from '@/domain/types';

import { AppText, OptionTile } from './components';
import { t, tr } from './i18n';
import { Mascot, type Mood } from './mascot';
import { parseNumberInput } from './number-input';
import { NumberPad } from './number-pad';
import { colors, fonts, radius, space } from './theme';

export function QuestionView({
  question,
  locale,
  answer,
  onChange,
  revealed,
  numberText,
  onNumberTextChange,
  mood = 'curious',
}: {
  question: Question;
  locale: Locale;
  answer: Answer | undefined;
  onChange: (answer: Answer) => void;
  /** Show which answers were right and wrong (after "Check"). */
  revealed: boolean;
  numberText: string;
  onNumberTextChange: (text: string) => void;
  mood?: Mood;
}) {
  const selected = answer?.kind === 'multiple-choice' ? answer.selectedOptionIds : [];
  const critical = question.points === 5;

  return (
    <View style={styles.wrap}>
      {/* The mascot asks the question in a speech bubble. */}
      <View style={styles.askRow}>
        <View style={styles.mascot}>
          <Mascot mood={mood} size={76} />
        </View>
        <View style={styles.bubble}>
          <View style={styles.bubbleTail} />
          <View style={[styles.points, critical && styles.pointsCritical]}>
            <Ionicons name={critical ? 'warning' : 'ribbon'} size={13} color={critical ? colors.white : colors.slateDark} />
            <AppText style={[styles.pointsText, critical && { color: colors.white }]}>
              {question.points} {t('points', locale)}
            </AppText>
          </View>
          <AppText variant="question" accessibilityRole="header">
            {tr(question.prompt, locale)}
          </AppText>
        </View>
      </View>

      {question.media?.type === 'image' ? (
        <Image
          source={{ uri: question.media.uri }}
          style={styles.media}
          contentFit="contain"
          accessibilityLabel={tr(question.media.alt, locale)}
        />
      ) : null}

      {question.kind === 'multiple-choice' ? (
        <View style={styles.options}>
          <AppText variant="small" color={colors.slate}>
            {t('chooseAll', locale)}
          </AppText>
          {question.options?.map((option, i) => {
            const isSelected = selected.includes(option.id);
            let state: 'correct' | 'wrong' | 'missed' | undefined;
            if (revealed) {
              if (option.correct && isSelected) state = 'correct';
              else if (!option.correct && isSelected) state = 'wrong';
              else if (option.correct) state = 'missed';
            }
            return (
              <OptionTile
                key={option.id}
                index={i}
                label={tr(option.text, locale)}
                selected={isSelected}
                state={state}
                disabled={revealed}
                onPress={() =>
                  onChange({
                    kind: 'multiple-choice',
                    selectedOptionIds: isSelected
                      ? selected.filter((id) => id !== option.id)
                      : [...selected, option.id],
                  })
                }
              />
            );
          })}
        </View>
      ) : (
        <View style={styles.options}>
          <AppText variant="small" color={colors.slate}>
            {t('enterNumber', locale)}
          </AppText>
          <NumberPad
            text={numberText}
            unit={tr(question.numberAnswer?.unit, locale)}
            disabled={revealed}
            deleteLabel={t('delete', locale)}
            state={revealed ? (answer?.kind === 'number' && answer.value === question.numberAnswer?.value ? 'correct' : 'wrong') : undefined}
            onChange={(text) => {
              onNumberTextChange(text);
              onChange({ kind: 'number', value: parseNumberInput(text) });
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.lg },
  askRow: { flexDirection: 'row', alignItems: 'flex-end', gap: space.sm },
  mascot: { width: 76, alignItems: 'center' },
  bubble: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 2.5,
    borderColor: colors.line,
    padding: space.md,
    gap: space.sm,
    marginBottom: space.lg,
  },
  bubbleTail: {
    position: 'absolute',
    left: -9,
    bottom: 22,
    width: 16,
    height: 16,
    backgroundColor: colors.white,
    borderLeftWidth: 2.5,
    borderBottomWidth: 2.5,
    borderColor: colors.line,
    transform: [{ rotate: '45deg' }],
  },
  points: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: colors.slateTint,
    borderRadius: radius.round,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  pointsCritical: { backgroundColor: colors.red },
  pointsText: { fontFamily: fonts.bold, fontSize: 13, lineHeight: 17, color: colors.slateDark },
  options: { gap: space.md },
  media: { width: '100%', aspectRatio: 4 / 3, borderRadius: radius.md, backgroundColor: colors.slateTint },
});
