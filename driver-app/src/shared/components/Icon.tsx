import { type ReactNode } from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

// Djera icon set — monoline, 24×24 viewBox, currentColor stroke.
// Ported 1:1 from ../claude-design-mockups/app/icons.jsx so the RN app matches
// the prototype exactly. Keep stroke-width 1.8 base. Add new icons here only.

type Shape = (sw: number, color: string, filled: boolean) => ReactNode;

type IconDef = { size: number; sw: number; shape: Shape };

const S = {
  cap: 'round' as const,
  join: 'round' as const,
};

const ICONS = {
  arrowLeft: { size: 22, sw: 1.8, shape: (sw, c) => <Path d="M15 6l-6 6 6 6" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" /> },
  arrowRight: { size: 22, sw: 1.8, shape: (sw, c) => <Path d="M9 6l6 6-6 6" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" /> },
  chevDown: { size: 18, sw: 1.8, shape: (sw, c) => <Path d="M6 9l6 6 6-6" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" /> },
  close: { size: 20, sw: 1.8, shape: (sw, c) => <Path d="M6 6l12 12M18 6L6 18" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" /> },
  menu: { size: 22, sw: 1.8, shape: (sw, c) => <Path d="M4 7h16M4 12h16M4 17h10" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} fill="none" /> },
  search: {
    size: 18, sw: 1.8, shape: (sw, c) => (
      <>
        <Circle cx={11} cy={11} r={7} stroke={c} strokeWidth={sw} fill="none" />
        <Path d="M21 21l-4.3-4.3" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" />
      </>
    ),
  },
  bell: {
    size: 22, sw: 1.8, shape: (sw, c) => (
      <>
        <Path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" />
        <Path d="M13.7 21a2 2 0 0 1-3.4 0" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" />
      </>
    ),
  },
  home: { size: 22, sw: 1.8, shape: (sw, c) => <Path d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2v-9z" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" /> },
  history: {
    size: 22, sw: 1.8, shape: (sw, c) => (
      <>
        <Path d="M3 12a9 9 0 1 0 3-6.7L3 8" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" />
        <Path d="M3 3v5h5" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" />
        <Path d="M12 8v4l3 2" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" />
      </>
    ),
  },
  wallet: {
    size: 22, sw: 1.8, shape: (sw, c) => (
      <>
        <Path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" />
        <Path d="M16 12h3" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" />
        <Path d="M3 9h18" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" />
      </>
    ),
  },
  user: {
    size: 22, sw: 1.8, shape: (sw, c) => (
      <>
        <Circle cx={12} cy={8} r={4} stroke={c} strokeWidth={sw} fill="none" />
        <Path d="M4 21a8 8 0 0 1 16 0" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" />
      </>
    ),
  },
  pin: {
    size: 18, sw: 1.8, shape: (sw, c) => (
      <>
        <Path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13z" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" />
        <Circle cx={12} cy={9} r={2.5} stroke={c} strokeWidth={sw} fill="none" />
      </>
    ),
  },
  phone: { size: 18, sw: 1.8, shape: (sw, c) => <Path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2.2z" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" /> },
  envelope: {
    size: 18, sw: 1.8, shape: (sw, c) => (
      <>
        <Rect x={3} y={5} width={18} height={14} rx={2} stroke={c} strokeWidth={sw} fill="none" />
        <Path d="M3 7l9 6 9-6" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" />
      </>
    ),
  },
  device: {
    size: 18, sw: 1.8, shape: (sw, c) => (
      <>
        <Rect x={6} y={2} width={12} height={20} rx={3} stroke={c} strokeWidth={sw} fill="none" />
        <Path d="M11 18h2" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" />
      </>
    ),
  },
  check: { size: 18, sw: 2, shape: (sw, c) => <Path d="M5 12l5 5L20 7" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" /> },
  shield: {
    size: 22, sw: 1.8, shape: (sw, c) => (
      <>
        <Path d="M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10z" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" />
        <Path d="M9 12l2 2 4-4" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" />
      </>
    ),
  },
  car: {
    size: 22, sw: 1.8, shape: (sw, c) => (
      <>
        <Path d="M3 13l2-5a2 2 0 0 1 2-1.5h10A2 2 0 0 1 19 8l2 5" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" />
        <Path d="M3 13h18v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5z" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" />
        <Circle cx={7} cy={16} r={1.2} stroke={c} strokeWidth={sw} fill="none" />
        <Circle cx={17} cy={16} r={1.2} stroke={c} strokeWidth={sw} fill="none" />
      </>
    ),
  },
  clock: {
    size: 22, sw: 1.8, shape: (sw, c) => (
      <>
        <Circle cx={12} cy={12} r={9} stroke={c} strokeWidth={sw} fill="none" />
        <Path d="M12 7v5l3 2" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" />
      </>
    ),
  },
  cash: {
    size: 22, sw: 1.8, shape: (sw, c) => (
      <>
        <Rect x={2.5} y={6} width={19} height={12} rx={2} stroke={c} strokeWidth={sw} fill="none" />
        <Circle cx={12} cy={12} r={2.5} stroke={c} strokeWidth={sw} fill="none" />
        <Path d="M6 9.5h.01M18 14.5h.01" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" />
      </>
    ),
  },
  chart: { size: 22, sw: 1.8, shape: (sw, c) => <Path d="M3 21h18M6 17v-5M11 17V8M16 17v-7M21 17V5" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" /> },
  upload: {
    size: 22, sw: 1.8, shape: (sw, c) => (
      <>
        <Path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" />
        <Path d="M12 4v12M7 9l5-5 5 5" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" />
      </>
    ),
  },
  star: { size: 16, sw: 1.6, shape: (sw, c, filled) => <Path d="M12 3l2.7 5.7 6.3.6-4.8 4.3 1.5 6.2L12 16.9l-5.7 2.9 1.5-6.2L3 9.3l6.3-.6L12 3z" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill={filled ? c : 'none'} /> },
  sun: {
    size: 16, sw: 1.8, shape: (sw, c) => (
      <>
        <Circle cx={12} cy={12} r={4} stroke={c} strokeWidth={sw} fill="none" />
        <Path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} fill="none" />
      </>
    ),
  },
  moon: { size: 16, sw: 1.8, shape: (sw, c) => <Path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" /> },
  plus: { size: 18, sw: 1.8, shape: (sw, c) => <Path d="M12 5v14M5 12h14" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} fill="none" /> },
  layers: { size: 20, sw: 1.8, shape: (sw, c) => <Path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 18l9 5 9-5" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" /> },
  navigation: { size: 18, sw: 1.8, shape: (_sw, c) => <Path d="M3 11l18-8-8 18-2-8-8-2z" fill={c} /> },
  warn: {
    size: 22, sw: 1.8, shape: (sw, c) => (
      <>
        <Path d="M12 3l10 18H2L12 3z" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" />
        <Path d="M12 10v5M12 18h.01" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" />
      </>
    ),
  },
  bank: { size: 22, sw: 1.8, shape: (sw, c) => <Path d="M3 9l9-5 9 5M5 9v8M19 9v8M9 9v8M15 9v8M3 20h18" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" /> },
  bankTransfer: {
    size: 22, sw: 2, shape: (sw, c) => (
      <>
        <Path d="M3 10l9-6 9 6" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" />
        <Path d="M5 10v9h14v-9" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" />
        <Path d="M9 19v-5h6v5" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" />
      </>
    ),
  },
  building: {
    size: 22, sw: 2, shape: (sw, c) => (
      <>
        <Rect x={4} y={3} width={16} height={18} rx={2} stroke={c} strokeWidth={sw} fill="none" />
        <Path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01M10 21v-4h4v4" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" />
      </>
    ),
  },
  alertCircle: {
    size: 22, sw: 2.2, shape: (sw, c) => (
      <>
        <Circle cx={12} cy={12} r={9} stroke={c} strokeWidth={sw} fill="none" />
        <Path d="M12 8v5" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" />
        <Path d="M12 16h.01" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" />
      </>
    ),
  },
  fingerprint: {
    size: 22, sw: 1.6, shape: (sw, c) => (
      <>
        <Path d="M12 11v4a4 4 0 0 1-4 4" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" />
        <Path d="M12 7a4 4 0 0 1 4 4v3a8 8 0 0 1-1 4" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" />
        <Path d="M8 11a4 4 0 0 1 8 0v1" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" />
        <Path d="M4 11a8 8 0 0 1 16 0" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" />
      </>
    ),
  },
  settings: {
    size: 22, sw: 1.8, shape: (sw, c) => (
      <>
        <Circle cx={12} cy={12} r={3} stroke={c} strokeWidth={sw} fill="none" />
        <Path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.5 1z" stroke={c} strokeWidth={sw} strokeLinecap={S.cap} strokeLinejoin={S.join} fill="none" />
      </>
    ),
  },
} satisfies Record<string, IconDef>;

export type IconName = keyof typeof ICONS;

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  /** Override the icon's default stroke width. */
  strokeWidth?: number;
  /** Filled variant (only `star` honours this). */
  filled?: boolean;
};

export function Icon({ name, size, color = '#1b1410', strokeWidth, filled = false }: IconProps) {
  const def = ICONS[name];
  const px = size ?? def.size;
  const sw = strokeWidth ?? def.sw;
  return (
    <Svg width={px} height={px} viewBox="0 0 24 24" fill="none">
      {def.shape(sw, color, filled)}
    </Svg>
  );
}
