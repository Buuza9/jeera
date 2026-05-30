import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Button, Icon } from '@/shared/components';
import { useRideStore } from '@/features/ride-requests/store';

import { RATE_HINTS, RATE_TAGS } from './data';

export function RateRiderScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const finish = useRideStore((s) => s.finish);

  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState<Set<string>>(new Set());
  const [note, setNote] = useState('');

  const toggleTag = (tag: string) =>
    setTags((prev) => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });

  // Submit / skip both clear the ride and return home. Real impl POSTs the rating.
  const done = () => {
    finish();
    router.replace('/dashboard');
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-bg dark:bg-dark-bg">
      {/* Skip */}
      <View className="absolute end-6 top-3 z-10" style={{ marginTop: 8 }}>
        <Pressable onPress={done} hitSlop={8}>
          <Text className="text-[13.5px] font-semibold text-text-muted dark:text-dark-text-muted">{t('rr.skip')}</Text>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="grow items-center px-7 pb-8 pt-12"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Rider */}
        <View
          className="h-[76px] w-[76px] items-center justify-center rounded-full bg-accent-500"
          style={{ shadowColor: '#c9732f', shadowOpacity: 0.3, shadowRadius: 24, shadowOffset: { width: 0, height: 10 } }}
        >
          <Text className="font-display text-[26px] font-bold text-white">KA</Text>
        </View>
        <Text className="mt-[18px] font-display text-[24px] font-semibold text-text dark:text-dark-text" style={{ letterSpacing: -0.7 }}>
          {t('rr.title')}
        </Text>
        <Text className="mt-1 text-[14.5px] text-text-muted dark:text-dark-text-muted">
          {t('rr.sub')} <Text className="font-semibold text-text dark:text-dark-text">{t('rr.rider')}</Text>?
        </Text>

        {/* Stars */}
        <View className="mt-7 flex-row gap-2.5">
          {[1, 2, 3, 4, 5].map((v) => (
            <Pressable key={v} onPress={() => setRating(v)} hitSlop={4}>
              <Icon name="star" size={38} color={v <= rating ? '#e18e43' : '#bfb6ab'} filled={v <= rating} strokeWidth={1.4} />
            </Pressable>
          ))}
        </View>
        <Text className="mt-2 min-h-[18px] text-[13px] font-semibold text-text-faint dark:text-dark-text-faint">
          {rating > 0 ? t(RATE_HINTS[rating]) : ''}
        </Text>

        {/* Tags (after rating) */}
        {rating > 0 ? (
          <Animated.View entering={FadeIn.duration(220)} className="mt-4 w-full flex-row flex-wrap justify-center gap-2">
            {RATE_TAGS.map((tag) => {
              const on = tags.has(tag);
              return (
                <Pressable key={tag} onPress={() => toggleTag(tag)}>
                  <View
                    className={`rounded-full border px-3.5 py-2 ${
                      on ? 'border-brand-500 bg-brand-50 dark:bg-dark-surface-2' : 'border-border bg-surface dark:border-dark-border dark:bg-dark-surface'
                    }`}
                  >
                    <Text className={`text-[13px] font-semibold ${on ? 'text-brand-700' : 'text-text dark:text-dark-text'}`}>{t(tag)}</Text>
                  </View>
                </Pressable>
              );
            })}
          </Animated.View>
        ) : null}

        {/* Note */}
        <View className="mt-4 w-full rounded-md border border-border bg-surface px-3.5 dark:border-dark-border dark:bg-dark-surface">
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder={t('rr.note.ph')}
            placeholderTextColor="#8b857f"
            multiline
            className="min-h-[64px] py-3.5 text-[14px] text-text dark:text-dark-text"
            textAlignVertical="top"
          />
        </View>

        <View className="flex-1" />

        <View className="mt-6 w-full">
          <Button label={t('rr.submit')} onPress={done} disabled={rating === 0} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
