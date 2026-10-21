import {
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
  useFonts,
} from '@expo-google-fonts/nunito';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, type ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppStateProvider } from '@/state/app-state';
import { CloudSaveProvider, useSaveStatus } from '@/state/cloud-save';
import { SessionProvider } from '@/state/session';
import { ConfirmProvider } from '@/ui/confirm';
import { colors } from '@/ui/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });
  const ready = fontsLoaded || fontError !== null;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <CloudSaveProvider>
          <WaitForSave>
            <SessionProvider>
              <ConfirmProvider>
                <StatusBar style="dark" />
                <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="lesson/[unitId]" options={{ presentation: 'fullScreenModal', gestureEnabled: false }} />
                  <Stack.Screen name="exam-run" options={{ presentation: 'fullScreenModal', gestureEnabled: false }} />
                  <Stack.Screen name="auth" options={{ presentation: 'modal' }} />
                  <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
                </Stack>
              </ConfirmProvider>
            </SessionProvider>
          </WaitForSave>
        </CloudSaveProvider>
      </AppStateProvider>
    </SafeAreaProvider>
  );
}

/** On the web page, wait (briefly) for the account copy before showing anything. */
function WaitForSave({ children }: { children: ReactNode }) {
  const { ready } = useSaveStatus();
  return ready ? <>{children}</> : null;
}
