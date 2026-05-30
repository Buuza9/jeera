import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useColorScheme } from 'nativewind';

import { Screen } from '@/shared/components';

const BRAND = '#2a673a'; // brand-600
const REDIRECT_MS = 1700;

/**
 * Post-sign-in loading page (ported from the prototype `ScreenLoading`).
 * Spinning route-arc + pulsing dart while the dashboard is prepared, then
 * auto-advances. Replaces the old "you're signed in" success screen.
 */
export function LoadingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const track = colorScheme === 'dark' ? '#2f2722' : '#eae3db'; // surface-3

  const spin = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    spin.value = withRepeat(withTiming(360, { duration: 1050, easing: Easing.linear }), -1);
    pulse.value = withRepeat(
      withTiming(1.12, { duration: 700, easing: Easing.out(Easing.quad) }),
      -1,
      true,
    );
  }, [spin, pulse]);

  useEffect(() => {
    const id = setTimeout(() => router.replace('/dashboard'), REDIRECT_MS);
    return () => clearTimeout(id);
  }, [router]);

  const spinStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${spin.value}deg` }] }));
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  return (
    <Screen contentClassName="items-center justify-center">
      {/* Orbit: static track + spinning arc + pulsing dart — all exactly
          concentric (explicit 64×64 inline sizing; className positioning on
          reanimated views is unreliable and drifted the arc off-center). */}
      <View style={{ width: 64, height: 64, marginBottom: 22, alignItems: 'center', justifyContent: 'center' }}>
        {/* track */}
        <Svg style={StyleSheet.absoluteFill} width={64} height={64} viewBox="0 0 64 64">
          <Circle cx={32} cy={32} r={27} fill="none" stroke={track} strokeWidth={4} />
        </Svg>
        {/* spinning arc — fills the box, rotates around its center */}
        <Animated.View style={[StyleSheet.absoluteFill, spinStyle]}>
          <Svg width={64} height={64} viewBox="0 0 64 64">
            <Circle
              cx={32}
              cy={32}
              r={27}
              fill="none"
              stroke={BRAND}
              strokeWidth={4}
              strokeLinecap="round"
              strokeDasharray="46 124"
            />
          </Svg>
        </Animated.View>
        {/* centered dart */}
        <Animated.View style={pulseStyle}>
          <Svg width={22} height={22} viewBox="0 0 32 32">
            <G origin="16, 16" rotation={-12}>
              <Path d="M16 4 L26 27 L16 22.5 Z" fill={BRAND} opacity={0.98} />
              <Path d="M16 4 L6 27 L16 22.5 Z" fill={BRAND} opacity={0.5} />
            </G>
          </Svg>
        </Animated.View>
      </View>

      <Animated.Text
        entering={FadeIn.duration(300)}
        className="text-center text-[15.5px] font-semibold text-text dark:text-dark-text"
        style={{ letterSpacing: -0.22 }}
      >
        {t('loading.label')}
      </Animated.Text>
      <Text className="mt-1.5 text-center text-[13px] text-text-muted dark:text-dark-text-muted">
        {t('loading.sub')}
      </Text>

      {/* Shimmer dots */}
      <View className="mt-4 flex-row gap-1.5">
        <Dot delay={0} />
        <Dot delay={150} />
        <Dot delay={300} />
      </View>
    </Screen>
  );
}

function Dot({ delay }: { delay: number }) {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: 600, easing: Easing.out(Easing.quad) }), -1, true),
    );
  }, [v, delay]);
  const style = useAnimatedStyle(() => ({
    opacity: 0.25 + v.value * 0.75,
    transform: [{ translateY: -4 * v.value }],
  }));
  return <Animated.View style={style} className="h-1.5 w-1.5 rounded-full bg-brand-600" />;
}
