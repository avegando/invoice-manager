/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        surface: {
          DEFAULT: '#13131a',
          2: '#1a1a24',
          3: '#1f1f2e',
        },
      },
    },
  },
  plugins: [],
}
