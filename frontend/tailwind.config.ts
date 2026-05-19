import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#e6f7f1',
          100: '#c2ebdb',
          200: '#9bdfc4',
          300: '#73d3ad',
          400: '#4ec898',
          500: '#008585', // turquesa principal
          600: '#007070',
          700: '#006666',
          800: '#005a5a',
          900: '#004d4d',
        },
        blue: {
          dark: '#003F86',
        },
        accent: {
          500: '#5b21b6',
          600: '#4c1d95',
          700: '#3b0f73',
        },
        danger: {
          50: '#fee2e2',
          500: '#dc2626',
          600: '#b91c1c',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
