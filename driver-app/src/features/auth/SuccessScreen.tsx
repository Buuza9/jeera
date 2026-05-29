import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

import { Button, Icon, Screen } from '@/shared/components';

const REDIRECT_SECONDS = 3;

export function SuccessScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { to } = useLocalSearchParams<{ to?: string }>();
  const [cd, setCd] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    const iv = setInterval(() => setCd((n) => n - 1), 1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (cd <= 0) router.replace('/dashboard');
  }, [cd, router]);

  return (
    <Screen contentClassName="items-center pb-8 pt-12">
      {/* Check ring */}
      <Animated.View
        entering={ZoomIn.springify().damping(12)}
        className="mb-2 mt-1 h-28 w-28 items-center justify-center rounded-full bg-brand-50 dark:bg-dark-surface-2"
      >
        <View className="h-[76px] w-[76px] items-center justify-center rounded-full bg-brand-500">
          <Icon name="check" size={40} color="#ffffff" strokeWidth={3.5} />
        </View>
      </Animated.View>

      <Animated.Text
        entering={FadeInDown.delay(250).duration(400)}
        className="mb-2 mt-[18px] font-display text-[26px] font-semibold text-text dark:text-dark-text"
        style={{ letterSpacing: -0.78 }}
      >
        {t('ok.title')}
      </Animated.Text>
      <Animated.Text
        entering={FadeInDown.delay(350).duration(400)}
        className="max-w-[300px] text-center text-[15px] leading-6 text-text-muted dark:text-dark-text-muted"
      >
        {t('ok.tag')}
      </Animated.Text>
      {to ? (
        <Animated.Text
          entering={FadeInDown.delay(420).duration(400)}
          className="mb-6 mt-1.5 text-[13.5px] font-semibold text-text dark:text-dark-text"
        >
          {to}
        </Animated.Text>
      ) : null}

      <View className="flex-1" />

      <Animated.View entering={FadeInDown.delay(550).duration(400)} className="w-full">
        <Button label={t('ok.cta')} onPress={() => router.replace('/dashboard')} />
        <Text className="mt-3.5 text-center text-[12.5px] text-text-faint dark:text-dark-text-faint">
          {t('ok.auto.prefix')} {Math.max(cd, 0)}
          {t('ok.auto.s')}…
        </Text>
      </Animated.View>
    </Screen>
  );
}
