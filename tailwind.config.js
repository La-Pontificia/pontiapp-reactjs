/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        slideIn: {
          from: {
            transform: 'translateY(100%)'
          },
          to: { transform: 'translateY(0px)' }
        },
        slideOut: {
          from: { transform: 'translateY(0px)' },
          to: { transform: 'translateY(100%)' }
        },
        swipeOut: {
          from: { transform: 'translateY(var(--radix-toast-swipe-end-y))' },
          to: { transform: 'translateY(100%)' }
        },
        'scale-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '35%': { transform: 'scale(1.03)' },
          '54%': { transform: 'scale(1)' },
          '75%': { transform: 'scale(1.15)' }
        }
      },
      animation: {
        hide: 'hide 200ms ease-in',
        slideIn: 'slideIn 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideOut: 'slideOut 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        swipeOut: 'swipeOut 200ms ease-out',
        'scale-pulse': 'scale-pulse 1.2s infinite ease-in-out'
      }
    }
  },
  darkMode: 'media',
  plugins: []
}
