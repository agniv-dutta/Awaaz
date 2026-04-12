import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        charcoal: { DEFAULT: '#1A1A1A', light: '#2A2A2A', border: '#2E2E2E' },
        silver: { DEFAULT: '#D9D9D9', muted: '#888888' },
        orange: { DEFAULT: '#FF9E00', dark: '#E05A00', ghost: '#FF9E0015' },
        violet: { DEFAULT: '#C77DFF', ghost: '#C77DFF15', border: '#C77DFF40' },
      }
    },
  },
  plugins: [],
} satisfies Config
