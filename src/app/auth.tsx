/** Sign in or create an account with email and password (Supabase Auth). */
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { supabase } from '@/lib/supabase';
import { useAppState } from '@/state/app-state';
import { AppText, RaisedButton } from '@/ui/components';
import { t } from '@/ui/i18n';
import { colors, fonts, radius, space } from '@/ui/theme';

export default function AuthScreen() {
  const { state } = useAppState();
  const locale = state.locale;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: 'error' | 'info'; text: string } | null>(null);

  async function submit(mode: 'sign-in' | 'sign-up') {
    if (!supabase) return;
    setBusy(true);
    setMessage(null);
    const { data, error } =
      mode === 'sign-in'
        ? await supabase.auth.signInWithPassword({ email: email.trim(), password })
        : await supabase.auth.signUp({ email: email.trim(), password });
    setBusy(false);
    if (error) return setMessage({ tone: 'error', text: error.message });
    if (data.session) return router.back();
    setMessage({ tone: 'info', text: t('checkEmail', locale) });
  }

  if (!supabase) {
    return (
      <SafeAreaView style={styles.screen}>
        <AppText>{t('backendMissing', locale)}</AppText>
        <RaisedButton label={t('close', locale)} onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  const canSubmit = email.includes('@') && password.length >= 8 && !busy;

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.form}>
        <AppText variant="display">{t('account', locale)}</AppText>
        <View style={styles.field}>
          <AppText variant="label">{t('email', locale)}</AppText>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            textContentType="emailAddress"
            style={styles.input}
          />
        </View>
        <View style={styles.field}>
          <AppText variant="label">{t('password', locale)}</AppText>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
            textContentType="password"
            style={styles.input}
          />
        </View>
        {message ? (
          <AppText color={message.tone === 'error' ? colors.redDark : colors.greenDark}>{message.text}</AppText>
        ) : null}
        <RaisedButton label={t('signIn', locale)} disabled={!canSubmit} onPress={() => submit('sign-in')} />
        <RaisedButton
          label={t('signUp', locale)}
          tone="neutral"
          disabled={!canSubmit}
          onPress={() => submit('sign-up')}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, padding: space.lg, gap: space.lg },
  form: { gap: space.lg },
  field: { gap: space.xs },
  input: {
    borderWidth: 2,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    fontFamily: fonts.medium,
    fontSize: 17,
    color: colors.asphalt,
    backgroundColor: colors.surface,
  },
});
