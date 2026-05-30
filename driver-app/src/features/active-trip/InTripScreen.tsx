import { useRouter } from 'expo-router';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import type MapView from 'react-native-maps';

import { Button, DjeraMap } from '@/shared/components';
import { haversineKm, regionForPoints } from '@/shared/geo';
import { openDirections } from '@/shared/maps';
import { useDeviceLocation } from '@/shared/useDeviceLocation';

import { useRideStore } from '@/features/ride-requests/store';
import { MOCK_REQUEST } from '@/features/ride-requests/data';

import { RecenterButton } from './RecenterButton';

export function InTripScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { location } = useDeviceLocation();
  const trip = useRideStore((s) => s.active) ?? MOCK_REQUEST;
  const dropoff = trip.dropoff.coord;
  const mapRef = useRef<MapView | null>(null);

  const km = haversineKm(location, dropoff);
  const etaMin = Math.max(1, Math.ceil((km / 25) * 60));

  return (
    <View className="flex-1 bg-bg dark:bg-dark-bg">
      <DjeraMap
        ref={mapRef}
        driver={location}
        markers={[{ id: 'dropoff', coord: dropoff, kind: 'dest' }]}
        region={regionForPoints([location, dropoff])}
        style={{ flex: 1 }}
      />

      {/* Top metrics */}
      <View className="absolute inset-x-[18px] top-16 flex-row gap-2">
        <MetricCard label={t('trip.remaining')} value={km.toFixed(1)} unit={t('unit.km')} />
        <MetricCard label="ETA" value={`${etaMin}`} unit={t('unit.min')} />
      </View>

      <RecenterButton mapRef={mapRef} location={location} />

      {/* Bottom sheet */}
      <View className="absolute inset-x-0 bottom-0 rounded-t-[28px] bg-bg px-5 pb-8 pt-2 shadow-2xl dark:bg-dark-bg">
        <View className="mx-auto mb-3 mt-1 h-[5px] w-11 rounded-full bg-surface-3 dark:bg-dark-surface-3" />

        <View className="mb-3.5 flex-row items-center gap-2 self-start rounded-md bg-brand-50 px-3.5 py-2.5 dark:bg-dark-surface-2">
          <View className="h-2 w-2 rounded-full bg-brand-600" />
          <Text className="text-[13px] font-semibold text-brand-700">{t('trip.intripHead')}</Text>
        </View>

        {/* Destination + fare card */}
        <View className="rounded-md border border-border bg-surface p-4 dark:border-dark-border dark:bg-dark-surface">
          <View className="flex-row items-start justify-between">
            <View className="flex-1">
              <Text className="font-mono text-[11px] uppercase tracking-wide text-text-faint dark:text-dark-text-faint">
                {t('req.dest')}
              </Text>
              <Text className="mt-0.5 text-[15px] font-semibold text-text dark:text-dark-text">
                {t('req.destAddr')}
              </Text>
            </View>
            <View className="items-end">
              <Text className="font-mono text-[11px] uppercase tracking-wide text-text-faint dark:text-dark-text-faint">
                {t('req.fare')}
              </Text>
              <Text className="mt-0.5 text-[18px] font-bold text-text dark:text-dark-text">
                {trip.fare}
                <Text className="text-[11px] font-semibold text-text-muted dark:text-dark-text-muted">
                  {' '}
                  {t('unit.currency')}
                </Text>
              </Text>
            </View>
          </View>
          <View className="mt-3 flex-row items-center gap-2 border-t border-border pt-3 dark:border-dark-border">
            <View className="h-7 w-7 items-center justify-center rounded-full bg-accent-500">
              <Text className="text-[11px] font-bold text-white">KA</Text>
            </View>
            <Text className="text-[13px] text-text-muted dark:text-dark-text-muted">
              {t('trip.rider')}
            </Text>
          </View>
        </View>

        {/* Drop-off phase: View directions → Google Maps · I've arrived (no Call) */}
        <View className="mt-3.5">
          <Button
            label={t('trip.directions')}
            variant="secondary"
            icon="navigation"
            onPress={() => openDirections(dropoff)}
          />
        </View>
        <View className="mt-2.5">
          <Button
            label={t('trip.arrived')}
            icon="check"
            onPress={() => router.replace('/active-trip/collect')}
          />
        </View>
      </View>
    </View>
  );
}

function MetricCard({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <View className="flex-1 rounded-md border border-border bg-surface px-3.5 py-2.5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
      <Text className="font-mono text-[11px] uppercase tracking-wide text-text-faint dark:text-dark-text-faint">
        {label}
      </Text>
      <Text className="mt-0.5 text-[18px] font-bold text-text dark:text-dark-text">
        {value}
        <Text className="text-[11px] font-semibold text-text-muted dark:text-dark-text-muted">
          {' '}
          {unit}
        </Text>
      </Text>
    </View>
  );
}
