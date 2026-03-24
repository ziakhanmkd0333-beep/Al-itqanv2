/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A7A4A',
          dark: '#0D4D2F',
          light: '#27A862',
          soft: '#D6EEE1',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#FDF6E3',
          dark: '#A0803D',
        },
      },
      fontFamily: {
        'arabic': ['Noto Naskh Arabic', 'Amiri', 'Traditional Arabic', 'serif'],
        'urdu': ['Jameel Noori Nastaleeq', 'serif'],
        'display': ['Cormorant Garamond', 'Cinzel', 'Calibri', 'serif'],
        'brand': ['Cinzel', 'Cormorant Garamond', 'Georgia', 'serif'],
        'body': ['Calibri', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

