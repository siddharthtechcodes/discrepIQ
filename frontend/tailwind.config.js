/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f9d0d8',
          300: '#f3a8b7',
          400: '#e8728d',
          500: '#d74468',
          600: '#b82348',
          700: '#9b1b3b',
          800: '#800020', // Classic Royal Maroon
          900: '#670d24', // Deep Wine Maroon
          950: '#3d0312', // Midnight Black-Maroon
        },
        brand: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f9d0d8',
          300: '#f3a8b7',
          400: '#e8728d',
          500: '#d74468',
          600: '#b82348',
          700: '#9b1b3b',
          800: '#800020',
          900: '#670d24',
          950: '#3d0312',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

