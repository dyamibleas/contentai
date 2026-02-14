/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f3f0ff',
          100: '#e8e0ff',
          200: '#d4c4ff',
          300: '#b599ff',
          400: '#9061ff',
          500: '#6C3CE1',
          600: '#5a28c8',
          700: '#4c1dab',
          800: '#3f188c',
          900: '#331571',
        },
        accent: '#FF6B35',
        dark: {
          DEFAULT: '#0F0F1A',
          100: '#1A1A2E',
          200: '#252540',
          300: '#2F2F4A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
