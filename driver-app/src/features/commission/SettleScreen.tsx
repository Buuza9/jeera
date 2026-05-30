import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

import { Appbar, Button, Icon } from '@/shared/components';

import { CHANNELS, type ChannelId } from './data';
import { useCommissionStore } from './store';

export function SettleScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const outstanding = useCommissionStore((s) => s.outstanding);
  const settle = useCommissionStore((s) => s.settle);

  const [full, setFull] = useState(true);
  const [partial, setPartial] = useState('');
  const [channel, setChannel] = useState<ChannelId>('bank');
  const [ref, setRef] = useState<string | null>(null);

  // Amount being settled — full balance, or the (clamped) partial input.
  const partialNum = Math.min(Math.max(parseFloat(partial) || 0, 0), outstanding);
  const amount = full ? outstanding : partialNum;
  const amountLabel = Number.isInteger(amount) ? `${amount}` : amount.toFixed(2);

  const onConfirm = () => setRef(settle(amount));

  return (
    <SafeArea>
      <View className="px-7">
        <Appbar title={t('set.title')} />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-7 pb-32"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Amount block */}
        <View className="items-center rounded-lg border border-border bg-surface p-4 dark:border-dark-border dark:bg-dark-surface">
          <Text className="font-mono text-[11px] uppercase tracking-widest text-text-muted dark:text-dark-text-muted">
            {t('set.youOwe')}
          </Text>
          <Text className="mt-1.5 font-display text-[44px] font-semibold text-text dark:text-dark-text" style={{ letterSpacing: -1.8 }}>
            {amountLabel}
            <Text className="text-[17px] font-bold text-text-muted dark:text-dark-text-muted" style={{ letterSpacing: 0 }}> {t('unit.currency')}</Text>
          </Text>
          <Text className="text-[12.5px] text-text-muted dark:text-dark-text-muted">
            {t('set.outOf', { cap: outstanding })}
          </Text>

          {/* Full / partial segmented control — inline (matches the working Navbar pattern) */}
          <View className="mt-3.5 w-full flex-row gap-1 rounded-md bg-surface-2 p-1 dark:bg-dark-surface-2">
            {([['set.full', true], ['set.partial', false]] as const).map(([key, isFull]) => {
              const on = full === isFull;
              // Pressable className stays static; toggling classes live on an inner
              // View (a Pressable whose own className toggles crashes under NativeWind).
              return (
                <Pressable key={key} onPress={() => setFull(isFull)} className="flex-1">
                  <View className={`items-center rounded-[10px] py-2.5 ${on ? 'bg-surface dark:bg-dark-surface' : 'bg-transparent'}`}>
                    <Text
                      className={`text-[13.5px] font-semibold ${on ? 'text-text dark:text-dark-text' : 'text-text-muted dark:text-dark-text-muted'}`}
                    >
                      {t(key)}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {full ? null : (
            <View className="mt-3 w-full">
              <Text className="mb-1.5 text-[12.5px] font-semibold text-text-muted dark:text-dark-text-muted">
                {t('set.amount')}
              </Text>
              <View className="flex-row items-center rounded-md border border-border bg-surface px-3.5 dark:border-dark-border dark:bg-dark-surface">
                <TextInput
                  value={partial}
                  onChangeText={setPartial}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor="#8b857f"
                  className="flex-1 py-3 text-[18px] font-bold text-text dark:text-dark-text"
                />
                <Text className="text-[13px] font-semibold text-text-muted dark:text-dark-text-muted">
                  {t('unit.currency')}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Channel picker */}
        <Text className="mb-2.5 mt-4 px-1 font-mono text-[11px] uppercase tracking-widest text-text-muted dark:text-dark-text-muted">
          {t('set.channel')}
        </Text>
        <View className="gap-2.5">
          {CHANNELS.map((c) => {
            const on = channel === c.id;
            return (
              <Pressable
                key={c.id}
                onPress={() => setChannel(c.id)}
                className={`flex-row items-center gap-3 rounded-lg border-[1.5px] p-3.5 ${
                  on
                    ? 'border-brand-500 bg-brand-50 dark:bg-dark-surface-2'
                    : 'border-border bg-surface dark:border-dark-border dark:bg-dark-surface'
                }`}
              >
                <View
                  className={`h-10 w-10 items-center justify-center rounded-xl ${
                    on ? 'bg-brand-500' : 'bg-surface-2 dark:bg-dark-surface-2'
                  }`}
                >
                  <Icon name={c.icon} size={20} color={on ? '#ffffff' : '#5e5650'} />
                </View>
                <View className="flex-1">
                  <Text className="text-[14.5px] font-bold text-text dark:text-dark-text">{t(`set.ch.${c.id}.n`)}</Text>
                  <Text className="mt-0.5 text-[12px] leading-[16px] text-text-muted dark:text-dark-text-muted">
                    {t(`set.ch.${c.id}.d`)}
                  </Text>
                </View>
                <View
                  className={`h-[22px] w-[22px] items-center justify-center rounded-full border-2 ${
                    on ? 'border-brand-500' : 'border-border dark:border-dark-border'
                  }`}
                >
                  {on ? <View className="h-3 w-3 rounded-full bg-brand-500" /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        <View className="mt-3 flex-row justify-center">
          <View className="flex-row items-center gap-1.5 rounded-full bg-accent-600/12 px-2.5 py-1">
            <View className="h-[5px] w-[5px] rounded-full bg-accent-600" />
            <Text className="text-[10.5px] font-semibold text-accent-600">{t('set.todo')}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky confirm */}
      {ref ? null : (
        <View className="absolute inset-x-0 bottom-0 bg-bg px-7 pb-7 pt-3 dark:bg-dark-bg">
          <Button label={t('set.cta')} onPress={onConfirm} disabled={amount <= 0} />
        </View>
      )}

      {/* Confirmation overlay */}
      {ref ? (
        <Animated.View
          entering={FadeIn.duration(220)}
          className="absolute inset-0 items-center justify-center gap-3.5 bg-bg px-8 dark:bg-dark-bg"
        >
          <Animated.View
            entering={ZoomIn.springify().damping(12)}
            className="h-24 w-24 items-center justify-center rounded-full bg-brand-50 dark:bg-dark-surface-2"
          >
            <View
              className="h-[66px] w-[66px] items-center justify-center rounded-full bg-brand-500"
              style={{ shadowColor: '#3e784c', shadowOpacity: 0.45, shadowRadius: 24, shadowOffset: { width: 0, height: 10 } }}
            >
              <Icon name="check" size={34} color="#ffffff" strokeWidth={3.5} />
            </View>
          </Animated.View>
          <Text className="mt-1.5 text-center text-[22px] font-bold text-text dark:text-dark-text" style={{ letterSpacing: -0.5 }}>
            {t('set.done.title')}
          </Text>
          <Text className="max-w-[280px] text-center text-[14px] leading-[21px] text-text-muted dark:text-dark-text-muted">
            {t('set.done.sub')}
          </Text>
          <View className="rounded-full border border-border bg-surface px-3.5 py-1.5 dark:border-dark-border dark:bg-dark-surface">
            <Text className="text-[12.5px] text-text-muted dark:text-dark-text-muted">
              {t('set.ref')} <Text className="font-bold text-text dark:text-dark-text">{ref}</Text>
            </Text>
          </View>
          <View className="mt-1.5 w-full max-w-[240px]">
            <Button label={t('set.done.cta')} onPress={() => router.replace('/commission/history')} />
          </View>
        </Animated.View>
      ) : null}
    </SafeArea>
  );
}

function SafeArea({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-bg dark:bg-dark-bg">
      {children}
    </SafeAreaView>
  );
}
