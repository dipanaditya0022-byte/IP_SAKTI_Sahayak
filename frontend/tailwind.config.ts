import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Self-hosted (via @fontsource, no Google Fonts CDN calls): Inter for UI body text,
        // Sora for display headings, Noto Sans for multilingual (Hindi) text.
        sans: ['Inter', 'Noto Sans', 'system-ui', 'sans-serif'],
        heading: ['Sora', 'Noto Sans', 'Inter', 'sans-serif'],
        serif: ['Noto Sans', 'Inter', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'soft-elevated': '0 4px 20px -2px rgba(11, 18, 48, 0.08)',
      },
      animation: {
        shimmer: 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      colors: {
        darkbg: '#F7F8FC',
        surface: '#FFFFFF',
        'surface-elevated': '#FFFFFF',
        'surface-border': '#D9DEEE',
        'surface-muted': '#EEF1FA',
        'text-main': '#0B1230',
        'text-secondary': '#3A4366',
        'text-muted': '#5B6488',
        accent: '#FF9933',
        'deep-green': '#0A1A4F',
        green: '#13286B',
        'soft-green': '#E6F4E4',
        'brand-green': '#138808',
        terracotta: '#E8821A',
        gold: '#FF9933',
        ok: '#138808',
        'ok-bg': '#E6F4E4',
        warn: '#B45309',
        'warn-bg': '#FEF3C7',
        danger: '#B42318',
        'danger-bg': '#FEE4E2',
        info: '#06038D',
        'info-bg': '#E4ECF5',
      },
    },
  },
  plugins: [],
};
export default config;
