import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, G, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

const SPRING = { damping: 11, stiffness: 140 };

/** White dart glyph (the brand mark's dart) for the frosted tile. */
function Dart({ size = 48 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <G transform="rotate(-12 16 16)">
        <Path d="M16 4 L26 27 L16 22.5 Z" fill="#ffffff" opacity={0.98} />
        <Path d="M16 4 L6 27 L16 22.5 Z" fill="#ffffff" opacity={0.55} />
      </G>
    </Svg>
  );
}

/** Pulsing ring that scales out and fades (matches `.splash-ring`). */
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
 * Branded boot splash — brand-gradient with a faint street grid, frosted brand
 * tile (pop-in) with pulsing rings + saffron dot, "Djera جيرا" wordmark, tagline,
 * and an indeterminate progress bar. Matches ../rider-prototype splash.
 */
export function Splash() {
  // Indeterminate progress: a 45%-wide bar sliding across a 132px track.
  const TRACK = 132;
  const BAR = TRACK * 0.45;
  const slide = useSharedValue(-BAR);
  // Tile pop-in (scale .7 → 1) + dot pop (scale 0 → 1).
  const tile = useSharedValue(0.7);
  const dot = useSharedValue(0);

  useEffect(() => {
    slide.value = withRepeat(
      withTiming(TRACK, { duration: 1300, easing: Easing.out(Easing.ease) }),
      -1,
      false,
    );
    tile.value = withSpring(1, SPRING);
    dot.value = withDelay(500, withSpring(1, SPRING));
  }, [slide, tile, dot, TRACK]);

  const barStyle = useAnimatedStyle(() => ({ transform: [{ translateX: slide.value }] }));
  const tileStyle = useAnimatedStyle(() => ({ transform: [{ scale: tile.value }] }));
  const dotStyle = useAnimatedStyle(() => ({ transform: [{ scale: dot.value }] }));

  return (
    <View className="flex-1 items-center justify-center overflow-hidden">
      {/* Brand gradient + faint street grid (the "squares") */}
      <Svg style={StyleSheet.absoluteFill} viewBox="0 0 440 956" preserveAspectRatio="xMidYMid slice">
        <Defs>
          <LinearGradient id="bg" x1="0" y1="0" x2="0.26" y2="1">
            <Stop offset="0" stopColor="#2a673a" />
            <Stop offset="0.56" stopColor="#194f29" />
            <Stop offset="1" stopColor="#06210d" />
          </LinearGradient>
          <RadialGradient id="hl" cx="75%" cy="12%" r="70%">
            <Stop offset="0" stopColor="#5a9168" stopOpacity={0.55} />
            <Stop offset="0.55" stopColor="#5a9168" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={440} height={956} fill="url(#bg)" />
        <Rect x={0} y={0} width={440} height={956} fill="url(#hl)" />
        <G stroke="rgba(255,255,255,0.06)" strokeWidth={1.5}>
          <Path d="M-20 200 H460 M-20 360 H460 M-20 520 H460 M-20 680 H460 M-20 840 H460" />
          <Path d="M70 -20 V976 M170 -20 V976 M270 -20 V976 M370 -20 V976" />
        </G>
      </Svg>

      {/* Mark + pulsing rings */}
      <View className="mb-[30px] h-24 w-24 items-center justify-center">
        <PulseRing delay={0} />
        <PulseRing delay={1200} />
        <Animated.View
          style={[tileStyle, { shadowColor: '#000', shadowOpacity: 0.28, shadowRadius: 20, shadowOffset: { width: 0, height: 16 } }]}
          className="h-24 w-24 items-center justify-center rounded-[28px] border border-white/20 bg-white/[0.14]"
        >
          <Dart size={48} />
          <Animated.View
            style={dotStyle}
            className="absolute right-[18px] top-[18px] h-[9px] w-[9px] rounded-full border-2 border-white/20 bg-accent-500"
          />
        </Animated.View>
      </View>

      {/* Wordmark + tagline (rise in) */}
      <Animated.View entering={FadeInDown.delay(350).duration(550)} className="flex-row items-baseline gap-3.5">
        <Text className="font-display text-[44px] font-semibold text-white" style={{ letterSpacing: -2.2 }}>
          Djera
        </Text>
        <Text className="font-ar text-[40px] font-bold text-white/55">جيرا</Text>
      </Animated.View>
      <Animated.Text
        entering={FadeInDown.delay(500).duration(550)}
        className="mt-3.5 text-sm font-medium text-white/70"
      >
        Drive when you want
      </Animated.Text>

      {/* Indeterminate progress bar */}
      <View className="absolute bottom-[76px] h-1 overflow-hidden rounded-full bg-white/20" style={{ width: TRACK }}>
        <Animated.View style={[{ width: BAR }, barStyle]} className="h-full rounded-full bg-white" />
      </View>
    </View>
  );
}
