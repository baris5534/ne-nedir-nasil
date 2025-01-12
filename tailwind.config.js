/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'neon-pulse': 'neon-pulse 2s infinite',
        'neon-glow': 'neon-glow 2s ease-in-out infinite',
        'neon-border': 'neon-border 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 3s infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        'neon-pulse': {
          '0%, 100%': {
            'box-shadow': '0 0 15px rgba(59,130,246,0.5), 0 0 30px rgba(99,102,241,0.5)',
            'border-color': 'rgba(99,102,241,0.7)'
          },
          '50%': {
            'box-shadow': '0 0 30px rgba(59,130,246,0.8), 0 0 60px rgba(99,102,241,0.8)',
            'border-color': 'rgba(99,102,241,1)'
          }
        },
        'neon-glow': {
          '0%, 100%': {
            'text-shadow': '0 0 10px rgba(59,130,246,0.5), 0 0 20px rgba(99,102,241,0.3)'
          },
          '50%': {
            'text-shadow': '0 0 20px rgba(59,130,246,0.8), 0 0 40px rgba(99,102,241,0.5)'
          }
        },
        'neon-border': {
          '0%, 100%': {
            'box-shadow': '0 0 15px rgba(59,130,246,0.3), inset 0 0 15px rgba(59,130,246,0.3)',
            'border-color': 'rgba(59,130,246,0.5)'
          },
          '50%': {
            'box-shadow': '0 0 30px rgba(59,130,246,0.5), inset 0 0 30px rgba(59,130,246,0.5)',
            'border-color': 'rgba(59,130,246,0.8)'
          }
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0)'
          },
          '50%': {
            transform: 'translateY(-10px)'
          }
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: .5 },
        },
      },
      boxShadow: {
        'neon-sm': '0 0 5px rgba(59,130,246,0.3), 0 0 10px rgba(59,130,246,0.2)',
        'neon': '0 0 10px rgba(59,130,246,0.5), 0 0 20px rgba(59,130,246,0.3)',
        'neon-lg': '0 0 20px rgba(59,130,246,0.5), 0 0 40px rgba(59,130,246,0.3)',
        'neon-xl': '0 0 30px rgba(59,130,246,0.5), 0 0 60px rgba(59,130,246,0.3)',
      },
    },
  },
  plugins: [],
}

