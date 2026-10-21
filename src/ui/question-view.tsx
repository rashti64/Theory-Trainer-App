import { Image } from 'expo-image';
import { StyleSheet, TextInput, View } from 'react-native';

import type { Answer, Locale, Question } from '@/domain/types';

import { AppText, OptionTile, PointsBadge } from './components';
import { t, tr } from './i18n';
import { colors, EDGE, fonts, radius, space } from './theme';

const MARKERS = ['A', 'B', 'C', 'D', 'E'];

/** Parse what the learner typed; accepts German decimal commas ("1,6"). */
export function parseNumberInput(text: string): number | null {
  const normalised = text.trim().replace(',', '.');
  if (normalised === '' || !/^-?\d+(\.\d+)?$/.test(normalised)) return null;
  return Number(normalised);
}

export function formatNumber(value: number, locale: Locale): string {
  return locale === 'de' ? String(value).replace('.', ',') : String(value);
}

export function QuestionView({
  question,
  locale,
  answer,
  onChange,
  revealed,
  numberText,
  onNumberTextChange,
}: {
  question: Question;
  locale: Locale;
  answer: Answer | undefined;
  onChange: (answer: Answer) => void;
  /** Show which answers were right and wrong (after "Check"). */
  revealed: boolean;
  numberText: string;
  onNumberTextChange: (text: string) => void;
}) {
  const selected = answer?.kind === 'multiple-choice' ? answer.selectedOptionIds : [];

  return (
    <View style={styles.wrap}>
      <PointsBadge points={question.points} label={t('points', locale)} />
      <AppText variant="question" accessibilityRole="header">
        {tr(question.prompt, locale)}
      </AppText>

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
          <AppText variant="small" color={colors.muted}>
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
                marker={MARKERS[i] ?? String(i + 1)}
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
          <AppText variant="small" color={colors.muted}>
            {t('enterNumber', locale)}
          </AppText>
          <View style={styles.numberRow}>
            <TextInput
              value={numberText}
              onChangeText={(text) => {
                onNumberTextChange(text);
                onChange({ kind: 'number', value: parseNumberInput(text) });
              }}
              editable={!revealed}
              keyboardType="decimal-pad"
              inputMode="decimal"
              accessibilityLabel={t('enterNumber', locale)}
              style={styles.numberInput}
              maxLength={8}
            />
            <AppText variant="bodyStrong">{tr(question.numberAnswer?.unit, locale)}</AppText>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.lg },
  options: { gap: space.md },
  media: { width: '100%', aspectRatio: 4 / 3, borderRadius: radius.md, backgroundColor: colors.slateTint },
  numberRow: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  numberInput: {
    minWidth: 140,
    borderWidth: 2,
    borderColor: colors.line,
    borderBottomWidth: EDGE,
    borderRadius: radius.md,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    fontFamily: fonts.bold,
    fontSize: 26,
    color: colors.asphalt,
    backgroundColor: colors.surface,
  },
});
