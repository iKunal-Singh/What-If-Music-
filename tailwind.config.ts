
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
			colors: {
				border: 'var(--border)',
				input: 'var(--input)',
				ring: 'var(--ring)',
				background: 'var(--background)',
				foreground: 'var(--foreground)',
				primary: {
					DEFAULT: 'var(--primary)',
					foreground: 'var(--primary-foreground)'
				},
				secondary: {
					DEFAULT: 'var(--secondary)',
					foreground: 'var(--secondary-foreground)'
				},
				destructive: {
					DEFAULT: 'var(--destructive)',
					foreground: 'var(--destructive-foreground)'
				},
				muted: {
					DEFAULT: 'var(--muted)',
					foreground: 'var(--muted-foreground)'
				},
				accent: {
					DEFAULT: 'var(--accent)',
					foreground: 'var(--accent-foreground)'
				},
				popover: {
					DEFAULT: 'var(--popover)',
					foreground: 'var(--popover-foreground)'
				},
				card: {
					DEFAULT: 'var(--card)',
					foreground: 'var(--card-foreground)'
				},
				beatwave: {
					DEFAULT: 'var(--color-beatwave)',
					50: 'var(--color-beatwave-50)',
					100: 'var(--color-beatwave-100)',
					200: 'var(--color-beatwave-200)',
					300: 'var(--color-beatwave-300)',
					400: 'var(--color-beatwave-400)',
					500: 'var(--color-beatwave-500)',
					600: 'var(--color-beatwave-600)',
					700: 'var(--color-beatwave-700)',
					800: 'var(--color-beatwave-800)',
					900: 'var(--color-beatwave-900)',
					950: 'var(--color-beatwave-950)'
				},
				purple: {
					DEFAULT: 'var(--color-purple)',
					light: 'var(--color-purple-light)',
					dark: 'var(--color-purple-dark)'
				}
			},
			borderRadius: {
				lg: 'var(--radius-lg)',
				md: 'var(--radius-md)',
				sm: 'var(--radius-sm)',
			},
			fontFamily: {
				sans: 'var(--font-sans)',
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
					'0%': { opacity: '0', transform: 'translateY(5px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'hover-glow': {
					'0%': { boxShadow: '0 0 5px rgba(227, 66, 52, 0.5)' },
					'100%': { boxShadow: '0 0 15px rgba(227, 66, 52, 0.8)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
				'wave': 'wave 0.8s ease-in-out infinite',
				'fade-in': 'fade-in 0.2s ease-out',
				'hover-glow': 'hover-glow 1s ease-in-out infinite alternate'
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
