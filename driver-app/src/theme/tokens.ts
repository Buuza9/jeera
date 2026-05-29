// Djera design tokens — TS mirror of tailwind.config.js + ../../driver-prototype/_shared/tokens.css.
// Use these for values that NativeWind can't reach (StatusBar bg, native splash, animated lib).

export const tokens = {
  light: {
    bg: 'oklch(0.975 0.008 80)',
    bgDeep: 'oklch(0.93 0.014 75)',
    surface: 'oklch(1.00 0 0)',
    surface2: 'oklch(0.96 0.010 80)',
    border: 'oklch(0.88 0.013 75)',
    text: 'oklch(0.20 0.014 55)',
    textMuted: 'oklch(0.46 0.014 60)',
    textFaint: 'oklch(0.62 0.012 65)',
    brand600: 'oklch(0.46 0.095 150)',
    accent500: 'oklch(0.72 0.135 60)',
    danger: 'oklch(0.55 0.18 28)',
  },
  dark: {
    bg: 'oklch(0.16 0.012 60)',
    bgDeep: 'oklch(0.12 0.010 55)',
    surface: 'oklch(0.20 0.013 60)',
    surface2: 'oklch(0.24 0.014 60)',
    border: 'oklch(0.28 0.015 60)',
    text: 'oklch(0.97 0.010 80)',
    textMuted: 'oklch(0.72 0.014 70)',
    textFaint: 'oklch(0.55 0.013 65)',
    brand600: 'oklch(0.46 0.095 150)',
    accent500: 'oklch(0.72 0.135 60)',
    danger: 'oklch(0.55 0.18 28)',
  },
} as const;

export type ThemeName = 'light' | 'dark';
