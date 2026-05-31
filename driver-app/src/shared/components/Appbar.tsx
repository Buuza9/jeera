import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Icon } from './Icon';

type AppbarProps = {
  title?: string;
  /** Called when the back button is pressed. Defaults to router.back(). */
  onBack?: () => void;
  /** Hide the back button (e.g. top-level screens). */
  hideBack?: boolean;
  /** Optional trailing element (action button). */
  trailing?: React.ReactNode;
};

/**
 * Top app bar — round back button + display-font title. Mirrors the prototype
 * `.appbar`. RTL-safe: the back chevron points toward the start edge.
 */
export function Appbar({ title, onBack, hideBack = false, trailing }: AppbarProps) {
  const router = useRouter();
  return (
    <View className="flex-row items-center gap-2.5 pb-4">
      {hideBack ? null : (
        <Pressable
          onPress={onBack ?? (() => router.back())}
          accessibilityRole="button"
          accessibilityLabel="Back"
          className="h-10 w-10 items-center justify-center rounded-full border border-border bg-surface dark:border-dark-border dark:bg-dark-surface"
        >
          <Icon name="arrowLeft" size={20} color="#1b1410" />
        </Pressable>
      )}
      {title ? (
        <Text
          numberOfLines={1}
          className="flex-1 font-display text-lg font-semibold text-text dark:text-dark-text"
          style={{ letterSpacing: -0.4 }}
        >
          {title}
        </Text>
      ) : (
        <View className="flex-1" />
      )}
      {trailing}
    </View>
  );
}
