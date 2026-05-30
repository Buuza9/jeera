import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Button, Icon, Screen } from '@/shared/components';

import { useRideStore } from '@/features/ride-requests/store';
import { MOCK_REQUEST } from '@/features/ride-requests/data';
import { TRIP, commissionAmount } from './data';

export function CollectScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const trip = useRideStore((s) => s.active) ?? MOCK_REQUEST;
  const fare = trip.fare;
  const commission = commissionAmount(fare, TRIP.commissionRate);
  const earnings = +(fare - commission).toFixed(2);

  return (
    <Screen contentClassName="pt-12">
      <Text className="text-center font-mono text-[11px] uppercase tracking-widest text-text-faint dark:text-dark-text-faint">
        {t('collect.eyebrow')}
      </Text>
      <Text
        className="mt-1 text-center font-display text-[26px] font-semibold text-text dark:text-dark-text"
        style={{ letterSpacing: -0.8 }}
      >
        {t('collect.title')}
      </Text>

      {/* Amount to collect */}
      <Animated.View
        entering={FadeInDown.duration(350)}
        className="mt-6 items-center rounded-lg border border-brand-500/40 bg-brand-50 p-6 dark:bg-dark-surface-2"
      >
        <Text className="font-mono text-[11px] uppercase tracking-wide text-brand-700">
          {t('collect.due')}
        </Text>
        <Text
          className="mt-1.5 font-display text-[52px] font-semibold text-brand-700"
          style={{ letterSpacing: -2 }}
        >
          {fare}
          <Text className="text-[20px] text-text-muted dark:text-dark-text-muted">
            {' '}
            {t('unit.currency')}
          </Text>
        </Text>
      </Animated.View>

      {/* Payment method (cash only) */}
      <Text className="mb-2 mt-6 font-mono text-[11px] uppercase tracking-widest text-text-faint dark:text-dark-text-faint">
        {t('collect.method')}
      </Text>
      <View className="flex-row items-center gap-3 rounded-md border-2 border-brand-500 bg-surface p-4 dark:bg-dark-surface">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-brand-50 dark:bg-dark-surface-2">
          <Icon name="cash" size={20} color="#194f29" />
        </View>
        <View className="flex-1">
          <Text className="text-[15px] font-semibold text-text dark:text-dark-text">
            {t('collect.cash')}
          </Text>
          <Text className="mt-0.5 text-[12.5px] text-text-muted dark:text-dark-text-muted">
            {t('collect.cashSub')}
          </Text>
        </View>
        <Icon name="check" size={20} color="#2a673a" />
      </View>

      {/* Breakdown */}
      <View className="mt-4 rounded-md border border-border bg-surface px-4 dark:border-dark-border dark:bg-dark-surface">
        <Row label={t('collect.fare')} value={`${fare} ${t('unit.currency')}`} />
        <Row label={t('collect.commission')} value={`− ${commission} ${t('unit.currency')}`} muted />
        <Row label={t('collect.earnings')} value={`${earnings} ${t('unit.currency')}`} strong />
      </View>

      <View className="flex-1" />

      <Button label={t('collect.confirm')} onPress={() => router.replace('/active-trip/complete')} />
    </Screen>
  );
}

function Row({
  label,
  value,
  muted = false,
  strong = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
  strong?: boolean;
}) {
  return (
    <View
      className={`flex-row items-center justify-between py-3 ${
        strong ? 'border-t border-border dark:border-dark-border' : ''
      }`}
    >
      <Text
        className={`text-[13.5px] ${
          strong
            ? 'font-semibold text-text dark:text-dark-text'
            : 'text-text-muted dark:text-dark-text-muted'
        }`}
      >
        {label}
      </Text>
      <Text
        className={`text-[14px] ${
          strong
            ? 'font-bold text-brand-700'
            : muted
              ? 'font-semibold text-accent-600'
              : 'font-semibold text-text dark:text-dark-text'
        }`}
      >
        {value}
      </Text>
    </View>
  );
}
