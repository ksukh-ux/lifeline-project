/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#050816',
          900: '#080D1F',
          800: '#10172A',
          700: '#18233A',
          600: '#273553',
        },
        brass: {
          400: '#60A5FA',
          500: '#2563EB',
          600: '#1D4ED8',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}

