/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f8fb',
          100: '#e6eef8',
          200: '#cfe0f2',
          300: '#a9c9e8',
          400: '#749fcf',
          500: '#3b7ac0',
          600: '#335f9a',
          700: '#27486f',
          800: '#1f3652',
          900: '#15263a'
        }
      }
    }
  },
  plugins: [],
};
