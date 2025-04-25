import scrollbarHide from 'tailwind-scrollbar-hide'

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
        primary: '#6759FF',        // Azul principal
        secondary: '#F7F8FC',      // Fondo claro
        accent: '#FFB74D',         // Naranja claro
        dark: '#2E2E3A',           // Texto fuerte/darkmode
        grayText: '#A0A3BD',       // Texto gris suave
        glass: 'rgba(255, 255, 255, 0.25)', // Fondo glass
      },
      transitionTimingFunction: {
        'in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)'
      }
    },
  },
  plugins: [scrollbarHide]
}
