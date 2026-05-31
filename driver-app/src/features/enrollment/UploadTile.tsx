import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/shared/components';

type UploadTileProps = {
  title: string;
  subtitle: string;
  /** Local URI of the picked image; undefined = not yet uploaded. */
  uri?: string;
  onPress: () => void;
};

/**
 * Document upload tile — dashed border when empty, solid brand-tinted with a
 * thumbnail once a photo is picked. Tap to (re)pick. Mirrors the prototype.
 */
export function UploadTile({ title, subtitle, uri, onPress }: UploadTileProps) {
  const done = !!uri;
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center gap-3 rounded-md border p-4 ${
        done
          ? 'border-brand-500 bg-brand-50 dark:bg-dark-surface-2'
          : 'border-dashed border-border bg-surface dark:border-dark-border dark:bg-dark-surface'
      }`}
    >
      {done ? (
        <Image source={{ uri }} style={{ width: 44, height: 44, borderRadius: 12 }} contentFit="cover" />
      ) : (
        <View className="h-11 w-11 items-center justify-center rounded-[12px] bg-surface-2 dark:bg-dark-surface-2">
          <Icon name="upload" size={20} color="#5e5650" />
        </View>
      )}
      <View className="min-w-0 flex-1">
        <Text className={`text-sm font-semibold ${done ? 'text-brand-700' : 'text-text dark:text-dark-text'}`}>
          {title}
        </Text>
        <Text className="mt-0.5 text-xs text-text-muted dark:text-dark-text-muted">{subtitle}</Text>
      </View>
      {done ? <Icon name="check" size={20} color="#194f29" strokeWidth={2.5} /> : null}
    </Pressable>
  );
}
