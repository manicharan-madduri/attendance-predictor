/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#7c3aed',
        secondary: '#8b5cf6',
      },
      backgroundOpacity: ['hover', 'focus'],
      backgroundColor: {
        'dark-base': '#0a0a0f',
        'dark-card': '#111118',
        'dark-surface': '#0d0d14',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
