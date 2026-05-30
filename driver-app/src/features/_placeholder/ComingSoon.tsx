import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Button, Screen } from '@/shared/components';

/**
 * Temporary stand-in for routes whose feature hasn't been built yet
 * (auth, enrollment, …). Replaced when each feature lands.
 */
export function ComingSoon({ title }: { title: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <Screen contentClassName="items-center justify-center">
      <Text className="font-display text-2xl font-semibold text-text dark:text-dark-text">
        {title}
      </Text>
      <Text className="mt-2 text-center text-base text-text-muted dark:text-dark-text-muted">
        {t('common.comingSoon')}
      </Text>
      <View className="mt-8 w-full max-w-[240px]">
        {/* These placeholders are tab destinations reached via Navbar's
            router.replace, so there's no back-stack entry — return to the
            dashboard explicitly rather than router.back() (which goes nowhere). */}
        <Button label={t('common.back')} variant="secondary" onPress={() => router.navigate('/dashboard')} />
      </View>
    </Screen>
  );
}
