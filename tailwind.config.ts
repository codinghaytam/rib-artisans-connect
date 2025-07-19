
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
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					50: 'hsl(220 20% 98%)',
					100: 'hsl(218 20% 92%)',
					200: 'hsl(215 25% 84%)',
					300: 'hsl(213 27% 76%)',
					400: 'hsl(210 29% 69%)',
					500: 'hsl(207 32% 59%)',
					600: 'hsl(168 65% 40%)', // main primary
					700: 'hsl(168 65% 35%)',
					800: 'hsl(168 65% 30%)',
					900: 'hsl(168 65% 25%)'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
					50: 'hsl(51 100% 97%)',
					100: 'hsl(49 100% 91%)',
					200: 'hsl(47 100% 86%)',
					300: 'hsl(44 100% 80%)',
					400: 'hsl(41 100% 74%)',
					500: 'hsl(27 85% 64%)', // main secondary
					600: 'hsl(9 77% 58%)',
					700: 'hsl(8 68% 53%)',
					800: 'hsl(7 69% 50%)',
					900: 'hsl(5 64% 41%)'
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
					foreground: 'hsl(var(--accent-foreground))',
					teal: 'hsl(168 65% 40%)',
					'dark-teal': 'hsl(168 65% 32%)',
					rust: 'hsl(9 77% 58%)',
					amber: 'hsl(27 85% 64%)',
					navy: 'hsl(184 100% 20%)',
					cream: 'hsl(96 82% 97%)'
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
				// Islamic Geometric Harmony Colors
				navy: {
					50: 'hsl(184 100% 95%)',
					100: 'hsl(184 100% 90%)',
					200: 'hsl(184 100% 80%)',
					300: 'hsl(184 100% 70%)',
					400: 'hsl(184 100% 60%)',
					500: 'hsl(184 100% 50%)',
					600: 'hsl(184 100% 40%)',
					700: 'hsl(184 100% 30%)',
					800: 'hsl(184 100% 25%)',
					900: 'hsl(184 100% 20%)', // main navy
					950: 'hsl(184 100% 15%)'
				},
				teal: {
					50: 'hsl(168 65% 95%)',
					100: 'hsl(168 65% 90%)',
					200: 'hsl(168 65% 80%)',
					300: 'hsl(168 65% 70%)',
					400: 'hsl(168 65% 60%)',
					500: 'hsl(168 65% 50%)',
					600: 'hsl(168 65% 40%)', // main teal
					700: 'hsl(168 65% 35%)',
					800: 'hsl(168 65% 30%)',
					900: 'hsl(168 65% 25%)',
					950: 'hsl(168 65% 20%)'
				},
				rust: {
					50: 'hsl(9 77% 95%)',
					100: 'hsl(9 77% 90%)',
					200: 'hsl(9 77% 80%)',
					300: 'hsl(9 77% 70%)',
					400: 'hsl(9 77% 65%)',
					500: 'hsl(9 77% 58%)', // main rust
					600: 'hsl(9 77% 53%)',
					700: 'hsl(9 77% 48%)',
					800: 'hsl(9 77% 43%)',
					900: 'hsl(9 77% 38%)',
					950: 'hsl(9 77% 33%)'
				},
				amber: {
					50: 'hsl(27 85% 95%)',
					100: 'hsl(27 85% 90%)',
					200: 'hsl(27 85% 85%)',
					300: 'hsl(27 85% 80%)',
					400: 'hsl(27 85% 75%)',
					500: 'hsl(27 85% 70%)',
					600: 'hsl(27 85% 64%)', // main amber
					700: 'hsl(27 85% 59%)',
					800: 'hsl(27 85% 54%)',
					900: 'hsl(27 85% 49%)',
					950: 'hsl(27 85% 44%)'
				},
				cream: {
					50: 'hsl(96 82% 99%)',
					100: 'hsl(96 82% 97%)', // main cream
					200: 'hsl(96 82% 94%)',
					300: 'hsl(96 82% 91%)',
					400: 'hsl(96 82% 88%)',
					500: 'hsl(96 82% 85%)',
					600: 'hsl(96 82% 82%)',
					700: 'hsl(96 82% 79%)',
					800: 'hsl(96 82% 76%)',
					900: 'hsl(96 82% 73%)',
					950: 'hsl(96 82% 70%)'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))',
					light: 'hsl(168 65% 85%)',
					main: 'hsl(168 65% 40%)',
					dark: 'hsl(168 65% 32%)'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))',
					light: 'hsl(27 85% 85%)',
					main: 'hsl(27 85% 64%)',
					dark: 'hsl(27 85% 54%)'
				},
				error: {
					light: 'hsl(9 77% 85%)',
					main: 'hsl(9 77% 58%)',
					dark: 'hsl(9 77% 48%)'
				},
				info: {
					light: 'hsl(207 32% 85%)',
					main: 'hsl(207 32% 59%)',
					dark: 'hsl(207 32% 49%)'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-secondary': 'var(--gradient-secondary)',
				'gradient-accent': 'var(--gradient-accent)',
				'gradient-neutral': 'var(--gradient-neutral)',
				'geometric-pattern': 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23264653" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
			},
			boxShadow: {
				'geometric-sm': 'var(--shadow-sm)',
				'geometric-md': 'var(--shadow-md)',
				'geometric-lg': 'var(--shadow-lg)',
				'teal': 'var(--shadow-teal)',
				'rust': 'var(--shadow-rust)',
				'amber': 'var(--shadow-amber)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'geometric-pulse': {
					'0%, 100%': { opacity: '1', transform: 'scale(1)' },
					'50%': { opacity: '0.8', transform: 'scale(1.05)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'slide-in-from-left': {
					'0%': { transform: 'translateX(-100%)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				'slide-in-from-right': {
					'0%': { transform: 'translateX(100%)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'geometric-pulse': 'geometric-pulse 2s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'slide-in-left': 'slide-in-from-left 0.6s ease-out',
				'slide-in-right': 'slide-in-from-right 0.6s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
