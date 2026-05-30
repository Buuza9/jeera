import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { I18nManager } from 'react-native';

import { Splash } from '@/shared/components/Splash';

import i18n, { initI18n, isRTL, SUPPORTED_LANGS, type Lang } from './index';

const STORAGE_KEY = 'djera.lang';

function detectDeviceLang(): Lang {
  const code = getLocales()[0]?.languageCode?.toLowerCase();
  return (SUPPORTED_LANGS as readonly string[]).includes(code ?? '') ? (code as Lang) : 'en';
}

type LangContextValue = {
  lang: Lang;
  /** True if the active language is RTL. */
  rtl: boolean;
  /** Set the active language. May require app reload to flip layout direction — see needsReload. */
  setLang: (l: Lang) => void;
  /**
   * True when the user picked a language whose direction differs from the native
   * I18nManager.isRTL. UI text/translation flip immediately; native layout needs
   * a full reload (see expo-updates / DevSettings) to apply.
   */
  needsReload: boolean;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');
  const [ready, setReady] = useState(false);
  const [needsReload, setNeedsReload] = useState(false);

  // Load persisted lang, else fall back to device locale.
  useEffect(() => {
    (async () => {
      const startedAt = Date.now();
      const stored = (await AsyncStorage.getItem(STORAGE_KEY)) as Lang | null;
      const initial: Lang = stored && (SUPPORTED_LANGS as readonly string[]).includes(stored)
        ? stored
        : detectDeviceLang();
      initI18n(initial);
      I18nManager.allowRTL(true);
      setLangState(initial);
      setNeedsReload(isRTL(initial) !== I18nManager.isRTL);
      // Keep the splash up for a minimum beat so it never flashes.
      const elapsed = Date.now() - startedAt;
      const MIN_SPLASH = 1100;
      if (elapsed < MIN_SPLASH) await new Promise((r) => setTimeout(r, MIN_SPLASH - elapsed));
      setReady(true);
    })();
  }, []);

  const setLang = (next: Lang) => {
    setLangState(next);
    i18n.changeLanguage(next);
    AsyncStorage.setItem(STORAGE_KEY, next);
    const wantRTL = isRTL(next);
    if (wantRTL !== I18nManager.isRTL) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(wantRTL);
      setNeedsReload(true);
    } else {
      setNeedsReload(false);
    }
  };

  if (!ready) return <Splash />;

  return (
    <LangContext.Provider value={{ lang, rtl: isRTL(lang), setLang, needsReload }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside LangProvider');
  return ctx;
}
