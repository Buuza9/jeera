// Djera design tokens — TS mirror of tailwind.config.js + ../../driver-prototype/_shared/tokens.css.
// Use these for values that NativeWind can't reach (StatusBar bg, native splash, animated lib).

// Hex values converted from the prototype's oklch palette — see tailwind.config.js.
export const tokens = {
  light: {
    bg: '#faf6f1',
    bgDeep: '#ede7de',
    surface: '#ffffff',
    surface2: '#f5f1ea',
    border: '#ddd6ce',
    text: '#1b1410',
    textMuted: '#5e5650',
    textFaint: '#8b857f',
    brand600: '#2a673a',
    accent500: '#e18e43',
    danger: '#c5372f',
  },
  dark: {
    bg: '#110c08',
    bgDeep: '#080503',
    surface: '#1b1510',
    surface2: '#241e19',
    border: '#2f2722',
    text: '#f9f4ee',
    textMuted: '#aaa39b',
    textFaint: '#77706a',
    brand600: '#2a673a',
    accent500: '#e18e43',
    danger: '#c5372f',
  },
} as const;

export type ThemeName = 'light' | 'dark';
