export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: '#6759FF',
        secondary: '#F7F8FC',
        accent: '#FFB74D',
        dark: '#2E2E3A',
        grayText: '#A0A3BD',
      },
    },
  },
  plugins: [],
}
