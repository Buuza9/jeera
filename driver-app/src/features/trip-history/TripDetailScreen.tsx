import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, DjeraMap, Icon } from '@/shared/components';
import { TRIPOLI, regionForPoints } from '@/shared/geo';

import { TRIPS, commissionOf, initials, netOf, stripZeros, tripById } from './data';

const PHONE = 'tel:+218910000000';
// Mock route for the detail map (prototype uses a fixed Tripoli route).
const PICKUP = TRIPOLI.andalus;
const DROPOFF = TRIPOLI.gargaresh;

export function TripDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const trip = tripById(id) ?? TRIPS[0];

  const com = commissionOf(trip.lyd);
  const net = netOf(trip.lyd);
  const durationMin = Math.round(trip.km * 2.4);

  // Timeline stamps derived from the end time.
  const [h, m] = trip.time.split(':').map(Number);
  const at = (delta: number) =>
    `${String(h).padStart(2, '0')}:${String(Math.max(0, m - delta)).padStart(2, '0')}`;
  const timeline: { key: string; time: string }[] = [
    { key: 'hist.tl.accept', time: at(22) },
    { key: 'hist.tl.arrive', time: at(18) },
    { key: 'hist.tl.start', time: at(15) },
    { key: 'hist.tl.end', time: trip.time },
  ];

  // Back arrow → return to where you came from (the trips list).
  const goBack = () => (router.canGoBack() ? router.back() : router.navigate('/trips'));
  // Drag the grabber down → go to the main dashboard (home). dismissTo pops to
  // the existing tabs group and lands on the home tab (no duplicate stack entry).
  const goHome = () => {
    if (router.canDismiss()) router.dismissTo('/dashboard');
    else router.replace('/dashboard');
  };

  // Drag the grabber: the sheet follows the finger (downward only). Past a
  // threshold / fast flick it slides the rest of the way down, then lands on the
  // dashboard; otherwise it springs back.
  const translateY = useSharedValue(0);
  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateY.value = Math.max(0, e.translationY);
    })
    .onEnd((e) => {
      if (e.translationY > 140 || e.velocityY > 800) {
        translateY.value = withTiming(700, { duration: 220 }, (done) => {
          if (done) runOnJS(goHome)();
        });
      } else {
        translateY.value = withSpring(0, { damping: 18, stiffness: 180 });
      }
    });
  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));

  return (
    <View className="flex-1 bg-bg dark:bg-dark-bg">
      {/* Map */}
      <View className="absolute inset-x-0 top-0" style={{ height: 360 }}>
        <DjeraMap
          markers={[
            { id: 'pickup', coord: PICKUP, kind: 'rider' },
            { id: 'dropoff', coord: DROPOFF, kind: 'dest' },
          ]}
          route={[PICKUP, TRIPOLI.center, DROPOFF]}
          region={regionForPoints([PICKUP, DROPOFF])}
          scrollEnabled={false}
          style={{ flex: 1 }}
        />
      </View>

      {/* Floating back + status */}
      <View style={{ top: insets.top + 8 }} className="absolute inset-x-4 z-30 flex-row items-center justify-between">
        <Pressable
          onPress={goBack}
          accessibilityLabel="Back"
          className="h-11 w-11 items-center justify-center rounded-full border border-border bg-surface shadow dark:border-dark-border dark:bg-dark-surface"
        >
          <Icon name="arrowLeft" size={20} color="#1b1410" />
        </Pressable>
        <View className="flex-row items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 shadow dark:bg-dark-surface">
          <Icon name="check" size={12} color="#194f29" strokeWidth={3} />
          <Text className="text-[12px] font-bold text-brand-700">{t('hist.detail.head')}</Text>
        </View>
      </View>

      {/* Sheet — draggable: grab the bar to drag down + dismiss; content scrolls under the fixed grabber */}
      <Animated.View
        className="absolute inset-x-0 bottom-0 z-20 rounded-t-[28px] bg-bg dark:bg-dark-bg"
        style={[
          { top: 300, shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 30, shadowOffset: { width: 0, height: -10 } },
          sheetStyle,
        ]}
      >
        {/* Fixed grabber (drag handle) — stays put while the content scrolls */}
        <GestureDetector gesture={pan}>
          <View className="items-center pb-1.5 pt-3">
            <View className="h-[5px] w-11 rounded-full bg-surface-3 dark:bg-dark-surface-3" />
          </View>
        </GestureDetector>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          contentContainerClassName="px-[22px] pt-1"
          showsVerticalScrollIndicator={false}
        >

        {/* Header */}
        <View className="mb-4 flex-row items-start justify-between">
          <View className="flex-1">
            <Text className="font-mono text-[10.5px] uppercase tracking-widest text-text-muted dark:text-dark-text-muted">
              {t(`hist.${trip.day}`)} · {trip.time}
            </Text>
            <Text className="mt-1 font-display text-[20px] font-semibold text-text dark:text-dark-text" numberOfLines={1}>
              {trip.from} <Text className="text-text-faint dark:text-dark-text-faint">→</Text> {trip.to}
            </Text>
          </View>
          <View className="items-end">
            <Text className="font-mono text-[10.5px] uppercase tracking-widest text-text-muted dark:text-dark-text-muted">
              {t('hist.net')}
            </Text>
            <Text className="mt-0.5 font-display text-[28px] font-bold text-brand-700" style={{ letterSpacing: -0.7 }}>
              {stripZeros(net)}
              <Text className="text-[12px] font-semibold text-text-muted dark:text-dark-text-muted" style={{ letterSpacing: 0 }}> {t('unit.currency')}</Text>
            </Text>
          </View>
        </View>

        {/* Route card */}
        <View className="mb-3.5 flex-row gap-3.5 rounded-lg border border-border bg-surface p-4 dark:border-dark-border dark:bg-dark-surface">
          <View className="items-center pt-1.5">
            <View className="h-3 w-3 rounded-full bg-brand-600" />
            <View className="my-1.5 w-0.5 flex-1 bg-border dark:bg-dark-border" style={{ minHeight: 22 }} />
            <View className="h-3 w-3 rounded-[3px] bg-danger" />
          </View>
          <View className="flex-1 justify-between gap-5">
            <View>
              <Text className="font-mono text-[11px] uppercase tracking-wide text-text-faint dark:text-dark-text-faint">{t('req.pickup')}</Text>
              <Text className="mt-0.5 text-[14.5px] font-semibold text-text dark:text-dark-text">{trip.from}</Text>
            </View>
            <View>
              <Text className="font-mono text-[11px] uppercase tracking-wide text-text-faint dark:text-dark-text-faint">{t('req.dest')}</Text>
              <Text className="mt-0.5 text-[14.5px] font-semibold text-text dark:text-dark-text">{trip.to}</Text>
            </View>
          </View>
        </View>

        {/* Distance + duration */}
        <View className="mb-3.5 flex-row gap-2">
          <Meta label={t('trip.distance')} value={`${trip.km}`} unit={t('unit.km')} />
          <Meta label={t('trip.duration')} value={`${durationMin}`} unit={t('unit.min')} />
        </View>

        {/* Fare breakdown */}
        <Text className="mb-2.5 text-[15px] font-bold text-text dark:text-dark-text">{t('hist.fare.trip')}</Text>
        <View className="mb-3.5 rounded-lg border border-border bg-surface px-4 dark:border-dark-border dark:bg-dark-surface">
          <FareRow label={t('hist.fare.trip')} value={`${trip.lyd} ${t('unit.currency')}`} />
          <FareRow label={t('trip.commission')} value={`− ${com} ${t('unit.currency')}`} warn />
          <FareRow label={t('hist.net')} value={`${stripZeros(net)} ${t('unit.currency')}`} bold />
        </View>

        {/* Rider */}
        <Text className="mb-2.5 text-[15px] font-bold text-text dark:text-dark-text">{t('hist.rider')}</Text>
        <View className="mb-3.5 flex-row items-center gap-3 rounded-lg border border-border bg-surface p-3.5 dark:border-dark-border dark:bg-dark-surface">
          <View className="h-11 w-11 items-center justify-center rounded-full bg-accent-500">
            <Text className="font-display text-[14px] font-bold text-white">{initials(trip.rider)}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-[14.5px] font-semibold text-text dark:text-dark-text">{trip.rider}</Text>
            <View className="mt-0.5 flex-row items-center gap-1">
              <Icon name="star" size={11} color="#a85d22" filled />
              <Text className="text-[11.5px] text-accent-700">4.8 · {t('hist.paid')}</Text>
            </View>
          </View>
          <Pressable
            onPress={() => Linking.openURL(PHONE)}
            accessibilityLabel="Call"
            className="h-11 w-11 items-center justify-center rounded-full bg-brand-50 dark:bg-dark-surface-2"
          >
            <Icon name="phone" size={18} color="#194f29" />
          </Pressable>
        </View>

        {/* Timeline */}
        <Text className="mb-2.5 text-[15px] font-bold text-text dark:text-dark-text">{t('hist.timeline')}</Text>
        <View className="mb-3.5 rounded-lg border border-border bg-surface p-[18px] dark:border-dark-border dark:bg-dark-surface">
          {timeline.map((step, i) => (
            <View key={step.key} className="flex-row gap-3.5 py-2">
              <View className="items-center">
                <View className="mt-1 h-3 w-3 rounded-full border-[3px] border-brand-50 bg-brand-600 dark:border-dark-surface-2" />
                {i < timeline.length - 1 ? (
                  <View className="my-0.5 w-0.5 flex-1 bg-border dark:bg-dark-border" style={{ minHeight: 14 }} />
                ) : null}
              </View>
              <View className="flex-1 flex-row items-center justify-between">
                <Text className="text-[13.5px] text-text dark:text-dark-text">{t(step.key)}</Text>
                <Text className="text-[13px] text-text-muted dark:text-dark-text-muted">{step.time}</Text>
              </View>
            </View>
          ))}
        </View>

          {/* Support (inert until the support feature lands) */}
          <Button label={t('hist.help')} variant="secondary" icon="shield" />
        </ScrollView>
      </Animated.View>
    </View>
  );
}

function Meta({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <View className="flex-1 rounded-lg border border-border bg-surface px-3.5 py-3 dark:border-dark-border dark:bg-dark-surface">
      <Text className="font-mono text-[11px] uppercase tracking-wide text-text-faint dark:text-dark-text-faint">{label}</Text>
      <Text className="mt-0.5 text-[18px] font-bold text-text dark:text-dark-text">
        {value}
        <Text className="text-[11px] font-semibold text-text-muted dark:text-dark-text-muted"> {unit}</Text>
      </Text>
    </View>
  );
}

function FareRow({ label, value, warn = false, bold = false }: { label: string; value: string; warn?: boolean; bold?: boolean }) {
  return (
    <View className={`flex-row items-center justify-between py-3 ${bold ? 'border-t border-border dark:border-dark-border' : ''}`}>
      <Text className={`text-[13.5px] ${bold ? 'font-bold text-text dark:text-dark-text' : 'font-medium text-text-muted dark:text-dark-text-muted'}`}>
        {label}
      </Text>
      <Text className={`text-[14px] font-bold ${bold ? 'text-brand-700' : warn ? 'text-accent-700' : 'text-text dark:text-dark-text'}`}>
        {value}
      </Text>
    </View>
  );
}
