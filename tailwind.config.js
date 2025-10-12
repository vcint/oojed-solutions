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
          100: '#eef6ff',
          200: '#d6e9ff',
          300: '#bcdfff',
          400: '#8fbff8',
          500: '#1f6feb',
          600: '#1559c9',
          700: '#0f46a0',
          800: '#0b3576',
          900: '#07264d'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial']
      }
    },
  },
  plugins: [],
};
