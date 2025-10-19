/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './context/**/*.{js,jsx,ts,tsx}',
    './constants/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#06b6d4',
          foreground: '#0f172a',
        },
        primary: {
          50: '#fef7ff',
          100: '#fdeeff',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
        },
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        }
      }
    },
  },
  plugins: [],
};

