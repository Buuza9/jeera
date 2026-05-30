import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Appbar, Button, Icon } from '@/shared/components';

import { ACCRUALS, SETTLEMENT_CAP } from './data';
import { useCommissionStore } from './store';

export function BalanceScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const outstanding = useCommissionStore((s) => s.outstanding);
  const cap = useCommissionStore((s) => s.cap);
  const pct = Math.min(100, Math.round((outstanding / cap) * 100));

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-bg dark:bg-dark-bg">
      <View className="px-7">
        <Appbar title={t('com.title')} />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-7 pb-48"
        showsVerticalScrollIndicator={false}
      >
        {/* Balance hero (amber) */}
        <View
          className="overflow-hidden rounded-lg bg-accent-500 p-[22px]"
          style={{ shadowColor: '#c9732f', shadowOpacity: 0.3, shadowRadius: 28, shadowOffset: { width: 0, height: 12 } }}
        >
          <Text className="font-mono text-[11px] uppercase tracking-widest text-white/80">
            {t('com.outstanding')}
          </Text>
          <Text className="mt-1 font-display text-[56px] font-semibold text-white" style={{ letterSpacing: -2.2 }}>
            {outstanding}
            <Text className="text-[18px] font-semibold text-white/75"> {t('unit.currency')}</Text>
          </Text>
          <View className="mt-3.5 h-1.5 overflow-hidden rounded-full bg-white/25">
            <View className="h-full rounded-full bg-white" style={{ width: `${pct}%` }} />
          </View>
          <Text className="mt-1.5 text-[11.5px] font-semibold text-white/85">
            {t('com.cap', { balance: outstanding, cap })}
          </Text>
        </View>

        {/* Settlement info */}
        <View className="mt-3.5 rounded-lg border border-border bg-surface p-4 dark:border-dark-border dark:bg-dark-surface">
          <View className="flex-row items-start justify-between">
            <View>
              <Text className="font-mono text-[11px] uppercase tracking-widest text-text-muted dark:text-dark-text-muted">
                {t('com.next')}
              </Text>
              <Text className="mt-1 text-[16px] font-bold text-text dark:text-dark-text">
                {t('com.nextVal')}
              </Text>
            </View>
            <View className="rounded-full bg-warn/15 px-2.5 py-1">
              <Text className="text-[11.5px] font-bold text-warn">{t('com.rate')}</Text>
            </View>
          </View>
          <View className="mt-3 flex-row flex-wrap items-center gap-x-1.5 gap-y-1 border-t border-border pt-3 dark:border-dark-border">
            <Text className="text-[13px] leading-[18px] text-text-muted dark:text-dark-text-muted">
              {t('com.policy', { cap: SETTLEMENT_CAP })}
            </Text>
            <View className="flex-row items-center gap-1 rounded-full bg-accent-600/12 px-2 py-0.5">
              <View className="h-[5px] w-[5px] rounded-full bg-accent-600" />
              <Text className="text-[10px] font-semibold text-accent-600">TODO §5</Text>
            </View>
          </View>
        </View>

        {/* Recent accruals */}
        <Text className="mb-2.5 mt-5 text-[15px] font-bold text-text dark:text-dark-text">
          {t('com.recent')}
        </Text>
        <View className="rounded-lg border border-border bg-surface px-3.5 dark:border-dark-border dark:bg-dark-surface">
          {ACCRUALS.map((it, i) => (
            <View
              key={it.id}
              className={`flex-row items-center gap-3 py-3 ${
                i > 0 ? 'border-t border-border dark:border-dark-border' : ''
              }`}
            >
              <View className="h-8 w-8 items-center justify-center rounded-lg bg-accent-600/12">
                <Icon name="plus" size={14} color="#c9732f" />
              </View>
              <View className="flex-1">
                <Text className="text-[13.5px] font-semibold text-text dark:text-dark-text" numberOfLines={1}>
                  {it.trip}
                </Text>
                <Text className="mt-0.5 text-[11.5px] text-text-faint dark:text-dark-text-faint">
                  {it.time} · {it.fare} {t('unit.currency')} {t('com.fare')}
                </Text>
              </View>
              <Text className="text-[14px] font-bold text-accent-700">
                +{it.commission.toFixed(2)}
                <Text className="text-[10px] font-semibold"> {t('unit.currency')}</Text>
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Sticky action bar — stacked full-width so both labels stay centered */}
      <View className="absolute inset-x-0 bottom-0 gap-2.5 bg-bg px-7 pb-7 pt-3 dark:bg-dark-bg">
        <Button label={t('com.settle')} onPress={() => router.push('/commission/settle')} />
        <Button label={t('com.history')} variant="secondary" onPress={() => router.push('/commission/history')} />
      </View>
    </SafeAreaView>
  );
}
