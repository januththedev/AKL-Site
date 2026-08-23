import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#050607',
          900: '#090B0E',
          850: '#0B0E12',
          800: '#0D1115',
          700: '#131920',
        },
        mist: {
          100: '#F2F5F7',
          300: '#D7DDE2',
          500: '#9AA3AB',
          700: '#646D75',
        },
        accent: {
          200: '#A4EFc8'.toUpperCase(),
          300: '#7CE8AE',
          400: '#4EDD92',
          500: '#34C978',
          600: '#1FA45B',
          700: '#157A47',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk Variable"', '"Space Grotesk"', 'sans-serif'],
        body: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': 'clamp(2.6rem, 8.5vw, 8.5rem)',
        'display-lg': 'clamp(2.75rem, 6vw, 6rem)',
        display: 'clamp(2.25rem, 4.5vw, 4.25rem)',
        heading: 'clamp(1.75rem, 3vw, 2.75rem)',
        title: 'clamp(1.35rem, 2vw, 1.75rem)',
      },
      letterSpacing: {
        widest2: '0.28em',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
        soft: 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'pulse-soft': 'pulse-soft 3.2s ease-in-out infinite',
      },
    },
  },
  future: {
    // :hover only matches on devices that can hover (prevents sticky tap-hover states)
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
} satisfies Config;
