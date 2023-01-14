/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'roboto-slab': 'var(--roboto-slab)',
      },
    },
  },
  plugins: [],
};
