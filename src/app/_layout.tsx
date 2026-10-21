import {
  Barlow_400Regular,
  Barlow_500Medium,
  Barlow_600SemiBold,
  Barlow_700Bold,
  Barlow_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/barlow';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppStateProvider } from '@/state/app-state';
import { SessionProvider } from '@/state/session';
import { colors } from '@/ui/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Barlow_400Regular,
    Barlow_500Medium,
    Barlow_600SemiBold,
    Barlow_700Bold,
    Barlow_800ExtraBold,
  });
  const ready = fontsLoaded || fontError !== null;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <SessionProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="lesson/[unitId]" options={{ presentation: 'fullScreenModal', gestureEnabled: false }} />
            <Stack.Screen name="exam-run" options={{ presentation: 'fullScreenModal', gestureEnabled: false }} />
            <Stack.Screen name="auth" options={{ presentation: 'modal' }} />
          </Stack>
        </SessionProvider>
      </AppStateProvider>
    </SafeAreaProvider>
  );
}
