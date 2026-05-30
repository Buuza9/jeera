import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const R = 23.5;
const C = 2 * Math.PI * R;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * Circular countdown ring. The arc sweeps down **smoothly** over `total`
 * seconds (continuous Reanimated timing, not per-second jumps — mirrors the
 * prototype's `transition: stroke-dashoffset`). Colour steps brand → amber
 * (≤7s) → red (≤3s); the centre number ticks each second from the parent.
 */
export function CountdownRing({ seconds, total }: { seconds: number; total: number }) {
  const progress = useSharedValue(1); // 1 → 0 over the full window

  useEffect(() => {
    progress.value = withTiming(0, { duration: total * 1000, easing: Easing.linear });
  }, [progress, total]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: C * (1 - progress.value),
  }));

  const color = seconds <= 3 ? '#c5372f' : seconds <= 7 ? '#c9732f' : '#2a673a';

  return (
    <View className="h-14 w-14 items-center justify-center">
      <Svg width={56} height={56} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={28} cy={28} r={R} fill="none" stroke="#f5f1ea" strokeWidth={4.2} />
        <AnimatedCircle
          cx={28}
          cy={28}
          r={R}
          fill="none"
          stroke={color}
          strokeWidth={4.2}
          strokeLinecap="round"
          strokeDasharray={C}
          animatedProps={animatedProps}
        />
      </Svg>
      <Text className="absolute text-[18px] font-bold text-text dark:text-dark-text">
        {Math.max(0, seconds)}
      </Text>
    </View>
  );
}
