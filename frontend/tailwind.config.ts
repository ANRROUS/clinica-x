import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta basada en los wireframes (teal/indigo). Ajustar al diseño final.
        brand: {
          50: '#e6f7f1',
          100: '#c2ebdb',
          200: '#9bdfc4',
          300: '#73d3ad',
          400: '#4ec898',
          500: '#1d9e75', // primary
          600: '#168363',
          700: '#0f6e56', // primary dark
          800: '#0a5544',
          900: '#054032',
        },
        accent: {
          // Para badge DNI / acentos morado-índigo
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
