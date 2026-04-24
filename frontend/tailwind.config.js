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
        secondary: '#f3c77c',
        tertiary: '#f37c7c',
        textMain: '#dde2f3',
        textMuted: '#c7c4d7',
        accentViolet: '#6f00be',
        glass: 'rgba(255, 255, 255, 0.03)',
        glassBorder: 'rgba(255, 255, 255, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
