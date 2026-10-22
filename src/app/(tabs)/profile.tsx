import Constants from 'expo-constants';
import { router } from 'expo-router';
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { localToday } from '@/domain/srs';
import { currentStreak, DAILY_GOAL_OPTIONS, totalXp } from '@/domain/streak';
import type { Locale } from '@/domain/types';
import { supabase } from '@/lib/supabase';
import { useAppState } from '@/state/app-state';
import { useSaveStatus } from '@/state/cloud-save';
import { useSession } from '@/state/session';
import { AppText, Card, RaisedButton } from '@/ui/components';
import { useConfirm } from '@/ui/confirm';
import { t } from '@/ui/i18n';
import { colors, radius, space } from '@/ui/theme';

const PRIVACY_URL = 'https://rashti64.github.io/Theory-Trainer-App/privacy/';

const LOCALES:{ id: Locale; label: string }[] = [
  { id: 'de', label: 'Deutsch' },
  { id: 'en', label: 'English' },
];

export default function ProfileScreen() {
  const { state, dispatch } = useAppState();
  const { session, backendReady } = useSession();
  const confirm = useConfirm();
  const { status: saveStatus } = useSaveStatus();
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

        <Section title={t('sound', locale)}>
          <Segmented
            options={[
              { id: 'on', label: t('on', locale) },
              { id: 'off', label: t('off', locale) },
            ]}
            value={state.soundOn ? 'on' : 'off'}
            onChange={(id) => dispatch({ type: 'set-sound', on: id === 'on' })}
          />
        </Section>

        <Section title={t('account', locale)}>
          <AppText color={saveStatus === 'account' ? colors.greenDark : colors.slate}>
            {t(saveStatus === 'account' ? 'savedAccount' : 'savedDevice', locale)}
          </AppText>
          {saveStatus === 'account' ? null : !backendReady ? (
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
                onPress={async () => {
                  const ok = await confirm({
                    title: t('deleteAccount', locale),
                    body: t('deleteAccountBody', locale),
                    confirmLabel: t('deleteAccount', locale),
                    cancelLabel: t('keepGoing', locale),
                    destructive: true,
                  });
                  if (!ok) return;
                  const { error } = (await supabase?.rpc('delete_my_account')) ?? {};
                  if (error) {
                    await confirm({ title: t('deleteFailed', locale), confirmLabel: t('close', locale) });
                    return;
                  }
                  await supabase?.auth.signOut();
                }}
              />
            </>
          ) : (
            <>
              <AppText color={colors.slate}>{t('guest', locale)}</AppText>
              <RaisedButton label={t('signIn', locale)} onPress={() => router.push('/auth')} />
            </>
          )}
        </Section>

        <Section title={t('about', locale)}>
          <AppText variant="small" color={colors.slate}>
            {t('disclaimer', locale)}
          </AppText>
          <Pressable accessibilityRole="link" onPress={() => Linking.openURL(PRIVACY_URL)}>
            <AppText variant="label" color={colors.blue}>
              {t('privacyLink', locale)}
            </AppText>
          </Pressable>
          <AppText variant="small" color={colors.muted}>
            {`Version ${Constants.expoConfig?.version ?? ''}`}
          </AppText>
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
