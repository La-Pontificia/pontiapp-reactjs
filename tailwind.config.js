/** @type {import('tailwindcss').Config} */
import Typography from '@tailwindcss/typography'
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/anni/dist/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
  	extend: {
  		keyframes: {
  			slideIn: {
  				from: {
  					transform: 'translateY(100%)'
  				},
  				to: {
  					transform: 'translateY(0px)'
  				}
  			},
  			slideOut: {
  				from: {
  					transform: 'translateY(0px)'
  				},
  				to: {
  					transform: 'translateY(100%)'
  				}
  			},
  			swipeOut: {
  				from: {
  					transform: 'translateY(var(--radix-toast-swipe-end-y))'
  				},
  				to: {
  					transform: 'translateY(100%)'
  				}
  			},
  			'scale-pulse': {
  				'0%, 100%': {
  					transform: 'scale(1)'
  				},
  				'35%': {
  					transform: 'scale(1.03)'
  				},
  				'54%': {
  					transform: 'scale(1)'
  				},
  				'75%': {
  					transform: 'scale(1.15)'
  				}
  			}
  		},
  		animation: {
  			hide: 'hide 200ms ease-in',
  			slideIn: 'slideIn 200ms cubic-bezier(0.16, 1, 0.3, 1)',
  			slideOut: 'slideOut 200ms cubic-bezier(0.16, 1, 0.3, 1)',
  			swipeOut: 'swipeOut 200ms ease-out',
  			'scale-pulse': 'scale-pulse 1.2s infinite ease-in-out'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		}
  	}
  },
  darkMode: 'class',
  plugins: [Typography(), require("tailwindcss-animate")]
}
