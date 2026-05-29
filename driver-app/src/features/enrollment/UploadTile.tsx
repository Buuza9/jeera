import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/shared/components';

type UploadTileProps = {
  title: string;
  subtitle: string;
  done: boolean;
  onPress: () => void;
};

/**
 * Document upload tile — dashed border when empty, solid brand-tinted when done.
 * Mirrors the prototype `.upload-tile`. Mock: tapping toggles the done state
 * (no real picker yet — wires to expo-image-picker + Supabase Storage later).
 */
export function UploadTile({ title, subtitle, done, onPress }: UploadTileProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center gap-3 rounded-md border p-4 ${
        done
          ? 'border-brand-500 bg-brand-50 dark:bg-dark-surface-2'
          : 'border-dashed border-border bg-surface dark:border-dark-border dark:bg-dark-surface'
      }`}
    >
      <View
        className={`h-11 w-11 items-center justify-center rounded-[12px] ${
          done ? 'bg-brand-600' : 'bg-surface-2 dark:bg-dark-surface-2'
        }`}
      >
        <Icon name={done ? 'check' : 'upload'} size={20} color={done ? '#fcf8f1' : '#5e5650'} />
      </View>
      <View className="min-w-0 flex-1">
        <Text
          className={`text-sm font-semibold ${
            done ? 'text-brand-700' : 'text-text dark:text-dark-text'
          }`}
        >
          {title}
        </Text>
        <Text className="mt-0.5 text-xs text-text-muted dark:text-dark-text-muted">{subtitle}</Text>
      </View>
    </Pressable>
  );
}
