import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

import { Button, Icon, Screen } from '@/shared/components';

import { useRideStore } from '@/features/ride-requests/store';
import { MOCK_REQUEST } from '@/features/ride-requests/data';
import { TRIP, commissionAmount } from './data';

export function CompleteScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const finish = useRideStore((s) => s.finish);
  const trip = useRideStore((s) => s.active) ?? MOCK_REQUEST;
  const fare = trip.fare;
  const commission = commissionAmount(fare, TRIP.commissionRate);
  const earnings = +(fare - commission).toFixed(2);

  const done = () => {
    finish(); // clear ride state; real impl writes the commission accrual to the ledger
    router.replace('/dashboard');
  };

  return (
    <Screen contentClassName="items-center pt-16">
      {/* Animated check ring */}
      <Animated.View
        entering={ZoomIn.springify().damping(12)}
        className="h-24 w-24 items-center justify-center rounded-full bg-brand-50 dark:bg-dark-surface-2"
      >
        <View className="h-16 w-16 items-center justify-center rounded-full bg-brand-600">
          <Icon name="check" size={34} color="#ffffff" strokeWidth={3.5} />
        </View>
      </Animated.View>

      <Animated.Text
        entering={FadeInDown.delay(180).duration(400)}
        className="mt-5 font-display text-[30px] font-semibold text-text dark:text-dark-text"
        style={{ letterSpacing: -1 }}
      >
        {t('trip.doneTitle')}
      </Animated.Text>
      <Animated.Text
        entering={FadeInDown.delay(280).duration(400)}
        className="mt-1.5 text-[15px] text-text-muted dark:text-dark-text-muted"
      >
        {t('trip.doneSub')}
      </Animated.Text>

      {/* Net earnings highlight */}
      <Animated.View
        entering={FadeInDown.delay(360).duration(400)}
        className="mt-7 w-full items-center rounded-lg border border-brand-500/40 bg-brand-50 p-5 dark:bg-dark-surface-2"
      >
        <Text className="font-mono text-[11px] uppercase tracking-wide text-brand-700">
          {t('success.earned')}
        </Text>
        <Text
          className="mt-1 font-display text-[40px] font-semibold text-brand-700"
          style={{ letterSpacing: -1.5 }}
        >
          {earnings}
          <Text className="text-[16px] text-text-muted dark:text-dark-text-muted">
            {' '}
            {t('unit.currency')}
          </Text>
        </Text>
      </Animated.View>

      {/* Trip details */}
      <View className="mt-4 w-full rounded-md border border-border bg-surface px-4 dark:border-dark-border dark:bg-dark-surface">
        <Detail icon="cash" label={t('success.collected')} value={`${fare} ${t('unit.currency')}`} />
        <Detail icon="warn" label={t('trip.commission')} value={`− ${commission} ${t('unit.currency')}`} divider />
        <Detail icon="chart" label={t('trip.distance')} value={`${TRIP.distanceKm} ${t('unit.km')}`} divider />
        <Detail icon="clock" label={t('trip.duration')} value={`${TRIP.durationMin} ${t('unit.min')}`} divider />
      </View>

      <View className="flex-1" />

      <View className="w-full">
        <Button label={t('success.home')} onPress={done} />
      </View>
    </Screen>
  );
}

function Detail({
  icon,
  label,
  value,
  divider = false,
}: {
  icon: 'cash' | 'warn' | 'chart' | 'clock';
  label: string;
  value: string;
  divider?: boolean;
}) {
  return (
    <View
      className={`flex-row items-center gap-3 py-3 ${
        divider ? 'border-t border-border dark:border-dark-border' : ''
      }`}
    >
      <View className="h-8 w-8 items-center justify-center rounded-full bg-surface-2 dark:bg-dark-surface-2">
        <Icon name={icon} size={16} color="#5e5650" />
      </View>
      <Text className="flex-1 text-[13.5px] text-text-muted dark:text-dark-text-muted">{label}</Text>
      <Text className="text-[14px] font-semibold text-text dark:text-dark-text">{value}</Text>
    </View>
  );
}
