import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/shared/components';

import { type TripRecord } from './data';

/**
 * A single past-trip card — route rail (pickup dot → dropoff square), addresses,
 * fare, and a meta line (time · km · rider). Tappable → detail, unless the trip
 * was cancelled (then it shows a red badge and a struck-through fare).
 */
export function TripCard({ trip }: { trip: TripRecord }) {
  const { t } = useTranslation();
  const router = useRouter();
  const cancelled = !!trip.cancelled;

  const body = (
    <>
      <View className="flex-row items-stretch gap-3">
        {/* Route rail — pins only (no connector line) */}
        <View className="items-center py-1">
          <View className="h-2.5 w-2.5 rounded-full bg-brand-600" />
          <View className="my-1 flex-1" style={{ minHeight: 14 }} />
          <View className="h-2.5 w-2.5 rounded-[2px] bg-danger" />
        </View>

        {/* Addresses */}
        <View className="flex-1 justify-between gap-3">
          <Text className="text-[14px] font-semibold leading-[19px] text-text dark:text-dark-text" numberOfLines={1}>
            {trip.from}
          </Text>
          <Text className="text-[14px] font-semibold leading-[19px] text-text dark:text-dark-text" numberOfLines={1}>
            {trip.to}
          </Text>
        </View>

        {/* Fare + chevron / cancelled badge */}
        <View className="items-end justify-between">
          <Text
            className={`text-[16px] font-bold ${cancelled ? 'text-text-faint line-through dark:text-dark-text-faint' : 'text-text dark:text-dark-text'}`}
          >
            {trip.lyd}
            <Text className="text-[10px] font-semibold text-text-muted dark:text-dark-text-muted"> {t('unit.currency')}</Text>
          </Text>
          {cancelled ? (
            <View className="rounded-full bg-danger/12 px-2 py-0.5">
              <Text className="text-[10px] font-bold uppercase tracking-wide text-danger">{t('hist.cancelled')}</Text>
            </View>
          ) : (
            <Icon name="arrowRight" size={16} color="#8b857f" />
          )}
        </View>
      </View>

      {/* Meta */}
      <View className="mt-2 flex-row items-center gap-2 ps-[22px]">
        <Text className="text-[11.5px] text-text-faint dark:text-dark-text-faint">{trip.time}</Text>
        <Text className="text-[11.5px] text-text-faint dark:text-dark-text-faint">·</Text>
        <Text className="text-[11.5px] text-text-faint dark:text-dark-text-faint">{trip.km} {t('unit.km')}</Text>
        <Text className="text-[11.5px] text-text-faint dark:text-dark-text-faint">·</Text>
        <Text className="text-[11.5px] text-text-faint dark:text-dark-text-faint">{trip.rider}</Text>
      </View>
    </>
  );

  const cardClass = `rounded-lg border border-border bg-surface p-3.5 dark:border-dark-border dark:bg-dark-surface ${cancelled ? 'opacity-70' : ''}`;

  if (cancelled) return <View className={cardClass}>{body}</View>;

  return (
    <Pressable onPress={() => router.push(`/trip/${trip.id}`)} className={cardClass}>
      {body}
    </Pressable>
  );
}
