
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Poppins', 'sans-serif'],
				heading: ['Monoton', 'cursive'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				beatwave: {
					DEFAULT: '#E34234',
					50: '#FBD4D0',
					100: '#F9C1BC',
					200: '#F59B93',
					300: '#F0756B',
					400: '#EC5042',
					500: '#E34234',
					600: '#B62919',
					700: '#851E12',
					800: '#55130C',
					900: '#240805',
					950: '#100302'
				},
				fuchsia: {
					DEFAULT: '#FF00FF',
					50: '#FFF0FF',
					100: '#FFD6FF',
					200: '#FF8CFF',
					300: '#FF42FF',
					400: '#FF00FF',
					500: '#D600D6',
					600: '#AD00AD',
					700: '#850085',
					800: '#5C005C',
					900: '#330033',
					950: '#1F001F'
				},
				purple: {
					DEFAULT: '#800080',
					50: '#F5E0F5',
					100: '#EBC0EB',
					200: '#D680D6',
					300: '#C240C2',
					400: '#AD00AD',
					500: '#800080',
					600: '#660066',
					700: '#4D004D',
					800: '#330033',
					900: '#1A001A',
					950: '#0D000D'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'pulse-slow': {
					'0%, 100%': { opacity: '0.9' },
					'50%': { opacity: '0.5' }
				},
				'wave': {
					'0%': { transform: 'scaleY(0.5)' },
					'50%': { transform: 'scaleY(1)' },
					'100%': { transform: 'scaleY(0.5)' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'hover-glow': {
					'0%': { boxShadow: '0 0 5px rgba(255, 0, 255, 0.5)' },
					'100%': { boxShadow: '0 0 15px rgba(255, 0, 255, 0.8)' }
				},
				'neon-pulse': {
					'0%, 100%': { 
						boxShadow: '0 0 5px rgba(255, 0, 255, 0.5), 0 0 10px rgba(255, 0, 255, 0.3)'
					},
					'50%': { 
						boxShadow: '0 0 15px rgba(255, 0, 255, 0.8), 0 0 20px rgba(255, 0, 255, 0.5)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
				'wave': 'wave 1.2s ease-in-out infinite',
				'fade-in': 'fade-in 0.3s ease-out',
				'hover-glow': 'hover-glow 1.5s ease-in-out infinite alternate',
				'neon-pulse': 'neon-pulse 2s ease-in-out infinite alternate'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
