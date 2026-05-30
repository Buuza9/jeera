import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { G, Path } from 'react-native-svg';

const BAR_W = 132;
const SEG_W = 60;

/** White dart glyph (the brand mark's dart, no square) for the frosted tile. */
function Dart({ size = 52 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80">
      <G transform="rotate(-12 40 40)">
        <Path d="M40 18 L58 60 L40 51 Z" fill="#ffffff" opacity={0.98} />
        <Path d="M40 18 L22 60 L40 51 Z" fill="#ffffff" opacity={0.55} />
      </G>
    </Svg>
  );
}

function PulseRing({ delay }: { delay: number }) {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: 2400, easing: Easing.out(Easing.ease) }), -1, false),
    );
  }, [p, delay]);
  const style = useAnimatedStyle(() => ({
    opacity: 0.5 * (1 - p.value),
    transform: [{ scale: 1 + p.value * 0.8 }],
  }));
  return (
    <Animated.View
      pointerEvents="none"
      style={style}
      className="absolute h-24 w-24 rounded-[30px] border-2 border-white/40"
    />
  );
}

/**
 * Branded boot splash — dark brand-gradient, frosted brand tile with pulsing
 * rings, "Djera جيرا" wordmark, tagline, and an indeterminate progress bar.
 * Matches claude-design-mockups `.splash`.
 */
export function Splash() {
  const slide = useSharedValue(-SEG_W);
  useEffect(() => {
    slide.value = withRepeat(
      withTiming(BAR_W, { duration: 1300, easing: Easing.out(Easing.ease) }),
      -1,
      false,
    );
  }, [slide]);
  const barStyle = useAnimatedStyle(() => ({ transform: [{ translateX: slide.value }] }));

  return (
    <View className="flex-1 items-center justify-center overflow-hidden bg-brand-700">
      {/* Radial highlight (approximation of the mockup's gradient) */}
      <View className="absolute -right-16 -top-10 h-72 w-72 rounded-full bg-brand-500/40" />

      {/* Mark + pulsing rings */}
      <View className="mb-[30px] h-24 w-24 items-center justify-center">
        <PulseRing delay={0} />
        <PulseRing delay={1200} />
        <View className="h-24 w-24 items-center justify-center rounded-[28px] border border-white/20 bg-white/[0.14]">
          <Dart size={52} />
          <View className="absolute right-[18px] top-[18px] h-[9px] w-[9px] rounded-full bg-accent-500" />
        </View>
      </View>

      {/* Wordmark */}
      <View className="flex-row items-baseline gap-3.5">
        <Text
          className="font-display text-[44px] font-semibold text-white"
          style={{ letterSpacing: -2.2 }}
        >
          Djera
        </Text>
        <Text className="font-ar text-[40px] font-bold text-white/60">جيرا</Text>
      </View>
      <Text className="mt-3.5 text-sm font-medium text-white/70">Drive when you want</Text>

      {/* Indeterminate progress bar (the moving line) */}
      <View
        className="absolute bottom-[76px] h-1 overflow-hidden rounded-full bg-white/20"
        style={{ width: BAR_W }}
      >
        <Animated.View style={[{ width: SEG_W }, barStyle]} className="h-full rounded-full bg-white" />
      </View>
    </View>
  );
}
