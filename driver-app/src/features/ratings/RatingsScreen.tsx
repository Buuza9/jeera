import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Appbar, Icon } from '@/shared/components';

import { StarRating } from './StarRating';
import { OVERVIEW, REVIEWS } from './data';

export function RatingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-bg dark:bg-dark-bg">
      <View className="px-7">
        <Appbar title={t('rat.title')} onBack={() => (router.canGoBack() ? router.back() : router.navigate('/profile'))} />
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-7 pb-10" showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View className="flex-row items-center gap-5 rounded-lg border border-border bg-surface p-[22px] dark:border-dark-border dark:bg-dark-surface">
          <View>
            <Text className="font-display text-[52px] font-semibold text-text dark:text-dark-text" style={{ letterSpacing: -2 }}>
              {OVERVIEW.rating}
            </Text>
            <View className="mt-1.5">
              <StarRating value={5} size={15} />
            </View>
          </View>
          <View className="flex-1">
            <Text className="text-[13px] text-text-muted dark:text-dark-text-muted">
              {t('rat.based', { count: OVERVIEW.count })}
            </Text>
            <View className="mt-2.5 flex-row items-center gap-1.5 self-start rounded-full bg-brand-500/12 px-2.5 py-1">
              <Icon name="star" size={12} color="#194f29" filled />
              <Text className="text-[11.5px] font-bold text-brand-700">{t('rat.top')}</Text>
            </View>
          </View>
        </View>

        {/* Breakdown */}
        <Text className="mb-2.5 mt-5 px-1 font-mono text-[11px] uppercase tracking-widest text-text-muted dark:text-dark-text-muted">
          {t('rat.breakdown')}
        </Text>
        <View className="gap-2 rounded-lg border border-border bg-surface p-4 dark:border-dark-border dark:bg-dark-surface">
          {OVERVIEW.breakdown.map((b) => (
            <View key={b.stars} className="flex-row items-center gap-2.5">
              <View className="w-7 flex-row items-center gap-0.5">
                <Text className="text-[12px] text-text-muted dark:text-dark-text-muted">{b.stars}</Text>
                <Icon name="star" size={10} color="#e18e43" filled />
              </View>
              <View className="h-[7px] flex-1 overflow-hidden rounded-full bg-surface-2 dark:bg-dark-surface-2">
                <View className="h-full rounded-full bg-brand-500" style={{ width: `${b.pct}%` }} />
              </View>
              <Text className="w-9 text-end text-[12px] text-text-faint dark:text-dark-text-faint">{b.n}</Text>
            </View>
          ))}
        </View>

        {/* Behaviour stats */}
        <View className="mt-3.5 flex-row gap-2">
          {OVERVIEW.behaviour.map((s) => (
            <View key={s.key} className="flex-1 items-center rounded-lg border border-border bg-surface py-3.5 dark:border-dark-border dark:bg-dark-surface">
              <Text className="text-[20px] font-bold text-text dark:text-dark-text" style={{ letterSpacing: -0.4 }}>
                {s.value}
                <Text className="text-[12px]">%</Text>
              </Text>
              <Text className="mt-1 text-[11px] text-text-muted dark:text-dark-text-muted">{t(s.key)}</Text>
            </View>
          ))}
        </View>

        {/* Recent reviews */}
        <Text className="mb-2.5 mt-5 px-1 font-mono text-[11px] uppercase tracking-widest text-text-muted dark:text-dark-text-muted">
          {t('rat.recent')}
        </Text>
        <View className="gap-2.5">
          {REVIEWS.map((r) => (
            <View key={r.id} className="rounded-lg border border-border bg-surface p-4 dark:border-dark-border dark:bg-dark-surface">
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-accent-500">
                  <Text className="font-display text-[14px] font-bold text-white">{r.initials}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-[14px] font-semibold text-text dark:text-dark-text">{t(r.nameKey)}</Text>
                  <Text className="mt-0.5 text-[11.5px] text-text-faint dark:text-dark-text-faint">{t(r.agoKey)}</Text>
                </View>
                <StarRating value={r.stars} size={13} gap={2} />
              </View>
              <Text className="mt-2.5 text-[13.5px] leading-[20px] text-text-muted dark:text-dark-text-muted">{t(r.commentKey)}</Text>
              <View className="mt-2.5 flex-row flex-wrap gap-1.5">
                {r.tagKeys.map((tag) => (
                  <View key={tag} className="rounded-full bg-surface-2 px-2.5 py-1 dark:bg-dark-surface-2">
                    <Text className="text-[11px] font-medium text-text-muted dark:text-dark-text-muted">{t(tag)}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
