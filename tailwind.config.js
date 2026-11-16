/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        black: 'rgb(var(--color-black) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        white: 'rgb(var(--color-white) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Alexandria', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
