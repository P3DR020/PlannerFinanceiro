/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0040a1',
        'primary-container': '#0056d2',
        secondary: '#515f74',
        tertiary: '#005136',
        'tertiary-fixed-dim': '#4edea3',
        error: '#ba1a1a',
        background: '#faf8ff',
        surface: '#faf8ff',
        'surface-container-low': '#f1f3ff',
        'surface-container': '#ebedfb',
        'surface-container-high': '#e5e7f5',
        'surface-container-highest': '#dfe1ef',
        'on-surface': '#151b29',
        'on-surface-variant': '#434a5c',
        'outline-variant': '#c3c6d6',
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.75rem',
        md: '0.375rem',
      },
      boxShadow: {
        ambient: '0 8px 32px -4px rgba(21,27,41,0.06)',
        'ambient-lg': '0 16px 48px -4px rgba(21,27,41,0.08)',
      },
    },
  },
  plugins: [],
};