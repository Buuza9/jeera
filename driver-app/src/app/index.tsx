import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type Lang } from '@/i18n';
import { useLang } from '@/i18n/LangProvider';
import { useTheme } from '@/theme/ThemeProvider';

type Preference = 'light' | 'dark' | 'system';

export default function BootScreen() {
  const { t } = useTranslation();
  const { preference, setPreference } = useTheme();
  const { lang, rtl, setLang, needsReload } = useLang();

  return (
    <SafeAreaView className="flex-1 bg-bg dark:bg-dark-bg">
      <View className="flex-1 items-stretch justify-center px-7">
        {/* Brand mark */}
        <View className="mb-8 items-center">
          <View className="h-20 w-20 items-center justify-center rounded-2xl bg-brand-600">
            <Text className="font-display text-3xl text-white">د</Text>
          </View>
        </View>

        <Text
          className="text-center font-display text-3xl font-semibold text-text dark:text-dark-text"
          style={{ letterSpacing: -0.8 }}
        >
          {t('boot.welcome')}
        </Text>
        <Text className="mt-3 text-center text-base leading-6 text-text-muted dark:text-dark-text-muted">
          {t('boot.subtitle')}
        </Text>

        {/* Theme picker */}
        <View className="mt-10">
          <Text className="mb-2 font-mono text-xs uppercase tracking-widest text-text-faint dark:text-dark-text-faint">
            {t('boot.themeLabel')}
          </Text>
          <Segmented<Preference>
            value={preference}
            onChange={setPreference}
            options={[
              { value: 'light', label: t('boot.light') },
              { value: 'dark', label: t('boot.dark') },
              { value: 'system', label: t('boot.system') },
            ]}
          />
        </View>

        {/* Lang picker */}
        <View className="mt-5">
          <Text className="mb-2 font-mono text-xs uppercase tracking-widest text-text-faint dark:text-dark-text-faint">
            {t('boot.langLabel')}
          </Text>
          <Segmented<Lang>
            value={lang}
            onChange={setLang}
            options={[
              { value: 'en', label: t('boot.english') },
              { value: 'ar', label: t('boot.arabic') },
            ]}
          />
        </View>

        <Text className="mt-6 text-center font-mono text-xs text-text-faint dark:text-dark-text-faint">
          {t('boot.directionNote', { dir: rtl ? 'RTL' : 'LTR' })}
        </Text>

        {needsReload ? (
          <View className="mt-4 rounded-md border border-warn/40 bg-warn/10 px-4 py-3">
            <Text className="text-center text-sm text-text dark:text-dark-text">
              Reload the app to apply the new layout direction.
            </Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

type SegmentedProps<T extends string> = {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
};

function Segmented<T extends string>({ value, onChange, options }: SegmentedProps<T>) {
  return (
    <View className="flex-row rounded-md border border-border bg-surface-2 p-1 dark:border-dark-border dark:bg-dark-surface-2">
      {options.map((opt) => {
        const on = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            className={`flex-1 items-center rounded-sm px-3 py-2 ${
              on ? 'bg-brand-600' : ''
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                on ? 'text-text-onbrand' : 'text-text dark:text-dark-text'
              }`}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
