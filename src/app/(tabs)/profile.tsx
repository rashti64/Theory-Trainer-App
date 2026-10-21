import { router } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { localToday } from '@/domain/srs';
import { currentStreak, DAILY_GOAL_OPTIONS, totalXp } from '@/domain/streak';
import type { Locale } from '@/domain/types';
import { supabase } from '@/lib/supabase';
import { useAppState } from '@/state/app-state';
import { useSession } from '@/state/session';
import { AppText, Card, RaisedButton } from '@/ui/components';
import { t } from '@/ui/i18n';
import { colors, radius, space } from '@/ui/theme';

const LOCALES: { id: Locale; label: string }[] = [
  { id: 'de', label: 'Deutsch' },
  { id: 'en', label: 'English' },
];

export default function ProfileScreen() {
  const { state, dispatch } = useAppState();
  const { session, backendReady } = useSession();
  const locale = state.locale;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppText variant="display">{t('profile', locale)}</AppText>

        <View style={styles.stats}>
          <Card style={styles.stat}>
            <AppText variant="display">{currentStreak(state.activity, localToday())}</AppText>
            <AppText variant="small" color={colors.slate}>
              {t('streak', locale)}
            </AppText>
          </Card>
          <Card style={styles.stat}>
            <AppText variant="display">{totalXp(state.activity)}</AppText>
            <AppText variant="small" color={colors.slate}>
              XP
            </AppText>
          </Card>
        </View>

        <Section title={t('dailyGoal', locale)}>
          <Segmented
            options={DAILY_GOAL_OPTIONS.map((xp) => ({ id: xp, label: `${xp} XP` }))}
            value={state.dailyGoalXp}
            onChange={(xp) => dispatch({ type: 'set-daily-goal', xp })}
          />
        </Section>

        <Section title={t('language', locale)}>
          <Segmented
            options={LOCALES}
            value={locale}
            onChange={(id) => dispatch({ type: 'set-locale', locale: id })}
          />
        </Section>

        <Section title={t('account', locale)}>
          {!backendReady ? (
            <AppText color={colors.slate}>{t('backendMissing', locale)}</AppText>
          ) : session ? (
            <>
              <AppText color={colors.slate}>
                {t('signedInAs', locale)} {session.user.email}
              </AppText>
              <RaisedButton label={t('signOut', locale)} tone="neutral" onPress={() => supabase?.auth.signOut()} />
              <RaisedButton
                label={t('deleteAccount', locale)}
                tone="danger"
                onPress={() =>
                  Alert.alert(t('deleteAccount', locale), t('deleteAccountBody', locale), [
                    { text: t('keepGoing', locale), style: 'cancel' },
                    {
                      text: t('deleteAccount', locale),
                      style: 'destructive',
                      onPress: async () => {
                        const { error } = (await supabase?.rpc('delete_my_account')) ?? {};
                        if (error) return Alert.alert(t('deleteFailed', locale));
                        await supabase?.auth.signOut();
                      },
                    },
                  ])
                }
              />
            </>
          ) : (
            <>
              <AppText color={colors.slate}>{t('guest', locale)}</AppText>
              <RaisedButton label={t('signIn', locale)} onPress={() => router.push('/auth')} />
            </>
          )}
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <AppText variant="title">{title}</AppText>
      {children}
    </View>
  );
}

function Segmented<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <View style={styles.segmented} accessibilityRole="radiogroup">
      {options.map((o) => {
        const active = o.id === value;
        return (
          <Pressable
            key={String(o.id)}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(o.id)}
            style={[styles.segment, active && styles.segmentActive]}>
            <AppText variant="label" color={active ? colors.blue : colors.slate}>
              {o.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: space.lg, gap: space.xl, paddingBottom: space.xxl },
  stats: { flexDirection: 'row', gap: space.md },
  stat: { flex: 1, alignItems: 'center' },
  section: { gap: space.md },
  segmented: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  segment: {
    paddingHorizontal: space.lg,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  segmentActive: { borderColor: colors.blue, backgroundColor: colors.blueTint },
});
