import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type MapView from 'react-native-maps';

import { DjeraMap, Icon, Navbar } from '@/shared/components';
import { useDeviceLocation } from '@/shared/useDeviceLocation';

import { useDashboardStore } from './store';

// Mock summary — real values come from earnings/commission stores later.
const TODAY = { earnings: 320, trips: 15, hours: 6 };
const COMMISSION = { outstanding: 48 };

export function DashboardScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const online = useDashboardStore((s) => s.online);
  const setOnline = useDashboardStore((s) => s.setOnline);
  const pingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { location, hasFix } = useDeviceLocation();
  const mapRef = useRef<MapView | null>(null);

  // Re-center the map on the driver whenever we get a fresh GPS fix.
  useEffect(() => {
    if (hasFix) {
      mapRef.current?.animateCamera({ center: location, zoom: 15 }, { duration: 600 });
    }
  }, [hasFix, location]);

  const recenter = () =>
    mapRef.current?.animateCamera({ center: location, zoom: 15 }, { duration: 400 });

  // Going online mocks an incoming request after 3s (prototype behaviour).
  useEffect(() => {
    if (online) {
      pingTimer.current = setTimeout(() => router.push('/ride-requests'), 3000);
    }
    return () => {
      if (pingTimer.current) clearTimeout(pingTimer.current);
    };
  }, [online, router]);

  return (
    <View className="flex-1 bg-bg dark:bg-dark-bg">
      {/* Full-bleed map */}
      <DjeraMap ref={mapRef} driver={location} online={online} style={{ flex: 1 }} />

      {/* Top overlay: avatar (start) · bell (end) */}
      <View
        style={{ top: insets.top + 8 }}
        className="absolute inset-x-4 flex-row items-center"
      >
        <Pressable
          onPress={() => router.push('/profile')}
          accessibilityLabel="Profile"
          className="h-11 w-11 items-center justify-center rounded-full bg-brand-600 shadow"
        >
          <Text className="font-display text-sm font-bold text-text-onbrand">AM</Text>
        </Pressable>
        <View className="flex-1" />
        <Pressable
          accessibilityLabel="Notifications"
          className="h-11 w-11 items-center justify-center rounded-full border border-border bg-surface shadow dark:border-dark-border dark:bg-dark-surface"
        >
          <Icon name="bell" size={20} color="#1b1410" />
          <View className="absolute end-2.5 top-2 h-2 w-2 rounded-full border-2 border-surface bg-accent-600 dark:border-dark-surface" />
        </Pressable>
      </View>

      {/* Greeting card + online toggle */}
      <View
        style={{ top: insets.top + 60 }}
        className="absolute inset-x-4 rounded-lg border border-border bg-surface p-4 shadow-md dark:border-dark-border dark:bg-dark-surface"
      >
        <Text className="font-mono text-[11px] uppercase tracking-widest text-text-muted dark:text-dark-text-muted">
          {t('dash.weather')}
        </Text>
        <Text className="mt-0.5 font-display text-xl font-semibold text-text dark:text-dark-text">
          {t('dash.greet')}
        </Text>

        <Pressable
          onPress={() => setOnline(!online)}
          accessibilityRole="switch"
          accessibilityState={{ checked: online }}
          className="mt-3 flex-row items-center gap-3 rounded-lg border border-border bg-surface p-3.5 dark:border-dark-border dark:bg-dark-surface-2"
        >
          <View className={`h-3 w-3 rounded-full ${online ? 'bg-brand-500' : 'bg-text-faint'}`} />
          <View className="flex-1">
            <Text className="text-[15px] font-semibold text-text dark:text-dark-text">
              {t(online ? 'dash.onlineOn' : 'dash.online')}
            </Text>
            <Text className="mt-0.5 text-xs text-text-muted dark:text-dark-text-muted">
              {t(online ? 'dash.onlineListening' : 'dash.onlineTap')}
            </Text>
          </View>
          {/* Switch track */}
          <View
            className={`h-[30px] w-[50px] justify-center rounded-full px-[3px] ${
              online ? 'bg-brand-600' : 'bg-surface-3 dark:bg-dark-surface-3'
            }`}
          >
            <View
              className="h-6 w-6 rounded-full bg-white shadow"
              style={{ alignSelf: online ? 'flex-end' : 'flex-start' }}
            />
          </View>
        </Pressable>
      </View>

      {/* Map controls */}
      <View style={{ bottom: insets.bottom + 180 }} className="absolute end-4 gap-2">
        <View className="h-11 w-11 items-center justify-center rounded-full border border-border bg-surface shadow dark:border-dark-border dark:bg-dark-surface">
          <Icon name="layers" size={20} color="#1b1410" />
        </View>
        <Pressable
          onPress={recenter}
          accessibilityLabel="Recenter"
          className="h-11 w-11 items-center justify-center rounded-full border border-border bg-surface shadow dark:border-dark-border dark:bg-dark-surface"
        >
          <Icon name="navigation" size={18} color="#1b1410" />
        </Pressable>
      </View>

      {/* Bottom dock: today + commission */}
      <View
        style={{ bottom: insets.bottom + 84 }}
        className="absolute inset-x-4 flex-row overflow-hidden rounded-lg border border-border bg-surface shadow-md dark:border-dark-border dark:bg-dark-surface"
      >
        <Pressable onPress={() => router.push('/earnings')} className="flex-1 p-3.5">
          <Text className="font-mono text-[10px] uppercase tracking-widest text-text-muted dark:text-dark-text-muted">
            {t('dash.today')}
          </Text>
          <Text className="mt-1 text-[22px] font-bold text-text dark:text-dark-text">
            {TODAY.earnings}
            <Text className="text-xs font-semibold text-text-muted dark:text-dark-text-muted">
              {' '}
              {t('unit.currency')}
            </Text>
          </Text>
          <Text className="mt-0.5 text-[11.5px] text-text-faint dark:text-dark-text-faint">
            {TODAY.trips} {t('dash.trips')} · {TODAY.hours}
            {t('unit.hr')}
          </Text>
        </Pressable>

        <View className="w-px bg-border dark:bg-dark-border" />

        <Pressable onPress={() => router.push('/commission')} className="flex-1 p-3.5">
          <View className="flex-row items-center justify-between">
            <Text className="font-mono text-[10px] uppercase tracking-widest text-accent-600">
              {t('dash.commission')}
            </Text>
            <Icon name="arrowRight" size={12} color="#c9732f" />
          </View>
          <Text className="mt-1 text-[22px] font-bold text-accent-600">
            {COMMISSION.outstanding}
            <Text className="text-xs font-semibold"> {t('unit.currency')}</Text>
          </Text>
          <Text className="mt-0.5 text-[11.5px] text-text-faint dark:text-dark-text-faint">
            {t('dash.due')}
          </Text>
        </Pressable>
      </View>

      <Navbar active="home" />
    </View>
  );
}
