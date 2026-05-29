import Svg, { Circle, G, Path, Rect } from 'react-native-svg';

// Djera mark — brand square + dart (folded-kite) + saffron origin dot.
// Ported 1:1 from ../driver-prototype/welcome (oklch fills swapped to hex).
const BRAND = '#2a673a'; // brand-600
const ONBRAND = '#fcf8f1'; // text-onbrand
const ACCENT = '#e18e43'; // accent-500

export function Brand({ size = 96 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80">
      <Rect x={0} y={0} width={80} height={80} rx={22} fill={BRAND} />
      <Rect
        x={1.5}
        y={1.5}
        width={77}
        height={77}
        rx={20.5}
        fill="none"
        stroke="rgba(255,255,255,0.10)"
        strokeWidth={1}
      />
      <G transform="rotate(-12 40 40)">
        <Path d="M40 18 L58 60 L40 51 Z" fill={ONBRAND} opacity={0.98} />
        <Path d="M40 18 L22 60 L40 51 Z" fill={ONBRAND} opacity={0.55} />
        <Path d="M40 18 L40 51" stroke={BRAND} strokeWidth={0.7} opacity={0.45} />
      </G>
      <Circle cx={64} cy={16} r={5} fill={ACCENT} />
      <Circle cx={64} cy={16} r={5} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
    </Svg>
  );
}
