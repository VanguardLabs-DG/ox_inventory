/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark': '#080A0E',
        'light': '#525252',
        'gold': {
          DEFAULT: '#E5A93C',
          bright: '#FFC857',
          light: '#FFE082',
          dark: '#8C5D14',
          glow: 'rgba(229, 169, 60, 0.4)',
        },
        'cyber': {
          bg: '#080A0E',
          panel: 'rgba(10, 13, 18, 0.78)',
          slot: 'rgba(14, 17, 24, 0.72)',
          slotHover: 'rgba(22, 27, 38, 0.88)',
          border: 'rgba(229, 169, 60, 0.28)',
          borderHover: '#FFC857',
        }
      },
      fontFamily: {
        cyber: ['Rajdhani', 'sans-serif'],
        hud: ['Chakra Petch', 'sans-serif'],
        mono: ['Share Tech Mono', 'monospace'],
      },
      maxWidth: {
        '8xl': '88rem'
      },
      opacity: {
        '15': '.15'
      },
      screens: {
        'k': '1900px',
        '2k': '2500px',
        '4k': '3800px'
      },
    },
  },
  plugins: [],
}