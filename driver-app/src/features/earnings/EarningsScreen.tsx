import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Appbar, Icon } from '@/shared/components';

import { BarChart } from './BarChart';
import { EARNINGS, PERIODS, group, type Period } from './data';

export function EarningsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState<Period>('today');
  const d = EARNINGS[period];

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-bg dark:bg-dark-bg">
      <View className="px-7">
        <Appbar title={t('earn.title')} onBack={() => router.navigate('/dashboard')} />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-7"
        contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Period segmented control — inline (matches the working Navbar pattern) */}
        <View className="mb-3.5 flex-row gap-1 rounded-md bg-surface-2 p-1 dark:bg-dark-surface-2">
          {PERIODS.map((p) => {
            const on = period === p;
            // Pressable className stays static; the selected highlight lives on an
            // inner View. A Pressable whose own className toggles crashes under
            // NativeWind's wrapper, but a View's className can toggle safely.
            return (
              <Pressable key={p} onPress={() => setPeriod(p)} className="flex-1">
                <View className={`items-center rounded-[10px] py-2.5 ${on ? 'bg-surface dark:bg-dark-surface' : 'bg-transparent'}`}>
                  <Text
                    className={`text-[13.5px] font-semibold ${on ? 'text-text dark:text-dark-text' : 'text-text-muted dark:text-dark-text-muted'}`}
                  >
                    {t(`earn.${p}`)}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Hero — net earnings */}
        <View
          className="mb-3.5 overflow-hidden rounded-lg bg-brand-600 p-[22px]"
          style={{ shadowColor: '#194f29', shadowOpacity: 0.3, shadowRadius: 28, shadowOffset: { width: 0, height: 12 } }}
        >
          <Text className="font-mono text-[11px] uppercase tracking-widest text-brand-50/80">
            {t('earn.net')}
          </Text>
          <Text className="mt-1.5 font-display text-[52px] font-semibold text-white" style={{ letterSpacing: -2 }}>
            {group(d.net)}
            <Text className="text-[18px] font-semibold text-white/70" style={{ letterSpacing: 0 }}> {t('unit.currency')}</Text>
          </Text>
          <View className="mt-3 flex-row items-center gap-1 self-start rounded-full bg-white/15 px-3 py-1.5">
            <Text className="text-[12px] font-bold text-white">↑ +{d.prev}% {t('earn.vs')}</Text>
          </View>
        </View>

        {/* Bar chart — keyed by period so the grow animation replays on switch */}
        <BarChart key={period} values={d.bars} labels={d.labels} hi={d.hi} />

        {/* Stats grid — inline */}
        <View className="mt-3.5 flex-row flex-wrap gap-2">
          {(
            [
              { label: t('dash.trips'), value: `${d.trips}`, unit: undefined, warn: false },
              { label: t('earn.cash'), value: group(d.cash), unit: t('unit.currency'), warn: false },
              { label: t('earn.online'), value: `${d.hours}`, unit: t('unit.hr'), warn: false },
              { label: t('earn.comm'), value: group(d.comm), unit: t('unit.currency'), warn: true },
            ] as const
          ).map((s, i) => (
            <View
              key={i}
              className="min-w-[47%] flex-1 rounded-lg border border-border bg-surface p-3.5 dark:border-dark-border dark:bg-dark-surface"
            >
              <Text
                className={`font-mono text-[10px] uppercase tracking-widest ${
                  s.warn ? 'text-accent-700' : 'text-text-muted dark:text-dark-text-muted'
                }`}
              >
                {s.label}
              </Text>
              <Text
                className={`mt-1 text-[22px] font-bold ${s.warn ? 'text-accent-700' : 'text-text dark:text-dark-text'}`}
                style={{ letterSpacing: -0.4 }}
              >
                {s.value}
                {s.unit ? (
                  <Text
                    className={`text-[11px] font-semibold ${
                      s.warn ? 'text-accent-700' : 'text-text-muted dark:text-dark-text-muted'
                    }`}
                  >
                    {' '}
                    {s.unit}
                  </Text>
                ) : null}
              </Text>
            </View>
          ))}
        </View>

        {/* Breakdown */}
        <View className="mb-2.5 mt-5 flex-row items-center justify-between">
          <Text className="text-[15px] font-bold text-text dark:text-dark-text">{t('earn.breakdown')}</Text>
          <Pressable onPress={() => router.navigate('/trips')} className="flex-row items-center gap-1">
            <Text className="text-[13px] font-semibold text-brand-600">{t('hist.title')}</Text>
            <Icon name="arrowRight" size={14} color="#2a673a" />
          </Pressable>
        </View>
        <View className="rounded-lg border border-border bg-surface px-3.5 dark:border-dark-border dark:bg-dark-surface">
          {d.rows.map((r, i) => (
            <View
              key={i}
              className={`flex-row items-center gap-3 py-3 ${
                i > 0 ? 'border-t border-border dark:border-dark-border' : ''
              }`}
            >
              <View className="flex-1">
                <Text className="text-[13.5px] font-semibold text-text dark:text-dark-text" numberOfLines={1}>
                  {r.to ? (
                    <>
                      {r.from} <Text className="text-text-faint dark:text-dark-text-faint">→</Text> {r.to}
                    </>
                  ) : (
                    r.from
                  )}
                </Text>
                <Text className="mt-0.5 text-[11.5px] text-text-faint dark:text-dark-text-faint">{r.sub}</Text>
              </View>
              <Text className="text-[14px] font-bold text-text dark:text-dark-text">
                {group(r.lyd)}
                <Text className="text-[10px] font-semibold text-text-muted dark:text-dark-text-muted"> {t('unit.currency')}</Text>
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}
