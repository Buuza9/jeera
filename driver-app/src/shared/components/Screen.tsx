import { type ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

type ScreenProps = {
  children: ReactNode;
  /** Wrap content in a ScrollView. Default false. */
  scroll?: boolean;
  /** Horizontal padding via NativeWind class. Default px-7. */
  className?: string;
  /** Which safe-area edges to inset. Default all. */
  edges?: Edge[];
  /** Extra classes for the inner content container. */
  contentClassName?: string;
};

/**
 * Base screen wrapper — themed background + safe-area insets. Mirrors the
 * prototype's `.screen` inside `.phone`. RTL-safe: uses logical padding only.
 */
export function Screen({
  children,
  scroll = false,
  className = '',
  edges = ['top', 'bottom', 'left', 'right'],
  contentClassName = '',
}: ScreenProps) {
  return (
    <SafeAreaView edges={edges} className={`flex-1 bg-bg dark:bg-dark-bg ${className}`}>
      {scroll ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName={`grow px-7 ${contentClassName}`}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View className={`flex-1 px-7 ${contentClassName}`}>{children}</View>
      )}
    </SafeAreaView>
  );
}
