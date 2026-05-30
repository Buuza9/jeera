import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Appbar, Icon } from '@/shared/components';

import { TripCard } from './TripCard';
import { HISTORY_STATS, TRIPS, type TripRecord } from './data';

type Filter = 'all' | 'today' | 'yesterday';
const FILTERS: Filter[] = ['all', 'today', 'yesterday'];

export function TripHistoryScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  // Filter by day + free-text (rider / origin / destination), then group by day.
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = TRIPS.filter((tr) => {
      if (filter !== 'all' && tr.day !== filter) return false;
      if (q && !`${tr.from} ${tr.to} ${tr.rider}`.toLowerCase().includes(q)) return false;
      return true;
    });
    const days = [...new Set(rows.map((tr) => tr.day))];
    return days.map((day) => {
      const items = rows.filter((tr) => tr.day === day);
      const total = items.reduce((s, tr) => s + (tr.cancelled ? 0 : tr.lyd), 0);
      return { day, items, total };
    });
  }, [filter, query]);

  const empty = groups.length === 0;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-bg dark:bg-dark-bg">
      <View className="px-7">
        <Appbar title={t('hist.title')} onBack={() => router.navigate('/dashboard')} />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-7"
        contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Stats strip */}
        <View className="flex-row gap-2">
          <Stat label={t('dash.trips')} value={`${HISTORY_STATS.trips}`} />
          <Stat label={t('earn.cash')} value={`${HISTORY_STATS.cash}`} unit={t('unit.currency')} />
          <Stat label={t('earn.online')} value={`${HISTORY_STATS.hours}`} unit={t('unit.hr')} />
        </View>

        {/* Search */}
        <View className="mt-3.5 flex-row items-center gap-2.5 rounded-md border border-border bg-surface-2 px-3.5 dark:border-dark-border dark:bg-dark-surface-2">
          <Icon name="search" size={18} color="#8b857f" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t('hist.searchPh')}
            placeholderTextColor="#8b857f"
            autoCapitalize="none"
            autoCorrect={false}
            className="flex-1 py-3 text-[14px] text-text dark:text-dark-text"
          />
        </View>

        {/* Day filter */}
        <View className="mt-3.5 flex-row gap-1 rounded-md bg-surface-2 p-1 dark:bg-dark-surface-2">
          {FILTERS.map((f) => {
            const on = filter === f;
            return (
              <Pressable key={f} onPress={() => setFilter(f)} className="flex-1">
                <View className={`items-center rounded-[10px] py-2.5 ${on ? 'bg-surface dark:bg-dark-surface' : 'bg-transparent'}`}>
                  <Text
                    className={`text-[13.5px] font-semibold ${on ? 'text-text dark:text-dark-text' : 'text-text-muted dark:text-dark-text-muted'}`}
                  >
                    {t(`hist.${f}`)}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* List / empty */}
        {empty ? (
          <View className="items-center py-12">
            <Icon name="search" size={32} color="#8b857f" />
            <Text className="mt-3 text-[14px] text-text-faint dark:text-dark-text-faint">{t('hist.empty')}</Text>
          </View>
        ) : (
          groups.map((g) => (
            <View key={g.day} className="mt-4">
              <View className="mb-2 flex-row items-baseline justify-between px-1">
                <Text className="font-mono text-[11px] uppercase tracking-widest text-text-muted dark:text-dark-text-muted">
                  {t(`hist.${g.day}`)} · {g.items.length}
                </Text>
                <Text className="text-[13px] font-bold text-text dark:text-dark-text">
                  {g.total}
                  <Text className="text-[10px] font-semibold text-text-muted dark:text-dark-text-muted"> {t('unit.currency')}</Text>
                </Text>
              </View>
              <View className="gap-2">
                {g.items.map((tr: TripRecord) => (
                  <TripCard key={tr.id} trip={tr} />
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>

    </SafeAreaView>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <View className="flex-1 rounded-lg border border-border bg-surface p-3.5 dark:border-dark-border dark:bg-dark-surface">
      <Text className="text-[10px] uppercase tracking-wide text-text-muted dark:text-dark-text-muted" numberOfLines={2}>
        {label}
      </Text>
      <Text className="mt-1 text-[22px] font-bold text-text dark:text-dark-text" style={{ letterSpacing: -0.4 }}>
        {value}
        {unit ? (
          <Text className="text-[11px] font-semibold text-text-muted dark:text-dark-text-muted" style={{ letterSpacing: 0 }}>
            {' '}
            {unit}
          </Text>
        ) : null}
      </Text>
    </View>
  );
}
