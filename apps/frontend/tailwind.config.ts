import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        blob: {
          '0%, 100%': { borderRadius: '42% 58% 65% 35% / 45% 45% 55% 55%', transform: 'scale(1) rotate(0deg)' },
          '25%': { borderRadius: '58% 42% 35% 65% / 55% 65% 35% 45%', transform: 'scale(1.05) rotate(4deg)' },
          '50%': { borderRadius: '65% 35% 42% 58% / 35% 55% 45% 65%', transform: 'scale(0.98) rotate(-3deg)' },
          '75%': { borderRadius: '35% 65% 58% 42% / 65% 35% 65% 35%', transform: 'scale(1.03) rotate(2deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-20px) translateX(10px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.08)' },
        },
      },
      animation: {
        blob: 'blob 12s ease-in-out infinite',
        float: 'float 8s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'gradient-x': 'gradient-x 8s ease infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        marquee: 'marquee 28s linear infinite',
        'spin-slow': 'spin-slow 18s linear infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out both',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
      },
      backgroundSize: {
        '200%': '200% 200%',
      },
    },
  },
  plugins: [],
};

export default config;
