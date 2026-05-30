import '@/global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
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
    <ThemeProvider>
      <LangProvider>
        <LocationProvider>
          <StatusBarFromTheme />
          <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
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
  );
}
