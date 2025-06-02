module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {      // Colores personalizados de Tecsup - Paleta oficial
      colors: {
        tecsup: {
          // Azul principal TECSUP
          primary: '#005BA1',
          // Celeste tecnológico  
          secondary: '#00B0F0',
          // Verde moderno para confirmaciones
          success: '#28A745',
          // Rojo claro para errores
          danger: '#DC3545',
          // Grises neutros
          gray: {
            light: '#F0F2F5',
            medium: '#6C757D', 
            dark: '#343A40'
          },
          // Variaciones del azul principal
          blue: {
            50: '#e6f3ff',
            100: '#b3d9ff',
            200: '#80bfff',
            300: '#4da6ff',
            400: '#1a8cff',
            500: '#005BA1', // Azul principal
            600: '#004d87',
            700: '#003f6d',
            800: '#003154',
            900: '#00233a'
          },
          // Variaciones del celeste
          cyan: {
            50: '#e6f9ff',
            100: '#b3ecff',
            200: '#80dfff',
            300: '#4dd2ff',
            400: '#1ac5ff',
            500: '#00B0F0', // Celeste tecnológico
            600: '#0094cc',
            700: '#0078a8',
            800: '#005c84',
            900: '#004060'
          }
        }
      },      // Animaciones personalizadas más suaves
      keyframes: {
        'fade-in': {
          'from': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'slide-in': {
          'from': {
            opacity: '0',
            transform: 'translateX(-10px)'
          },
          'to': {
            opacity: '1',
            transform: 'translateX(0)'
          }
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%) skewX(-12deg)' },
          '100%': { transform: 'translateX(200%) skewX(-12deg)' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' }
        },
        'pulse-soft': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' }
        },
        'hover-scale': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.02)' }
        },
        'hover-glow': {
          '0%': { boxShadow: '0 0 0 rgba(0, 91, 161, 0)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 91, 161, 0.2)' }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.8s ease-out forwards',
        'slide-in': 'slide-in 0.7s ease-out forwards',
        'shimmer': 'shimmer 3s infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
        'hover-scale': 'hover-scale 0.3s ease-out forwards',
        'hover-glow': 'hover-glow 0.3s ease-out forwards'
      },
      // Transiciones personalizadas más suaves
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms'
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'gentle': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'soft': 'cubic-bezier(0.16, 1, 0.3, 1)'
      },      // Sombras personalizadas con colores TECSUP
      boxShadow: {
        'tecsup': '0 4px 20px rgba(0, 91, 161, 0.08), 0 1px 4px rgba(0, 91, 161, 0.04)',
        'tecsup-lg': '0 10px 40px rgba(0, 91, 161, 0.12), 0 4px 16px rgba(0, 91, 161, 0.08)',
        'tecsup-hover': '0 8px 30px rgba(0, 91, 161, 0.15), 0 3px 12px rgba(0, 91, 161, 0.1)',
        'cyan': '0 4px 20px rgba(0, 176, 240, 0.08), 0 1px 4px rgba(0, 176, 240, 0.04)',
        'success': '0 4px 20px rgba(40, 167, 69, 0.08), 0 1px 4px rgba(40, 167, 69, 0.04)',
        'glass': '0 8px 32px rgba(0, 91, 161, 0.1)',
        'soft': '0 2px 8px rgba(52, 58, 64, 0.04), 0 1px 3px rgba(52, 58, 64, 0.02)',
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.25)'
      },
      // Backdrop blur personalizado
      backdropBlur: {
        xs: '2px'
      },
      // Espaciado personalizado
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      },
      // Breakpoints personalizados
      screens: {
        'xs': '475px',
        '3xl': '1600px'
      }
    },
  },
  plugins: [
    // Plugin personalizado para clases de utilidad TECSUP
    function({ addUtilities }) {
      const newUtilities = {
        '.hover-scale-gentle': {
          'transition': 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          '&:hover': {
            'transform': 'scale(1.02)'
          }
        },
        '.hover-glow': {
          'transition': 'box-shadow 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          '&:hover': {
            'box-shadow': '0 0 20px rgba(0, 91, 161, 0.15)'
          }
        },
        '.glass-effect-tecsup': {
          'backdrop-filter': 'blur(12px)',
          'background': 'rgba(0, 91, 161, 0.05)',
          'border': '1px solid rgba(0, 91, 161, 0.1)'
        }
      }
      addUtilities(newUtilities, ['responsive', 'hover'])
    }
  ]
}