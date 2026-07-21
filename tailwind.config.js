/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#06061a',
        panel: 'rgba(15, 15, 45, 0.88)',
        panelBorder: 'rgba(100, 140, 255, 0.25)',
        cyan: '#00e5ff',
        magenta: '#e040fb',
        green: '#00e676',
        yellow: '#ffd600',
        orange: '#ff9100',
        red: '#ff1744',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        fredoka: ['Fredoka', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
