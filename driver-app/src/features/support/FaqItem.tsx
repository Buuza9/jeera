import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutAnimation, Platform, Pressable, Text, UIManager, View } from 'react-native';

import { Icon } from '@/shared/components';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/** A single expand/collapse FAQ row. Smooth height via LayoutAnimation. */
export function FaqItem({ questionKey, answerKey, divider }: { questionKey: string; answerKey: string; divider: boolean }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((v) => !v);
  };

  return (
    <View className={divider ? 'border-t border-border dark:border-dark-border' : ''}>
      <Pressable onPress={toggle} className="flex-row items-center gap-3 px-4 py-[15px]">
        <Text className="flex-1 text-[14px] font-semibold text-text dark:text-dark-text">{t(questionKey)}</Text>
        <View style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}>
          <Icon name="chevDown" size={18} color="#8b857f" />
        </View>
      </Pressable>
      {open ? (
        <Text className="px-4 pb-4 text-[13.5px] leading-[21px] text-text-muted dark:text-dark-text-muted">
          {t(answerKey)}
        </Text>
      ) : null}
    </View>
  );
}
