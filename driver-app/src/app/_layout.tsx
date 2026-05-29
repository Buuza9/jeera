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
        <Stack screenOptions={{ headerShown: false }} />
      </LangProvider>
    </ThemeProvider>
  );
}
