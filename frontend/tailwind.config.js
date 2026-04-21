/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0e131f',
        surface: '#161c28',
        surfaceHigh: '#242a36',
        primary: '#bdc2ff',
        primaryContainer: '#7c87f3',
        textMain: '#dde2f3',
        textMuted: '#c7c4d7',
        accentViolet: '#6f00be'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
