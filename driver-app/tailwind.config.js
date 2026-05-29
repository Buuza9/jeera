/** @type {import('tailwindcss').Config} */
// Djera design tokens — mirrors ../driver-prototype/_shared/tokens.css (palm palette default).
// Values use oklch so they read the same as the HTML prototype; RN supports
// modern CSS colors via NativeWind v4.

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'oklch(0.96 0.018 150)',
          100: 'oklch(0.92 0.030 150)',
          200: 'oklch(0.84 0.055 150)',
          300: 'oklch(0.74 0.075 150)',
          400: 'oklch(0.60 0.090 150)',
          500: 'oklch(0.52 0.092 150)',
          600: 'oklch(0.46 0.095 150)',
          700: 'oklch(0.38 0.085 150)',
          800: 'oklch(0.30 0.070 150)',
          900: 'oklch(0.22 0.050 150)',
        },
        accent: {
          400: 'oklch(0.78 0.135 60)',
          500: 'oklch(0.72 0.135 60)',
          600: 'oklch(0.64 0.135 55)',
        },
        danger: 'oklch(0.55 0.18 28)',
        warn: 'oklch(0.72 0.16 75)',
        // Surfaces — light theme
        bg: 'oklch(0.975 0.008 80)',
        'bg-deep': 'oklch(0.93 0.014 75)',
        surface: 'oklch(1.00 0 0)',
        'surface-2': 'oklch(0.96 0.010 80)',
        'surface-3': 'oklch(0.92 0.014 75)',
        border: 'oklch(0.88 0.013 75)',
        'border-strong': 'oklch(0.78 0.018 70)',
        text: 'oklch(0.20 0.014 55)',
        'text-muted': 'oklch(0.46 0.014 60)',
        'text-faint': 'oklch(0.62 0.012 65)',
        'text-onbrand': 'oklch(0.98 0.010 80)',
        // Dark theme — accessed via dark: variants
        'dark-bg': 'oklch(0.16 0.012 60)',
        'dark-bg-deep': 'oklch(0.12 0.010 55)',
        'dark-surface': 'oklch(0.20 0.013 60)',
        'dark-surface-2': 'oklch(0.24 0.014 60)',
        'dark-surface-3': 'oklch(0.28 0.015 60)',
        'dark-border': 'oklch(0.28 0.015 60)',
        'dark-border-strong': 'oklch(0.38 0.020 60)',
        'dark-text': 'oklch(0.97 0.010 80)',
        'dark-text-muted': 'oklch(0.72 0.014 70)',
        'dark-text-faint': 'oklch(0.55 0.013 65)',
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
