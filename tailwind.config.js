/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        coral: {
          500: '#F76B56',
          600: '#E85745',
        }
      }
    },
  },
  plugins: [],
};