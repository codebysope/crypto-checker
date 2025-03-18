/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eefbff',
          100: '#d6f4ff',
          200: '#b5eaff',
          300: '#83dcff',
          400: '#48c2ff',
          500: '#1ea1ff',
          600: '#0179ff',
          700: '#015cff',
          800: '#0849cc',
          900: '#0c419f',
        },
        dark: {
          bg: '#0B1120',
          card: '#111827',
          border: '#1F2937',
          hover: '#1E293B',
        },
        accent: {
          green: '#00DC82',
          red: '#FF5C5C',
          yellow: '#FFB547',
          purple: '#8B5CF6',
          blue: '#3B82F6',
        },
        chart: {
          grid: '#1F2937',
          text: '#9CA3AF',
          line: '#3B82F6',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 0 rgba(59, 130, 246, 0)' },
          '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
        'dark-grid': 'linear-gradient(to right, #1F2937 1px, transparent 1px), linear-gradient(to bottom, #1F2937 1px, transparent 1px)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-lg': '0 0 30px rgba(59, 130, 246, 0.4)',
      },
    },
  },
  plugins: [],
} 