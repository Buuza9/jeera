import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { Button, Icon } from '@/shared/components';

import { SUSPENDED } from './data';

export function SuspendedScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-bg dark:bg-dark-bg">
      <ScrollView
        className="flex-1"
        contentContainerClassName="grow items-center px-7 pb-8 pt-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Danger icon */}
        <Animated.View
          entering={ZoomIn.springify().damping(12)}
          className="h-24 w-24 items-center justify-center rounded-full bg-danger/12"
        >
          <View
            className="h-[66px] w-[66px] items-center justify-center rounded-full bg-danger"
            style={{ shadowColor: '#c5372f', shadowOpacity: 0.4, shadowRadius: 24, shadowOffset: { width: 0, height: 10 } }}
          >
            <Icon name="alertCircle" size={34} color="#ffffff" />
          </View>
        </Animated.View>

        <View className="mt-3.5 rounded-full bg-danger/12 px-3 py-1.5">
          <Text className="text-[11.5px] font-bold uppercase tracking-wider text-danger">
            {t('susp.badge')}
          </Text>
        </View>

        <Text className="mt-2 text-center font-display text-[26px] font-semibold text-text dark:text-dark-text" style={{ letterSpacing: -0.9 }}>
          {t('susp.title')}
        </Text>
        <Text className="mt-2 max-w-[320px] text-center text-[14.5px] leading-[22px] text-text-muted dark:text-dark-text-muted">
          {t('susp.tag')}
        </Text>

        {/* Owed card */}
        <View className="mt-5 w-full items-center rounded-lg border-[1.5px] border-danger/35 bg-surface p-[18px] dark:bg-dark-surface">
          <Text className="font-mono text-[11px] uppercase tracking-widest text-danger">
            {t('susp.owed')}
          </Text>
          <Text className="mt-1.5 font-display text-[44px] font-semibold text-text dark:text-dark-text" style={{ letterSpacing: -1.8 }}>
            {SUSPENDED.balance}
            <Text className="text-[17px] font-bold text-text-muted dark:text-dark-text-muted"> {t('unit.currency')}</Text>
          </Text>
          <Text className="mt-1 text-[12.5px] text-text-muted dark:text-dark-text-muted">
            {t('susp.reason', { since: SUSPENDED.since, cap: SUSPENDED.cap })}
          </Text>
        </View>

        {/* Steps */}
        <View className="mt-3 w-full rounded-lg border border-border bg-surface px-3.5 dark:border-dark-border dark:bg-dark-surface">
          <Step n={1} title={t('susp.s1.t')} desc={t('susp.s1.d', { balance: SUSPENDED.balance })} />
          <Step n={2} title={t('susp.s2.t')} desc={t('susp.s2.d')} divider />
          <Step n={3} title={t('susp.s3.t')} desc={t('susp.s3.d')} divider />
        </View>

        <View className="flex-1" />

        {/* Actions */}
        <View className="mt-5 w-full">
          <Button label={t('susp.cta')} onPress={() => router.push('/commission/settle')} />
        </View>
        {/* Support is a D4 feature — link is inert until that route lands. */}
        <Text className="mt-3 text-[13px] font-semibold text-brand-600">{t('susp.support')}</Text>

        <View className="mt-3.5 flex-row items-center gap-1.5 rounded-full bg-accent-600/12 px-2.5 py-1">
          <View className="h-[5px] w-[5px] rounded-full bg-accent-600" />
          <Text className="text-[10.5px] font-semibold text-accent-600">{t('susp.todo')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Step({ n, title, desc, divider = false }: { n: number; title: string; desc: string; divider?: boolean }) {
  return (
    <View className={`flex-row items-start gap-3 py-3 ${divider ? 'border-t border-border dark:border-dark-border' : ''}`}>
      <View className="h-6 w-6 items-center justify-center rounded-full bg-brand-50 dark:bg-dark-surface-2">
        <Text className="text-[12px] font-bold text-brand-700">{n}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-[13.5px] font-semibold text-text dark:text-dark-text">{title}</Text>
        <Text className="mt-0.5 text-[12px] leading-[17px] text-text-muted dark:text-dark-text-muted">{desc}</Text>
      </View>
    </View>
  );
}
