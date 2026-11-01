/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4B5563', // Gray-600 for primary
          light: '#9CA3AF', // Gray-400
          dark: '#374151', // Gray-700
        },
        secondary: {
          DEFAULT: '#059669', // Emerald-600
          light: '#10B981', // Emerald-500
          dark: '#047857', // Emerald-700
        },
        accent: {
          DEFAULT: '#F59E0B', // Amber-500
          light: '#FBBF24', // Amber-400
          dark: '#D97706', // Amber-600
        },
        bg: {
          DEFAULT: '#FFFFFF', // White
          light: '#F9FAFB', // Gray-50
          gray: '#F3F4F6', // Gray-100
          dark: '#E5E7EB', // Gray-200
        }
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
