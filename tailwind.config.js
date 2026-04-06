/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EEF8FF',
          100: '#D8EDFF',
          500: '#1373C9',
          600: '#0F5FA8',
          700: '#0B4A84',
        },
      },
    },
  },
  plugins: [],
};
