import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

const CHART_H = 110;

/**
 * Mini bar chart — heights grow from the baseline on mount. Mirrors the
 * prototype `.bars`. Re-mount (via a `key` on the period) replays the grow
 * animation when the period changes. The current bucket (`hi`) is brand-filled.
 */
export function BarChart({ values, labels, hi }: { values: number[]; labels: string[]; hi: number }) {
  const max = Math.max(...values, 1);
  return (
    <View className="rounded-lg border border-border bg-surface p-4 dark:border-dark-border dark:bg-dark-surface">
      <View className="mb-2 flex-row items-end gap-1" style={{ height: CHART_H }}>
        {values.map((v, i) => (
          <Bar key={i} target={(v / max) * CHART_H} highlight={i === hi} delay={i * 28} />
        ))}
      </View>
      <View className="flex-row gap-1">
        {labels.map((l, i) => (
          <Text
            key={i}
            className="flex-1 text-center text-[10px] text-text-faint dark:text-dark-text-faint"
          >
            {l}
          </Text>
        ))}
      </View>
    </View>
  );
}

function Bar({ target, highlight, delay }: { target: number; highlight: boolean; delay: number }) {
  const h = useSharedValue(0);
  useEffect(() => {
    h.value = withDelay(delay, withTiming(target, { duration: 420, easing: Easing.out(Easing.cubic) }));
  }, [h, target, delay]);
  const style = useAnimatedStyle(() => ({ height: h.value }));
  return (
    <Animated.View
      style={[{ flex: 1 }, style]}
      className={`rounded-t-[4px] ${highlight ? 'bg-brand-600' : 'bg-brand-100 dark:bg-brand-500/25'}`}
    />
  );
}
