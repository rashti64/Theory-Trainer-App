import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppState } from '@/state/app-state';
import { t } from '@/ui/i18n';
import { colors, fonts } from '@/ui/theme';

export default function TabsLayout() {
  const { state } = useAppState();
  const locale = state.locale;
  const insets = useSafeAreaInsets();
  if (!state.onboardingDone) return <Redirect href="/onboarding" />;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16 },
        tabBarStyle: {
          borderTopWidth: 2,
          borderTopColor: colors.line,
          backgroundColor: colors.surface,
          // Room for icon + label; the default height clips the label on some screens.
          height: 70 + insets.bottom,
          paddingTop: 4,
          paddingBottom: 6 + insets.bottom,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('learn', locale),
          tabBarIcon: ({ color, size }) => <Ionicons name="map" color={color as string} size={size} />,
        }}
      />
      <Tabs.Screen
        name="exam"
        options={{
          title: t('readyTab', locale),
          tabBarIcon: ({ color, size }) => <Ionicons name="speedometer" color={color as string} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile', locale),
          tabBarIcon: ({ color, size }) => <Ionicons name="person-circle" color={color as string} size={size} />,
        }}
      />
    </Tabs>
  );
}
