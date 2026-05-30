import '@/global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';

import { LangProvider } from '@/i18n/LangProvider';
import { ThemeProvider } from '@/theme/ThemeProvider';

function StatusBarFromTheme() {
  const { colorScheme } = useColorScheme();
  return <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />;
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LangProvider>
        <StatusBarFromTheme />
        <Stack screenOptions={{ headerShown: false }}>
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
      </LangProvider>
    </ThemeProvider>
  );
}
