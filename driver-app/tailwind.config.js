/** @type {import('tailwindcss').Config} */
// Djera design tokens — mirrors ../driver-prototype/_shared/tokens.css (palm palette default).
// Values use oklch so they read the same as the HTML prototype; RN supports
// modern CSS colors via NativeWind v4.

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Hex values converted from the prototype's oklch palette (oklch() doesn't
      // render reliably in React Native's native style engine; hex is universal).
      // Source oklch is preserved in comments for traceability.
      colors: {
        brand: {
          50: '#eaf5ec', // oklch(0.96 0.018 150)
          100: '#d7ebda', // oklch(0.92 0.030 150)
          200: '#b2d5b8', // oklch(0.84 0.055 150)
          300: '#89b992', // oklch(0.74 0.075 150)
          400: '#578f63', // oklch(0.60 0.090 150)
          500: '#3e784c', // oklch(0.52 0.092 150)
          600: '#2a673a', // oklch(0.46 0.095 150)
          700: '#194f29', // oklch(0.38 0.085 150)
          800: '#0d371a', // oklch(0.30 0.070 150)
          900: '#06210d', // oklch(0.22 0.050 150)
        },
        accent: {
          400: '#f6a157', // oklch(0.78 0.135 60)
          500: '#e18e43', // oklch(0.72 0.135 60)
          600: '#c9732f', // oklch(0.64 0.135 55)
        },
        danger: '#c5372f', // oklch(0.55 0.18 28)
        warn: '#de9300', // oklch(0.72 0.16 75)
        // Surfaces — light theme
        bg: '#faf6f1', // oklch(0.975 0.008 80)
        'bg-deep': '#ede7de', // oklch(0.93 0.014 75)
        surface: '#ffffff', // oklch(1.00 0 0)
        'surface-2': '#f5f1ea', // oklch(0.96 0.010 80)
        'surface-3': '#eae3db', // oklch(0.92 0.014 75)
        border: '#ddd6ce', // oklch(0.88 0.013 75)
        'border-strong': '#bfb6ab', // oklch(0.78 0.018 70)
        text: '#1b1410', // oklch(0.20 0.014 55)
        'text-muted': '#5e5650', // oklch(0.46 0.014 60)
        'text-faint': '#8b857f', // oklch(0.62 0.012 65)
        'text-onbrand': '#fcf8f1', // oklch(0.98 0.010 80)
        // Dark theme — accessed via dark: variants
        'dark-bg': '#110c08', // oklch(0.16 0.012 60)
        'dark-bg-deep': '#080503', // oklch(0.12 0.010 55)
        'dark-surface': '#1b1510', // oklch(0.20 0.013 60)
        'dark-surface-2': '#241e19', // oklch(0.24 0.014 60)
        'dark-surface-3': '#2f2722', // oklch(0.28 0.015 60)
        'dark-border': '#2f2722', // oklch(0.28 0.015 60)
        'dark-border-strong': '#4b4038', // oklch(0.38 0.020 60)
        'dark-text': '#f9f4ee', // oklch(0.97 0.010 80)
        'dark-text-muted': '#aaa39b', // oklch(0.72 0.014 70)
        'dark-text-faint': '#77706a', // oklch(0.55 0.013 65)
      },
      borderRadius: {
        xs: '6px',
        sm: '10px',
        md: '14px',
        lg: '20px',
        xl: '28px',
        '2xl': '36px',
      },
      fontFamily: {
        display: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'Geist', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'monospace'],
        ar: ['IBM Plex Sans Arabic', 'Tajawal', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
