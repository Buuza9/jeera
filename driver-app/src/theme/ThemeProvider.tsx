import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme, vars } from 'nativewind';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { tokens, type ThemeName } from './tokens';

type Preference = 'light' | 'dark' | 'system';
const STORAGE_KEY = 'djera.theme';

type ThemeContextValue = {
  /** What the user picked: light/dark/system. Persisted. */
  preference: Preference;
  /** What's actually applied right now (system resolves to OS). */
  active: ThemeName;
  setPreference: (p: Preference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<Preference>('system');
  const { colorScheme, setColorScheme } = useColorScheme();

  // Load persisted preference once.
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setPreferenceState(stored);
        setColorScheme(stored);
      }
    });
  }, [setColorScheme]);

  const setPreference = (p: Preference) => {
    setPreferenceState(p);
    setColorScheme(p);
    AsyncStorage.setItem(STORAGE_KEY, p);
  };

  const active: ThemeName = colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <ThemeContext.Provider value={{ preference, active, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}

export function useThemeTokens() {
  const { active } = useTheme();
  return tokens[active];
}

// Re-export so callers don't import nativewind directly.
export { vars };
