module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Colores personalizados de Tecsup - Solo los necesarios
      colors: {
        tecsup: {
          primary: '#00B6F1',
          secondary: '#78D6F4',
          white: '#FFFFFF',
          success: '#28A745',
          danger: '#DC3545',
          warning: '#FFC107',
          gray: {
            50: '#F8F9FA',
            100: '#E9ECEF',
            200: '#DEE2E6',
            300: '#CED4DA',
            400: '#6C757D',
            500: '#495057',
            600: '#343A40',
            700: '#212529',
            800: '#1A1D20',
            900: '#0F1113',
          },
          blue: {
            50: '#E6F7FE',
            100: '#B3EAFC',
            200: '#80DDFB',
            300: '#4DD0F9',
            400: '#1AC3F7',
            500: '#00B6F1',
            600: '#009BCC',
            700: '#0080A7',
            800: '#006582',
            900: '#004A5D'
          },
          cyan: {
            50: '#E6F8FC',
            100: '#B3EBF7',
            200: '#80DEF2',
            300: '#4DD1ED',
            400: '#1AC4E8',
            500: '#78D6F4',
            600: '#5AC2E8',
            700: '#3CAEDC',
            800: '#1E9AD0',
            900: '#0086C4'
          }
        }
      },

      // Gradientes simplificados
      backgroundImage: {
        'tecsup-primary': 'linear-gradient(135deg, #00B6F1 0%, #0080A7 100%)',
        'tecsup-secondary': 'linear-gradient(135deg, #78D6F4 0%, #1AC4E8 100%)',
        'tecsup-success': 'linear-gradient(135deg, #28A745 0%, #1e7b32 100%)',
        'tecsup-danger': 'linear-gradient(135deg, #DC3545 0%, #b21e2f 100%)',
      },

      // Sombras optimizadas
      boxShadow: {
        'tecsup': '0 1px 3px 0 rgba(0, 182, 241, 0.1), 0 1px 2px 0 rgba(0, 182, 241, 0.06)',
        'tecsup-lg': '0 4px 6px -1px rgba(0, 182, 241, 0.1), 0 2px 4px -1px rgba(0, 182, 241, 0.06)',
        'tecsup-hover': '0 10px 15px -3px rgba(0, 182, 241, 0.1), 0 4px 6px -2px rgba(0, 182, 241, 0.05)',
      },

      // Espaciado personalizado mínimo
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      },

      // Breakpoints necesarios
      screens: {
        'xs': '475px',
        '3xl': '1600px'
      }
    },
  },
  plugins: []
}
