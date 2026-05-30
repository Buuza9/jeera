import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import Animated, { Easing, FadeIn, SlideInDown } from 'react-native-reanimated';

import { Button } from '@/shared/components';
import { openDirections } from '@/shared/maps';

import { CountdownRing } from './CountdownRing';
import { MOCK_REQUEST } from './data';
import { useRideStore } from './store';

// Matches the prototype's --ease-spring (gentle overshoot).
const SPRING = Easing.bezier(0.34, 1.56, 0.64, 1).factory();

/**
 * Incoming ride request — presented as a transparent modal so it slides up as a
 * sheet OVER the live dashboard (the dashboard map stays mounted behind).
 */
export function RideRequestScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const storeReq = useRideStore((s) => s.incoming);
  const rejectRide = useRideStore((s) => s.reject);
  const acceptRide = useRideStore((s) => s.accept);
  const req = storeReq ?? MOCK_REQUEST; // fallback supports direct deep-link
  const [seconds, setSeconds] = useState(req.autoDeclineSeconds);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const dismissBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/dashboard');
  };

  // Reject / timeout: clear the request (removes the dashboard pin) + go back;
  // the dashboard re-searches and offers another.
  const onReject = () => {
    rejectRide();
    dismissBack();
  };

  // Accept: lock in the trip and move to the in-app to-pickup state. Does NOT
  // auto-open Google Maps — the driver launches navigation from the
  // "Navigate in Google Maps" button on the to-pickup screen.
  const onAccept = () => {
    acceptRide();
    router.replace('/active-trip/to-pickup');
  };

  // Auto-decline countdown → reject at 0.
  useEffect(() => {
    timer.current = setInterval(() => setSeconds((n) => n - 1), 1000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  useEffect(() => {
    if (seconds < 0) onReject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);

  return (
    <View className="flex-1 justify-end">
      {/* Dim backdrop over the dashboard */}
      <Animated.View
        entering={FadeIn.duration(220)}
        className="absolute inset-0 bg-black/40"
      />

      {/* Bottom sheet */}
      <Animated.View
        entering={SlideInDown.duration(420).easing(SPRING)}
        className="rounded-t-[28px] bg-bg px-5 pb-8 pt-2 dark:bg-dark-bg"
        style={{ shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 24, shadowOffset: { width: 0, height: -8 } }}
      >
        <View className="mx-auto mb-3 mt-1 h-[5px] w-11 rounded-full bg-surface-3 dark:bg-dark-surface-3" />

        {/* Header + countdown — matches prototype .sheet-head */}
        <View className="mb-4 flex-row items-center gap-3.5">
          <View className="flex-1">
            <Text className="font-display text-[22px] font-semibold text-text dark:text-dark-text">
              {t('req.incoming')}
            </Text>
            <Text className="mt-1 text-[13px] text-text-muted dark:text-dark-text-muted">
              {t('req.sub')}
            </Text>
          </View>
          <CountdownRing seconds={seconds} total={req.autoDeclineSeconds} />
        </View>

        {/* Route card */}
        <View className="mb-3.5 flex-row gap-3.5 rounded-md border border-border bg-surface p-[18px] dark:border-dark-border dark:bg-dark-surface">
          <View className="items-center pt-1.5">
            <View className="h-3 w-3 rounded-full bg-brand-600" />
            <View className="my-1.5 w-0.5 flex-1 bg-border dark:bg-dark-border" style={{ minHeight: 24 }} />
            <View className="h-3 w-3 rounded-[3px] bg-danger" />
          </View>
          <View className="flex-1 justify-between gap-6">
            <View className="flex-row items-start justify-between gap-2.5">
              <View className="flex-1">
                <Text className="font-mono text-[11px] uppercase tracking-wide text-text-faint dark:text-dark-text-faint">
                  {t('req.pickup')}
                </Text>
                <Text className="mt-0.5 text-[14.5px] font-semibold text-text dark:text-dark-text">
                  {t('req.pickupAddr')}
                </Text>
              </View>
              <Text className="text-[11.5px] font-semibold text-text-faint dark:text-dark-text-faint">
                {req.pickup.distanceKm} {t('unit.km')}
              </Text>
            </View>
            <View className="flex-row items-start justify-between gap-2.5">
              <View className="flex-1">
                <Text className="font-mono text-[11px] uppercase tracking-wide text-text-faint dark:text-dark-text-faint">
                  {t('req.dest')}
                </Text>
                <Text className="mt-0.5 text-[14.5px] font-semibold text-text dark:text-dark-text">
                  {t('req.destAddr')}
                </Text>
              </View>
              <Text className="text-[11.5px] font-semibold text-text-faint dark:text-dark-text-faint">
                {req.tripDistanceKm} {t('unit.km')}
              </Text>
            </View>
          </View>
        </View>

        {/* Metrics */}
        <View className="mb-4 flex-row gap-2">
          <Metric value={`${req.pickup.distanceKm}`} unit={t('unit.km')} label={t('req.toRider')} />
          <Metric value={`${req.tripDistanceKm}`} unit={t('unit.km')} label={t('req.trip')} />
          <Metric value={`${req.fare}`} unit={t('unit.currency')} label={t('req.fare')} highlight />
        </View>

        {/* Actions */}
        <View className="flex-row gap-2.5">
          <View className="flex-1">
            <Button label={t('req.reject')} variant="danger" onPress={onReject} />
          </View>
          <View style={{ flex: 1.4 }}>
            <Button label={t('req.accept')} onPress={onAccept} />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

function Metric({
  value,
  unit,
  label,
  highlight = false,
}: {
  value: string;
  unit: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <View
      className={`flex-1 items-center rounded-md border p-2.5 ${
        highlight
          ? 'border-brand-500/40 bg-brand-50 dark:bg-dark-surface-2'
          : 'border-border bg-surface dark:border-dark-border dark:bg-dark-surface'
      }`}
    >
      <Text
        className={`text-[18px] font-bold ${
          highlight ? 'text-brand-700' : 'text-text dark:text-dark-text'
        }`}
      >
        {value}
        <Text className="text-[11px] font-semibold text-text-muted dark:text-dark-text-muted">
          {' '}
          {unit}
        </Text>
      </Text>
      <Text className="mt-0.5 text-[11.5px] text-text-faint dark:text-dark-text-faint">{label}</Text>
    </View>
  );
}
