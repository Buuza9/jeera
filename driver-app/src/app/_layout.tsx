import '@/global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';

import { LangProvider } from '@/i18n/LangProvider';
import { LocationProvider } from '@/shared/LocationProvider';
import { ThemeProvider } from '@/theme/ThemeProvider';

// Keep the native splash up until React is mounted, then hand off to the
// in-app branded <Splash/> (shown by LangProvider while stores hydrate).
SplashScreen.preventAutoHideAsync();

function StatusBarFromTheme() {
  const { colorScheme } = useColorScheme();
  return <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />;
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <ThemeProvider>
      <LangProvider>
        <LocationProvider>
          <StatusBarFromTheme />
          <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            {/* The four main screens live in the (tabs) group — switching tabs is
                instant (kept mounted). Entering it animates left→right (the
                opposite of the default), e.g. the welcome dev button → dashboard. */}
            <Stack.Screen name="(tabs)" options={{ animation: 'ios_from_left' }} />
            {/* Ride request slides up as a sheet OVER the dashboard (map stays behind). */}
            <Stack.Screen
              name="ride-requests"
              options={{
                presentation: 'transparentModal',
                animation: 'fade',
                contentStyle: { backgroundColor: 'transparent' },
              }}
            />
          </Stack>
        </LocationProvider>
      </LangProvider>
    </ThemeProvider>
    </GestureHandlerRootView>
  );
}
