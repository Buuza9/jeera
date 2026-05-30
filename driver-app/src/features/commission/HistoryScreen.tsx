import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Appbar, Icon, type IconName } from '@/shared/components';

import { CHANNELS, HISTORY_SUMMARY, SETTLEMENTS, type ChannelId } from './data';

const CHANNEL_ICON: Record<ChannelId, IconName> = Object.fromEntries(
  CHANNELS.map((c) => [c.id, c.icon]),
) as Record<ChannelId, IconName>;

// Settlements grouped by month, preserving the data order.
const MONTHS = SETTLEMENTS.reduce<{ key: string; rows: typeof SETTLEMENTS }[]>((acc, s) => {
  const grp = acc.find((g) => g.key === s.monthKey);
  if (grp) grp.rows.push(s);
  else acc.push({ key: s.monthKey, rows: [s] });
  return acc;
}, []);

export function HistoryScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-bg dark:bg-dark-bg">
      <View className="px-7">
        <Appbar title={t('com.h.title')} />
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-7 pb-10" showsVerticalScrollIndicator={false}>
        {/* Summary strip */}
        <View className="flex-row rounded-lg border border-border bg-surface p-3 dark:border-dark-border dark:bg-dark-surface">
          <Summary value={HISTORY_SUMMARY.thisMonth} label={t('com.h.thisMonth')} cur={t('unit.currency')} />
          <View className="w-px bg-border dark:bg-dark-border" />
          <Summary value={HISTORY_SUMMARY.allTime.toLocaleString()} label={t('com.h.allTime')} cur={t('unit.currency')} />
        </View>

        {MONTHS.map((grp) => (
          <View key={grp.key}>
            <Text className="mb-2.5 mt-4 px-1 font-mono text-[11px] uppercase tracking-widest text-text-muted dark:text-dark-text-muted">
              {t(grp.key)}
            </Text>
            <View className="gap-2.5">
              {grp.rows.map((s) => (
                <View
                  key={s.id}
                  className="flex-row items-center gap-3 rounded-lg border border-border bg-surface p-3.5 dark:border-dark-border dark:bg-dark-surface"
                >
                  <View className="h-[42px] w-[42px] items-center justify-center rounded-xl bg-brand-50 dark:bg-dark-surface-2">
                    <Icon name={CHANNEL_ICON[s.channel]} size={20} color="#194f29" />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-baseline justify-between gap-2">
                      <Text className="text-[14px] font-bold text-text dark:text-dark-text">{t(`set.ch.${s.channel}.n`)}</Text>
                      <Text className="text-[15px] font-bold text-text dark:text-dark-text">
                        {s.amount}
                        <Text className="text-[11px] font-semibold text-text-muted dark:text-dark-text-muted"> {t('unit.currency')}</Text>
                      </Text>
                    </View>
                    <View className="mt-1 flex-row flex-wrap items-center gap-x-2 gap-y-1">
                      <Text className="text-[12px] text-text-muted dark:text-dark-text-muted">{s.date}</Text>
                      <View className="h-[3px] w-[3px] rounded-full bg-text-faint" />
                      <Text className="text-[12px] font-semibold text-text-muted dark:text-dark-text-muted">{s.ref}</Text>
                      <View className="h-[3px] w-[3px] rounded-full bg-text-faint" />
                      <View className="flex-row items-center gap-1 rounded-full bg-brand-500/12 px-2 py-0.5">
                        <Icon name="check" size={11} color="#194f29" strokeWidth={3} />
                        <Text className="text-[10.5px] font-bold uppercase tracking-wide text-brand-700">{t('com.h.paid')}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function Summary({ value, label, cur }: { value: string | number; label: string; cur: string }) {
  return (
    <View className="flex-1 px-2 py-1">
      <Text className="text-[20px] font-bold text-text dark:text-dark-text" style={{ letterSpacing: -0.3 }}>
        {value}
        <Text className="text-[11px] font-semibold text-text-muted dark:text-dark-text-muted"> {cur}</Text>
      </Text>
      <Text className="mt-1 font-mono text-[10px] uppercase tracking-widest text-text-muted dark:text-dark-text-muted">
        {label}
      </Text>
    </View>
  );
}
