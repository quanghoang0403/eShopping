/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        main: ['Work Sans', 'sans-serif'],
      },
      colors: {
        primaryGold: '#FFD700',
        primaryGrey: '#A8A8A8',
        primaryDark: '#18181b',
        primaryLightDark: '#3F3F46',
        primaryMidDark: '#374151',
        backdrop: '#888b9380',
      },
    },
  },
  plugins: [],
}
