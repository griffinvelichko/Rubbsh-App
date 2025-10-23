/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10b981',
        'primary-dark': '#059669',
        error: '#ef4444',
        warning: '#f59e0b',
        text: '#1f2937',
        'text-light': '#6b7280',
        bg: '#ffffff',
        'bg-secondary': '#f9fafb',
        'bin-foodscraps': '#10b981',
        'bin-recyclablecontainers': '#3b82f6',
        'bin-paper': '#f59e0b',
        'bin-garbage': '#6b7280',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'sans-serif'],
      },
      spacing: {
        'xs': '0.5rem',
        'sm': '1rem',
        'md': '1.5rem',
        'lg': '2rem',
        'xl': '3rem',
      },
      animation: {
        spin: 'spin 0.8s linear infinite',
      }
    },
  },
  plugins: [],
}