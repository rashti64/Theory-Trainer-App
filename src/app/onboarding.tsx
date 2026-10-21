/**
 * First launch: the mascot introduces itself, asks for the exam date and a
 * daily goal, then offers the entry test so the plan starts from the
 * learner's real level.
 */
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { examDateIn } from '@/domain/readiness';
import { localToday } from '@/domain/srs';
import type { DailyGoalXp } from '@/domain/streak';
import { useAppState } from '@/state/app-state';
import { AppText, RaisedButton } from '@/ui/components';
import { t, type StringKey } from '@/ui/i18n';
import { Mascot3DView } from '@/ui/mascot-3d-view';
import { colors, fonts, radius, space } from '@/ui/theme';

const WEEKS = [2, 4, 6, 8, 12] as const;
const GOALS: { xp: DailyGoalXp; key: StringKey }[] = [
  { xp: 10, key: 'obGoal10' },
  { xp: 20, key: 'obGoal20' },
  { xp: 30, key: 'obGoal30' },
  { xp: 50, key: 'obGoal50' },
];

export default function Onboarding() {
  const { state, dispatch } = useAppState();
  const locale = state.locale;
  const [step, setStep] = useState(0);
  const [weeks, setWeeks] = useState<number | null>(6);
  const [goal, setGoal] = useState<DailyGoalXp>(20);

  function finish(withTest: boolean) {
    dispatch({ type: 'set-exam-date', date: weeks === null ? null : examDateIn(localToday(), weeks) });
    dispatch({ type: 'set-daily-goal', xp: goal });
    dispatch({ type: 'finish-onboarding' });
    router.replace(withTest ? '/lesson/entry' : '/');
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.dots}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={[styles.dot, i <= step && styles.dotOn]} />
        ))}
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        <Mascot3DView mood={step === 3 ? 'happy' : 'curious'} size={step === 0 ? 170 : 120} />
        <Animated.View key={step} entering={FadeInRight.duration(250)} style={styles.stepBox}>
          {step === 0 ? (
            <>
              <AppText style={styles.title}>{t('obWelcomeTitle', locale)}</AppText>
              <AppText style={styles.text}>{t('obWelcomeBody', locale)}</AppText>
              <View style={styles.choices}>
                {(['de', 'en'] as const).map((l) => (
                  <Choice key={l} label={l === 'de' ? 'Deutsch' : 'English'} active={locale === l} onPress={() => dispatch({ type: 'set-locale', locale: l })} />
                ))}
              </View>
            </>
          ) : null}
          {step === 1 ? (
            <>
              <AppText style={styles.title}>{t('obDateTitle', locale)}</AppText>
              <AppText style={styles.text}>{t('obDateBody', locale)}</AppText>
              <View style={styles.choices}>
                {WEEKS.map((w) => (
                  <Choice key={w} label={t('inWeeks', locale, { n: w })} active={weeks === w} onPress={() => setWeeks(w)} />
                ))}
                <Choice label={t('obNoDate', locale)} active={weeks === null} onPress={() => setWeeks(null)} />
              </View>
            </>
          ) : null}
          {step === 2 ? (
            <>
              <AppText style={styles.title}>{t('obGoalTitle', locale)}</AppText>
              <AppText style={styles.text}>{t('obGoalBody', locale)}</AppText>
              <View style={styles.choices}>
                {GOALS.map((g) => (
                  <Choice key={g.xp} label={t(g.key, locale)} active={goal === g.xp} onPress={() => setGoal(g.xp)} wide />
                ))}
              </View>
            </>
          ) : null}
          {step === 3 ? (
            <>
              <AppText style={styles.title}>{t('obTestTitle', locale)}</AppText>
              <AppText style={styles.text}>{t('obTestBody', locale)}</AppText>
            </>
          ) : null}
        </Animated.View>
      </ScrollView>
      <View style={styles.footer}>
        {step < 3 ? (
          <RaisedButton label={t('next2', locale)} onPress={() => setStep(step + 1)} />
        ) : (
          <>
            <RaisedButton label={t('entryStart', locale)} onPress={() => finish(true)} />
            <RaisedButton label={t('obSkip', locale)} tone="neutral" onPress={() => finish(false)} />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

function Choice({ label, active, onPress, wide }: { label: string; active: boolean; onPress: () => void; wide?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected: active }}
      style={[styles.choice, wide && styles.choiceWide, active && styles.choiceActive]}>
      <AppText style={[styles.choiceText, active && { color: colors.blue }]}>{label}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: space.sm, paddingTop: space.md },
  dot: { width: 34, height: 8, borderRadius: 4, backgroundColor: colors.slateTint },
  dotOn: { backgroundColor: colors.blue },
  body: { alignItems: 'center', padding: space.xl, gap: space.lg },
  stepBox: { alignSelf: 'stretch', gap: space.md, alignItems: 'center' },
  title: { fontFamily: fonts.black, fontSize: 28, lineHeight: 33, color: colors.asphalt, textAlign: 'center' },
  text: { fontFamily: fonts.semibold, fontSize: 17, lineHeight: 24, color: colors.slate, textAlign: 'center' },
  choices: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: space.sm, marginTop: space.sm },
  choice: {
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.line,
    borderBottomWidth: 4,
  },
  choiceWide: { alignSelf: 'stretch', width: '100%' },
  choiceActive: { borderColor: colors.blue, backgroundColor: colors.blueTint },
  choiceText: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 21, color: colors.asphalt, textAlign: 'center' },
  footer: { padding: space.lg, gap: space.sm },
});
