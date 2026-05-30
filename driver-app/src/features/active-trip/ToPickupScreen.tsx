import { useRouter } from 'expo-router';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Pressable, Text, View } from 'react-native';
import type MapView from 'react-native-maps';

import { Button, DjeraMap, Icon } from '@/shared/components';
import { haversineKm, regionForPoints } from '@/shared/geo';
import { openDirections } from '@/shared/maps';
import { useLocation } from '@/shared/LocationProvider';

import { useRideStore } from '@/features/ride-requests/store';
import { MOCK_REQUEST } from '@/features/ride-requests/data';

import { RecenterButton } from './RecenterButton';

const PHONE = 'tel:+218910000000';

export function ToPickupScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { location } = useLocation();
  const trip = useRideStore((s) => s.active) ?? MOCK_REQUEST;
  const pickup = trip.pickup.coord;
  const mapRef = useRef<MapView | null>(null);

  const km = haversineKm(location, pickup);
  const etaMin = Math.max(1, Math.ceil((km / 25) * 60)); // ~25 km/h city avg

  return (
    <View className="flex-1 bg-bg dark:bg-dark-bg">
      <DjeraMap
        ref={mapRef}
        driver={location}
        markers={[{ id: 'pickup', coord: pickup, kind: 'rider' }]}
        region={regionForPoints([location, pickup])}
        style={{ flex: 1 }}
      />

      {/* Top metrics — real distance from GPS to pickup */}
      <View className="absolute inset-x-[18px] top-16 flex-row gap-2">
        <MetricCard label={t('req.toRider')} value={km.toFixed(1)} unit={t('unit.km')} />
        <MetricCard label="ETA" value={`${etaMin}`} unit={t('unit.min')} />
      </View>

      <RecenterButton mapRef={mapRef} location={location} />

      {/* Bottom sheet */}
      <View className="absolute inset-x-0 bottom-0 rounded-t-[28px] bg-bg px-5 pb-8 pt-2 shadow-2xl dark:bg-dark-bg">
        <View className="mx-auto mb-3 mt-1 h-[5px] w-11 rounded-full bg-surface-3 dark:bg-dark-surface-3" />

        <View className="mb-3.5 flex-row items-center gap-2 self-start rounded-md bg-brand-50 px-3.5 py-2.5 dark:bg-dark-surface-2">
          <View className="h-2 w-2 rounded-full bg-brand-600" />
          <Text className="text-[13px] font-semibold text-brand-700">{t('trip.pickupHead')}</Text>
        </View>

        {/* Rider card */}
        <View className="mb-3.5 flex-row items-center gap-3 rounded-md border border-border bg-surface p-3.5 dark:border-dark-border dark:bg-dark-surface">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-accent-500">
            <Text className="font-display text-base font-bold text-white">KA</Text>
          </View>
          <View className="flex-1">
            <Text className="text-[15.5px] font-semibold text-text dark:text-dark-text">
              {t('trip.rider')}
            </Text>
            <Text className="mt-0.5 text-[13px] text-text-muted dark:text-dark-text-muted">
              {t('req.pickupAddr')}
            </Text>
          </View>
          <Pressable
            onPress={() => Linking.openURL(PHONE)}
            accessibilityLabel="Call"
            className="h-11 w-11 items-center justify-center rounded-full bg-brand-50 dark:bg-dark-surface-2"
          >
            <Icon name="phone" size={18} color="#194f29" />
          </Pressable>
        </View>

        {/* View directions → Google Maps · Call · I've arrived */}
        <Button
          label={t('trip.directions')}
          variant="secondary"
          icon="navigation"
          onPress={() => openDirections(pickup)}
        />
        <View className="mt-2.5 flex-row gap-2.5">
          <View className="flex-1">
            <Button label={t('trip.call')} variant="secondary" icon="phone" onPress={() => Linking.openURL(PHONE)} />
          </View>
          <View style={{ flex: 1.3 }}>
            <Button
              label={t('trip.arrived')}
              icon="check"
              onPress={() => router.replace('/active-trip/in-trip')}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

export function MetricCard({ label, value, unit }: { label: string; value: string; unit: string }) {
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
