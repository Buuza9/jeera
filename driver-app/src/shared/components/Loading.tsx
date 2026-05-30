import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

function Dot({ delay }: { delay: number }) {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 480, easing: Easing.out(Easing.ease) }),
          withTiming(0, { duration: 720, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false,
      ),
    );
  }, [v, delay]);
  const style = useAnimatedStyle(() => ({
    opacity: 0.25 + v.value * 0.75,
    transform: [{ translateY: -4 * v.value }],
  }));
  return <Animated.View style={style} className="h-1.5 w-1.5 rounded-full bg-brand-600" />;
}

/**
 * Reusable in-app loading state — rotating route-spinner + bouncing dots.
 * Matches claude-design-mockups `.loading-page`. For the initial boot use
 * {@link Splash}.
 */
export function Loading({ label }: { label?: string }) {
  const spin = useSharedValue(0);
  useEffect(() => {
    spin.value = withRepeat(withTiming(1, { duration: 1050, easing: Easing.linear }), -1, false);
  }, [spin]);
  const spinStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${spin.value * 360}deg` }] }));

  return (
    <View className="flex-1 items-center justify-center bg-bg dark:bg-dark-bg">
      <Animated.View style={spinStyle} className="mb-5 h-16 w-16">
        <Svg width={64} height={64} viewBox="0 0 64 64">
          <Circle
            cx={32}
            cy={32}
            r={27}
            fill="none"
            stroke="#2a673a"
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray="44 120"
          />
        </Svg>
      </Animated.View>
      {label ? (
        <Text className="mb-4 text-[15.5px] font-semibold text-text dark:text-dark-text">
          {label}
        </Text>
      ) : null}
      <View className="flex-row gap-1.5">
        <Dot delay={0} />
        <Dot delay={150} />
        <Dot delay={300} />
      </View>
    </View>
  );
}
